import { describe, it, expect, vi, beforeEach } from "vitest";

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

vi.mock("firebase-admin", () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = { serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP") };
  return {
    default: { firestore: fsFn, initializeApp: vi.fn() },
    firestore: fsFn,
    initializeApp: vi.fn(),
  };
});

const handlerContainer = vi.hoisted(() => ({ handler: null as any }));

vi.mock("firebase-functions/v1", () => {
  const chain = {
    region: () => ({
      auth: {
        user: () => ({
          onDelete: (handler: any) => {
            handlerContainer.handler = handler;
            return handler;
          },
        }),
      },
    }),
  };
  return { default: chain, ...chain };
});

vi.mock("firebase-functions/v2", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("../../utils/firestore-helpers", () => ({
  updateTenantStats: vi.fn().mockResolvedValue(undefined),
}));

// Import triggers the mock setup, capturing the handler
import "../../triggers/on-user-deleted";

describe("onUserDeleted", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should soft-delete user doc and deactivate memberships", async () => {
    const user = { uid: "user-1", email: "test@example.com" };

    // Memberships query
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: "mem-1",
          ref: { path: "userMemberships/mem-1" },
          data: () => ({ tenantId: "tenant-1", role: "teacher", status: "active" }),
        },
        {
          id: "mem-2",
          ref: { path: "userMemberships/mem-2" },
          data: () => ({ tenantId: "tenant-1", role: "student", status: "active" }),
        },
      ],
      size: 2,
    });

    await handlerContainer.handler(user);

    // Memberships should be batch-deactivated
    expect(mockBatch.update).toHaveBeenCalled();
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it("should handle user with no memberships", async () => {
    const user = { uid: "user-2", email: "lone@example.com" };

    mockGet.mockResolvedValueOnce({ docs: [], size: 0 });

    await handlerContainer.handler(user);

    expect(mockBatch.commit).toHaveBeenCalled(); // batch still commits (user doc update is in batch)
  });
});
