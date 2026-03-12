import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockSet = vi.fn().mockResolvedValue({});

const stableDb: any = {
  doc: vi.fn(() => ({ set: mockSet })),
};

vi.mock('firebase-admin', () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = { serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP') };
  return { default: { firestore: fsFn, initializeApp: vi.fn() }, firestore: fsFn, initializeApp: vi.fn() };
});

vi.mock('firebase-functions/v2/identity', () => ({
  beforeUserCreated: vi.fn((_opts: any, handler: any) => handler),
}));

// Use the actual module name — onUserCreated is likely an auth trigger
vi.mock('firebase-functions/v2/auth', () => ({
  onAuthUserCreated: vi.fn((_opts: any, handler: any) => handler),
}));

vi.mock('firebase-functions/v2', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { onUserCreated } from '../../triggers/on-user-created';
const handler = onUserCreated as any;

describe('onUserCreated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user document when auth account is created', async () => {
    const event = {
      data: {
        uid: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        providerData: [{ providerId: 'password' }],
      },
    };

    await handler(event);

    expect(stableDb.doc).toHaveBeenCalledWith('users/user-1');
    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.email).toBe('test@example.com');
    expect(setData.isSuperAdmin).toBe(false);
    expect(setData.status).toBe('active');
  });

  it('should handle user with no display name', async () => {
    const event = {
      data: {
        uid: 'user-2',
        email: 'nodisplay@example.com',
        displayName: null,
        photoURL: null,
        providerData: [],
      },
    };

    await handler(event);

    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.displayName).toBe('nodisplay'); // email prefix fallback
  });

  it('should handle Google provider', async () => {
    const event = {
      data: {
        uid: 'user-3',
        email: 'google@gmail.com',
        displayName: 'Google User',
        photoURL: 'https://photo.google.com/avatar',
        providerData: [{ providerId: 'google.com' }],
      },
    };

    await handler(event);

    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.photoURL).toBe('https://photo.google.com/avatar');
  });
});
