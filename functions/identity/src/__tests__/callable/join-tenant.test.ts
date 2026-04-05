import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockCreate = vi.fn();
const mockDocRef = {
  get: mockGet,
  set: mockSet,
  update: mockUpdate,
  create: mockCreate,
  id: "auto-id",
};

const stableDb: any = {
  doc: vi.fn(() => mockDocRef),
  collection: vi.fn(() => ({
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: mockGet,
    doc: vi.fn(() => mockDocRef),
  })),
};

vi.mock("firebase-admin", () => {
  const fsFn: any = () => stableDb;
  fsFn.FieldValue = {
    serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
    increment: vi.fn((n: number) => `INCREMENT(${n})`),
  };
  return {
    default: {
      firestore: fsFn,
      auth: () => ({
        setCustomUserClaims: vi.fn(),
        getUser: vi.fn().mockResolvedValue({ uid: "user-1" }),
      }),
      initializeApp: vi.fn(),
    },
    firestore: fsFn,
    auth: () => ({
      setCustomUserClaims: vi.fn(),
      getUser: vi.fn().mockResolvedValue({ uid: "user-1" }),
    }),
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
  getUser: vi.fn().mockResolvedValue({ uid: "user-1" }),
  getTenant: vi.fn().mockResolvedValue({ status: "active" }),
  assertTenantAccessible: vi.fn().mockResolvedValue(undefined),
  buildClaimsForMembership: vi.fn().mockReturnValue({ role: "student" }),
  parseRequest: vi.fn((data: any) => data),
}));

vi.mock("../../utils/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(undefined),
}));

import { joinTenant } from "../../callable/join-tenant";
const handler = joinTenant as any;

function makeRequest(data: Record<string, unknown>, auth?: { uid: string } | null) {
  return {
    data,
    auth: auth === null ? undefined : (auth ?? { uid: "user-1" }),
    rawRequest: {} as any,
  };
}

describe("joinTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mockGet to clear any unused mockResolvedValueOnce from previous tests
    mockGet.mockReset();
  });

  it("should throw unauthenticated when no auth", async () => {
    await expect(handler(makeRequest({ tenantCode: "GRN001" }, null))).rejects.toThrow();
  });

  it("should throw when tenant code is missing", async () => {
    await expect(handler(makeRequest({}))).rejects.toThrow();
  });

  it("should throw when tenant code not found", async () => {
    // tenantCodes lookup returns nothing
    mockGet.mockResolvedValueOnce({ exists: false });
    await expect(handler(makeRequest({ tenantCode: "INVALID" }))).rejects.toThrow();
  });

  it("should create membership when valid tenant code provided", async () => {
    // tenantCodes doc exists
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ tenantId: "tenant-1" }),
    });

    // Check existing membership — none found
    mockGet.mockResolvedValueOnce({ empty: true, docs: [] });

    // User doc exists
    mockGet.mockResolvedValueOnce({ exists: true, data: () => ({ uid: "user-1" }) });

    // Membership create succeeds
    mockSet.mockResolvedValueOnce({});

    const result = await handler(makeRequest({ tenantCode: "GRN001" }));
    expect(result).toBeDefined();
    expect(mockSet).toHaveBeenCalled();
  });

  it("should reactivate deactivated membership", async () => {
    // Track all mockGet calls
    const membershipRef = { update: vi.fn().mockResolvedValue({}) };

    // Call 1: tenantCodes doc exists
    // Call 2: existing membership doc (direct doc.get())
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ tenantId: "tenant-1" }),
      })
      .mockResolvedValueOnce({
        exists: true,
        ref: membershipRef,
        data: () => ({
          uid: "user-1",
          tenantId: "tenant-1",
          status: "deactivated",
          role: "student",
        }),
      });

    const result = await handler(makeRequest({ tenantCode: "GRN001" }));
    expect(result).toBeDefined();
    expect(result.role).toBe("student");
    expect(membershipRef.update).toHaveBeenCalled();
  });
});
