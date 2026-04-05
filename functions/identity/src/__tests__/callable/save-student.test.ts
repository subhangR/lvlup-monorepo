/**
 * Unit tests for saveStudent callable.
 * Tests create/update, class assignment, membership creation, and claims.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpsError } from "firebase-functions/v2/https";

// ── Mock firebase-admin ─────────────────────────────────────────────
const mockDocGet = vi.fn();
const mockDocSet = vi.fn();
const mockDocUpdate = vi.fn();
const mockCollectionDoc = vi.fn();
const mockDocRef = vi.fn();
const mockGetUser = vi.fn();
const mockSetCustomUserClaims = vi.fn();

vi.mock("firebase-admin", () => {
  const firestoreFn = () => ({
    collection: (path: string) => ({
      doc: (id?: string) => {
        mockCollectionDoc(path, id);
        const docId = id ?? "auto-student-id";
        return {
          id: docId,
          get: mockDocGet,
          set: mockDocSet,
          update: mockDocUpdate,
        };
      },
    }),
    doc: (path: string) => {
      mockDocRef(path);
      return {
        id: path.split("/").pop(),
        get: mockDocGet,
        set: mockDocSet,
        update: mockDocUpdate,
      };
    },
  });
  firestoreFn.FieldValue = {
    serverTimestamp: () => "SERVER_TIMESTAMP",
    increment: (n: number) => `INCREMENT(${n})`,
    arrayUnion: (...args: unknown[]) => ({ _type: "arrayUnion", values: args }),
    arrayRemove: (...args: unknown[]) => ({ _type: "arrayRemove", values: args }),
  };
  return {
    default: {
      firestore: firestoreFn,
      auth: () => ({
        getUser: mockGetUser,
        setCustomUserClaims: mockSetCustomUserClaims,
      }),
      initializeApp: vi.fn(),
      apps: [{}],
    },
    firestore: firestoreFn,
    auth: () => ({
      getUser: mockGetUser,
      setCustomUserClaims: mockSetCustomUserClaims,
    }),
    initializeApp: vi.fn(),
    apps: [{}],
  };
});

const mockAssertTenantAdminOrSuperAdmin = vi.fn();
const mockGetTenant = vi.fn();
const mockBuildClaimsForMembership = vi.fn();

vi.mock("../../utils", () => ({
  assertTenantAdminOrSuperAdmin: (...args: unknown[]) => mockAssertTenantAdminOrSuperAdmin(...args),
  getTenant: (...args: unknown[]) => mockGetTenant(...args),
  buildClaimsForMembership: (...args: unknown[]) => mockBuildClaimsForMembership(...args),
  parseRequest: vi.fn((data: any) => data),
}));

vi.mock("../../utils/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("firebase-functions/v2/https", () => ({
  onCall: (_opts: any, handler: any) => handler,
  HttpsError: class HttpsError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
      this.name = "HttpsError";
    }
  },
}));

vi.mock("firebase-functions/v2", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { saveStudent } from "../../callable/save-student";

const handler = saveStudent as unknown as (request: any) => Promise<any>;

describe("saveStudent", () => {
  const tenantId = "tenant-1";
  const callerUid = "admin-uid";

  beforeEach(() => {
    vi.clearAllMocks();
    mockAssertTenantAdminOrSuperAdmin.mockResolvedValue(undefined);
    mockGetTenant.mockResolvedValue({ status: "active", tenantCode: "T001" });
    mockBuildClaimsForMembership.mockReturnValue({ role: "student", tenantId });
    mockGetUser.mockResolvedValue({ customClaims: {} });
    mockSetCustomUserClaims.mockResolvedValue(undefined);
    mockDocSet.mockResolvedValue(undefined);
    mockDocUpdate.mockResolvedValue(undefined);
  });

  // ── Auth ──────────────────────────────────────────────────────────

  it("throws unauthenticated when no auth", async () => {
    await expect(handler({ auth: null, data: { tenantId, data: {} } })).rejects.toThrow(
      "Must be logged in"
    );
  });

  // ── CREATE ────────────────────────────────────────────────────────

  it("creates student and returns { id, created: true }", async () => {
    const result = await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-s1", classIds: ["class-1"] } },
    });

    expect(result.created).toBe(true);
    expect(result.id).toBeDefined();
  });

  it("throws when uid is missing on create", async () => {
    await expect(
      handler({ auth: { uid: callerUid }, data: { tenantId, data: {} } })
    ).rejects.toThrow("uid is required");
  });

  it("throws when tenant is inactive", async () => {
    mockGetTenant.mockResolvedValue({ status: "suspended" });

    await expect(
      handler({ auth: { uid: callerUid }, data: { tenantId, data: { uid: "u1" } } })
    ).rejects.toThrow("Tenant not found or inactive");
  });

  it("creates UserMembership with student role", async () => {
    await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-s1" } },
    });

    // mockDocSet is called twice: once for student doc, once for membership
    expect(mockDocSet).toHaveBeenCalledTimes(2);
    const membershipData = mockDocSet.mock.calls[1][0];
    expect(membershipData.role).toBe("student");
    expect(membershipData.uid).toBe("user-s1");
  });

  it("sets custom claims after creating membership", async () => {
    await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-s1" } },
    });

    expect(mockGetUser).toHaveBeenCalledWith("user-s1");
    expect(mockSetCustomUserClaims).toHaveBeenCalled();
  });

  it("adds student to each assigned class on create", async () => {
    await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-s1", classIds: ["c1", "c2"] } },
    });

    // Two class updates for c1 and c2
    const classUpdateCalls = mockDocUpdate.mock.calls;
    expect(classUpdateCalls.length).toBe(2);
  });

  // ── UPDATE ────────────────────────────────────────────────────────

  it("updates student and returns { id, created: false }", async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ classIds: ["c1"] }) });

    const result = await handler({
      auth: { uid: callerUid },
      data: { id: "stu-1", tenantId, data: { rollNumber: "101" } },
    });

    expect(result).toEqual({ id: "stu-1", created: false });
  });

  it("throws not-found when updating non-existing student", async () => {
    mockDocGet.mockResolvedValue({ exists: false });

    await expect(
      handler({
        auth: { uid: callerUid },
        data: { id: "missing", tenantId, data: { rollNumber: "x" } },
      })
    ).rejects.toThrow("Student not found");
  });

  it("handles classIds reassignment: adds and removes from classes", async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ classIds: ["c1", "c2"] }) });

    await handler({
      auth: { uid: callerUid },
      data: { id: "stu-1", tenantId, data: { classIds: ["c2", "c3"] } },
    });

    // Should update: add to c3, remove from c1, then update student doc
    // mockDocUpdate called for: add c3 + remove c1 + student update = 3
    expect(mockDocUpdate).toHaveBeenCalledTimes(3);
  });
});
