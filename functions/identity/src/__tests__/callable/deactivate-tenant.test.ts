import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockBatch = { update: vi.fn(), commit: vi.fn() };

const stableDb: any = {
  doc: vi.fn(() => ({ get: mockGet, set: mockSet, update: mockUpdate })),
  collection: vi.fn(() => ({
    where: vi.fn().mockReturnThis(),
    get: mockGet,
    doc: vi.fn(() => ({ get: mockGet })),
  })),
  batch: vi.fn(() => mockBatch),
};

vi.mock('firebase-admin', () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = {
    serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
  };
  return { default: { firestore: fsFn, initializeApp: vi.fn() }, firestore: fsFn, initializeApp: vi.fn() };
});

vi.mock('firebase-functions/v2/https', () => ({
  onCall: vi.fn((_opts: any, handler: any) => handler),
  HttpsError: class HttpsError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock('firebase-functions/v2', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../../utils/auth', () => ({
  assertSuperAdmin: vi.fn(),
}));

vi.mock('../../utils/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}));

vi.mock('../../utils/tenant-actions', () => ({
  logTenantAction: vi.fn(),
}));

import { deactivateTenant } from '../../callable/deactivate-tenant';
const handler = deactivateTenant as any;

function makeRequest(data: Record<string, unknown>, auth?: { uid: string } | null) {
  return {
    data,
    auth: auth === null ? undefined : (auth ?? { uid: 'superadmin-1', token: { isSuperAdmin: true } }),
    rawRequest: {} as any,
  };
}

describe('deactivateTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw unauthenticated when no auth', async () => {
    await expect(handler(makeRequest({ tenantId: 'tenant-1' }, null))).rejects.toThrow();
  });

  it('should throw when tenant not found', async () => {
    mockGet.mockResolvedValueOnce({ exists: false });
    await expect(handler(makeRequest({ tenantId: 'nonexistent' }))).rejects.toThrow();
  });

  it('should throw when tenant already deactivated', async () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ status: 'deactivated' }),
    });
    await expect(handler(makeRequest({ tenantId: 'tenant-1' }))).rejects.toThrow();
  });

  it('should deactivate tenant and suspend memberships', async () => {
    // Tenant exists and is active
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ status: 'active', name: 'Test School' }),
    });

    // Active memberships
    mockGet.mockResolvedValueOnce({
      docs: [
        { id: 'mem-1', ref: { path: 'userMemberships/mem-1' }, data: () => ({ status: 'active', role: 'teacher' }) },
        { id: 'mem-2', ref: { path: 'userMemberships/mem-2' }, data: () => ({ status: 'active', role: 'student' }) },
      ],
    });

    const result = await handler(makeRequest({ tenantId: 'tenant-1', reason: 'Non-payment' }));

    expect(result).toMatchObject({ success: true });
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it('should handle tenant with no active memberships', async () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ status: 'active' }),
    });

    mockGet.mockResolvedValueOnce({ docs: [] });

    const result = await handler(makeRequest({ tenantId: 'tenant-1' }));
    expect(result).toMatchObject({ success: true });
  });
});
