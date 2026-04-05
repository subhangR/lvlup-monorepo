import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockDocRef = {
  get: mockGet,
  set: mockSet,
  update: mockUpdate,
  delete: mockDelete,
  id: "preset-1",
};

const stableDb: any = {
  doc: vi.fn(() => mockDocRef),
  collection: vi.fn(() => ({
    doc: vi.fn(() => mockDocRef),
  })),
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

vi.mock("firebase-functions/v2/https", () => ({
  onCall: vi.fn((_opts: any, handler: any) => handler),
  HttpsError: class HttpsError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock("firebase-functions/v2", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("../../utils", () => ({
  getUser: vi.fn().mockResolvedValue({ isSuperAdmin: true }),
  parseRequest: vi.fn((data: any) => data),
}));

vi.mock("../../utils/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(undefined),
}));

import { saveGlobalEvaluationPreset } from "../../callable/save-global-preset";
const handler = saveGlobalEvaluationPreset as any;

function makeRequest(data: Record<string, unknown>, auth?: { uid: string } | null) {
  return {
    data,
    auth:
      auth === null ? undefined : (auth ?? { uid: "superadmin-1", token: { isSuperAdmin: true } }),
    rawRequest: {} as any,
  };
}

describe("saveGlobalEvaluationPreset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw unauthenticated when no auth", async () => {
    await expect(handler(makeRequest({ name: "Test" }, null))).rejects.toThrow();
  });

  it("should create a new preset", async () => {
    mockSet.mockResolvedValueOnce({});

    const result = await handler(
      makeRequest({
        data: {
          name: "Standard Rubric",
          description: "Default evaluation preset",
          isPublic: true,
        },
      })
    );

    expect(result).toBeDefined();
    expect(result.created).toBe(true);
    expect(mockSet).toHaveBeenCalled();
  });

  it("should throw when creating without a name", async () => {
    await expect(handler(makeRequest({ data: {} }))).rejects.toThrow();
  });

  it("should update an existing preset", async () => {
    mockGet.mockResolvedValueOnce({ exists: true, data: () => ({ name: "Old Name" }) });
    mockUpdate.mockResolvedValueOnce({});

    const result = await handler(
      makeRequest({
        id: "preset-1",
        data: { name: "Updated Rubric" },
      })
    );

    expect(result).toBeDefined();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should throw not-found when updating nonexistent preset", async () => {
    mockGet.mockResolvedValueOnce({ exists: false });

    await expect(
      handler(makeRequest({ id: "nonexistent", data: { name: "Updated" } }))
    ).rejects.toThrow();
  });

  it("should delete a preset", async () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ name: "To Delete", isDefault: false }),
    });
    mockDelete.mockResolvedValueOnce({});

    const result = await handler(makeRequest({ id: "preset-1", delete: true }));
    expect(result).toMatchObject({ deleted: true });
    expect(mockDelete).toHaveBeenCalled();
  });
});
