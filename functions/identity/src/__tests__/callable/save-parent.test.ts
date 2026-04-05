/**
 * Unit tests for saveParent callable.
 * Tests create/update, child-student linking, and validation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpsError } from "firebase-functions/v2/https";

// ── Mock firebase-admin ─────────────────────────────────────────────
const mockDocGet = vi.fn();
const mockDocSet = vi.fn();
const mockDocUpdate = vi.fn();
const mockCollectionDoc = vi.fn();
const mockDocRef = vi.fn();

vi.mock("firebase-admin", () => {
  const firestoreFn = () => ({
    collection: (path: string) => ({
      doc: (id?: string) => {
        mockCollectionDoc(path, id);
        return {
          id: id ?? "auto-parent-id",
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
      initializeApp: vi.fn(),
      apps: [{}],
    },
    firestore: firestoreFn,
    initializeApp: vi.fn(),
    apps: [{}],
  };
});

const mockAssertTenantAdminOrSuperAdmin = vi.fn();
const mockGetTenant = vi.fn();

vi.mock("../../utils", () => ({
  assertTenantAdminOrSuperAdmin: (...args: unknown[]) => mockAssertTenantAdminOrSuperAdmin(...args),
  getTenant: (...args: unknown[]) => mockGetTenant(...args),
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

import { saveParent } from "../../callable/save-parent";

const handler = saveParent as unknown as (request: any) => Promise<any>;

describe("saveParent", () => {
  const tenantId = "tenant-1";
  const callerUid = "admin-uid";

  beforeEach(() => {
    vi.clearAllMocks();
    mockAssertTenantAdminOrSuperAdmin.mockResolvedValue(undefined);
    mockGetTenant.mockResolvedValue({ status: "active", tenantCode: "T001" });
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

  it("creates parent and returns { id, created: true }", async () => {
    const result = await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-p1", childStudentIds: ["stu-1"] } },
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
    mockGetTenant.mockResolvedValue({ status: "expired" });

    await expect(
      handler({ auth: { uid: callerUid }, data: { tenantId, data: { uid: "u1" } } })
    ).rejects.toThrow("Tenant not found or inactive");
  });

  it("links parent to child students on create", async () => {
    await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-p1", childStudentIds: ["stu-1", "stu-2"] } },
    });

    // Student updates: 2 (one for each child)
    expect(mockDocUpdate).toHaveBeenCalledTimes(2);
  });

  it("creates parent doc with correct fields", async () => {
    await handler({
      auth: { uid: callerUid },
      data: { tenantId, data: { uid: "user-p1" } },
    });

    expect(mockDocSet).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "user-p1",
        tenantId,
        childStudentIds: [],
        status: "active",
      })
    );
  });

  // ── UPDATE ────────────────────────────────────────────────────────

  it("updates parent and returns { id, created: false }", async () => {
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ childStudentIds: ["stu-1"] }),
    });

    const result = await handler({
      auth: { uid: callerUid },
      data: { id: "par-1", tenantId, data: { status: "archived" } },
    });

    expect(result).toEqual({ id: "par-1", created: false });
  });

  it("throws not-found when updating non-existing parent", async () => {
    mockDocGet.mockResolvedValue({ exists: false });

    await expect(
      handler({ auth: { uid: callerUid }, data: { id: "missing", tenantId, data: {} } })
    ).rejects.toThrow("Parent not found");
  });

  it("handles childStudentIds changes: adds and removes links", async () => {
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ childStudentIds: ["stu-1", "stu-2"] }),
    });

    await handler({
      auth: { uid: callerUid },
      data: { id: "par-1", tenantId, data: { childStudentIds: ["stu-2", "stu-3"] } },
    });

    // add stu-3 + remove stu-1 + parent update = 3
    expect(mockDocUpdate).toHaveBeenCalledTimes(3);
  });
});
