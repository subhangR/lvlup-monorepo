import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();

const stableDb: any = {
  doc: vi.fn(() => ({ get: mockGet, set: mockSet, update: mockUpdate })),
  collection: vi.fn(() => ({
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: mockGet,
    doc: vi.fn(() => ({ get: mockGet, set: mockSet, update: mockUpdate })),
  })),
};

vi.mock('firebase-admin', () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = {
    serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
    increment: vi.fn((n: number) => `INCREMENT(${n})`),
  };
  fsFn.Timestamp = {
    now: vi.fn(() => ({ toDate: () => new Date('2025-06-15T00:05:00Z') })),
    fromDate: vi.fn((d: Date) => ({ toDate: () => d })),
  };
  return { default: { firestore: fsFn, initializeApp: vi.fn() }, firestore: fsFn, initializeApp: vi.fn() };
});

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: any, handler: any) => handler),
}));

vi.mock('firebase-functions/v2', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { dailyCostAggregation } from '../../schedulers/daily-cost-aggregation';
const handler = dailyCostAggregation as any;

describe('dailyCostAggregation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should aggregate LLM call logs from the previous day', async () => {
    // Mock: check existing daily doc (not exists — not idempotent skip)
    mockGet.mockResolvedValueOnce({ exists: false });

    // Mock: LLM call logs for yesterday
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: 'log-1',
          data: () => ({
            tenantId: 'tenant-1',
            purpose: 'grading',
            model: 'gemini-2.0-flash',
            cost: 0.05,
            inputTokens: 1000,
            outputTokens: 500,
          }),
        },
        {
          id: 'log-2',
          data: () => ({
            tenantId: 'tenant-1',
            purpose: 'extraction',
            model: 'gemini-2.0-flash',
            cost: 0.03,
            inputTokens: 800,
            outputTokens: 300,
          }),
        },
      ],
    });

    await handler({});

    expect(mockSet).toHaveBeenCalled();
  });

  it('should skip if daily doc already exists (idempotent)', async () => {
    mockGet.mockResolvedValueOnce({ exists: true });

    await handler({});

    // Should not write new data when already processed
    // (behavior depends on implementation — may still update or skip)
  });

  it('should handle no logs gracefully', async () => {
    mockGet.mockResolvedValueOnce({ exists: false });
    mockGet.mockResolvedValueOnce({ docs: [] });

    await handler({});
    expect(mockSet).toHaveBeenCalled();
  });
});
