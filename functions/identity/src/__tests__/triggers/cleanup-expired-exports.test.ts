import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockDelete = vi.fn().mockResolvedValue(undefined);
const mockGetFiles = vi.fn();
const mockBucket = vi.fn(() => ({
  getFiles: mockGetFiles,
}));

vi.mock('firebase-admin', () => ({
  default: {
    storage: () => ({ bucket: mockBucket }),
    initializeApp: vi.fn(),
  },
  storage: () => ({ bucket: mockBucket }),
  initializeApp: vi.fn(),
}));

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: (_opts: any, handler: any) => handler,
}));

vi.mock('firebase-functions/v2', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { cleanupExpiredExports } from '../../triggers/cleanup-expired-exports';
import { logger } from 'firebase-functions/v2';

const handler = cleanupExpiredExports as any;

function makeFile(
  name: string,
  deleteAfter: string | undefined,
  opts?: { invalidDate?: boolean },
) {
  return {
    name,
    metadata: {
      metadata: deleteAfter !== undefined ? { deleteAfter } : {},
    },
    delete: mockDelete,
  };
}

describe('cleanupExpiredExports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delete files past their deleteAfter date', async () => {
    const expiredFile = makeFile('exports/creds-1.csv', '2025-06-15T11:00:00Z');
    mockGetFiles.mockResolvedValueOnce([[expiredFile]]);

    await handler();

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'Deleted expired export file: exports/creds-1.csv',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'Cleanup complete: 1 expired files deleted out of 1 total',
    );
  });

  it('should skip files not yet expired', async () => {
    const futureFile = makeFile('exports/creds-2.csv', '2025-06-15T13:00:00Z');
    mockGetFiles.mockResolvedValueOnce([[futureFile]]);

    await handler();

    expect(mockDelete).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      'Cleanup complete: 0 expired files deleted out of 1 total',
    );
  });

  it('should skip files without deleteAfter metadata', async () => {
    const noMeta = makeFile('exports/creds-3.csv', undefined);
    mockGetFiles.mockResolvedValueOnce([[noMeta]]);

    await handler();

    expect(mockDelete).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      'Cleanup complete: 0 expired files deleted out of 1 total',
    );
  });

  it('should skip files with invalid deleteAfter date', async () => {
    const invalidDate = makeFile('exports/creds-4.csv', 'not-a-date');
    mockGetFiles.mockResolvedValueOnce([[invalidDate]]);

    await handler();

    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('should handle empty file list', async () => {
    mockGetFiles.mockResolvedValueOnce([[]]);

    await handler();

    expect(mockDelete).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      'Cleanup complete: 0 expired files deleted out of 0 total',
    );
  });

  it('should delete expired files and skip non-expired ones', async () => {
    const expired = makeFile('exports/old.csv', '2025-06-15T10:00:00Z');
    const valid = makeFile('exports/new.csv', '2025-06-16T10:00:00Z');
    const noMeta = makeFile('exports/bare.csv', undefined);
    mockGetFiles.mockResolvedValueOnce([[expired, valid, noMeta]]);

    await handler();

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'Cleanup complete: 1 expired files deleted out of 3 total',
    );
  });

  it('should log warning and continue if a file deletion fails', async () => {
    const err = new Error('Storage error');
    const failFile = {
      name: 'exports/fail.csv',
      metadata: { metadata: { deleteAfter: '2025-06-14T00:00:00Z' } },
      delete: vi.fn().mockRejectedValueOnce(err),
    };
    const okFile = makeFile('exports/ok.csv', '2025-06-14T00:00:00Z');
    mockGetFiles.mockResolvedValueOnce([[failFile, okFile]]);

    await handler();

    expect(logger.warn).toHaveBeenCalledWith(
      'Failed to delete expired export file: exports/fail.csv',
      err,
    );
    // The second file should still be deleted
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('should delete file whose deleteAfter equals current time', async () => {
    const exactFile = makeFile('exports/exact.csv', '2025-06-15T12:00:00Z');
    mockGetFiles.mockResolvedValueOnce([[exactFile]]);

    await handler();

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
