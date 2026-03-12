import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockGet = vi.fn();
const mockUpdate = vi.fn().mockResolvedValue({});
const mockBatch = { update: vi.fn(), commit: vi.fn().mockResolvedValue({}) };

const stableDb: any = {
  doc: vi.fn(() => ({ get: mockGet, update: mockUpdate })),
  collection: vi.fn(() => ({
    where: vi.fn().mockReturnThis(),
    get: mockGet,
  })),
  batch: vi.fn(() => mockBatch),
};

vi.mock('firebase-admin', () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = { serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP') };
  return { default: { firestore: fsFn, initializeApp: vi.fn() }, firestore: fsFn, initializeApp: vi.fn() };
});

vi.mock('firebase-functions/v2/auth', () => ({
  onAuthUserDeleted: vi.fn((_opts: any, handler: any) => handler),
}));

vi.mock('firebase-functions/v2', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../../utils/tenant-stats', () => ({
  updateTenantStats: vi.fn(),
}));

import { onUserDeleted } from '../../triggers/on-user-deleted';
const handler = onUserDeleted as any;

describe('onUserDeleted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should soft-delete user doc and deactivate memberships', async () => {
    const event = {
      data: { uid: 'user-1', email: 'test@example.com' },
    };

    // Memberships query
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: 'mem-1',
          ref: { path: 'userMemberships/mem-1' },
          data: () => ({ tenantId: 'tenant-1', role: 'teacher', status: 'active' }),
        },
        {
          id: 'mem-2',
          ref: { path: 'userMemberships/mem-2' },
          data: () => ({ tenantId: 'tenant-1', role: 'student', status: 'active' }),
        },
      ],
    });

    await handler(event);

    // User doc should be soft-deleted
    expect(mockUpdate).toHaveBeenCalled();
    // Memberships should be batch-deactivated
    expect(mockBatch.update).toHaveBeenCalled();
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it('should handle user with no memberships', async () => {
    const event = {
      data: { uid: 'user-2', email: 'lone@example.com' },
    };

    mockGet.mockResolvedValueOnce({ docs: [] });

    await handler(event);

    expect(mockUpdate).toHaveBeenCalled(); // Still soft-delete user doc
    expect(mockBatch.commit).not.toHaveBeenCalled(); // No batch needed
  });
});
