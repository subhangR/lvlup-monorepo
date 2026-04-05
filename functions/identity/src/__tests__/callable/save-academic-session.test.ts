/**
 * Unit tests for saveAcademicSession callable.
 * Tests create/update, isCurrent flag management, and batch operations.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpsError } from "firebase-functions/v2/https";

// ── Mock firebase-admin ─────────────────────────────────────────────
const mockDocGet = vi.fn();
const mockDocSet = vi.fn();
const mockDocUpdate = vi.fn();
const mockCollectionDoc = vi.fn();
const mockDocRef = vi.fn();
const mockBatchSet = vi.fn();
const mockBatchUpdate = vi.fn();
const mockBatchCommit = vi.fn();
const mockWhereGet = vi.fn();

vi.mock("firebase-admin", () => {
  const firestoreFn = () => ({
    collection: (path: string) => ({
      doc: (id?: string) => {
        mockCollectionDoc(path, id);
        return {
          id: id ?? "auto-session-id",
          ref: { id: id ?? "auto-session-id" },
          get: mockDocGet,
          set: mockDocSet,
          update: mockDocUpdate,
        };
      },
      where: () => ({
        get: mockWhereGet,
      }),
    }),
    doc: (path: string) => {
      mockDocRef(path);
      return {
        id: path.split("/").pop(),
        ref: { id: path.split("/").pop() },
        get: mockDocGet,
        set: mockDocSet,
        update: mockDocUpdate,
      };
    },
    batch: () => ({
      set: mockBatchSet,
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    }),
  });
  firestoreFn.FieldValue = {
    serverTimestamp: () => "SERVER_TIMESTAMP",
    increment: (n: number) => `INCREMENT(${n})`,
  };
  firestoreFn.Timestamp = {
    fromDate: (d: Date) => ({ _seconds: Math.floor(d.getTime() / 1000), toDate: () => d }),
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

import { saveAcademicSession } from "../../callable/save-academic-session";

const handler = saveAcademicSession as unknown as (request: any) => Promise<any>;

describe("saveAcademicSession", () => {
  const tenantId = "tenant-1";
  const callerUid = "admin-uid";

  beforeEach(() => {
    vi.clearAllMocks();
    mockAssertTenantAdminOrSuperAdmin.mockResolvedValue(undefined);
    mockGetTenant.mockResolvedValue({ status: "active", tenantCode: "T001" });
    mockDocSet.mockResolvedValue(undefined);
    mockDocUpdate.mockResolvedValue(undefined);
    mockBatchCommit.mockResolvedValue(undefined);
    mockWhereGet.mockResolvedValue({ docs: [] });
  });

  // ── Auth ──────────────────────────────────────────────────────────

  it("throws unauthenticated when no auth", async () => {
    await expect(handler({ auth: null, data: { tenantId, data: {} } })).rejects.toThrow(
      "Must be logged in"
    );
  });

  // ── CREATE ────────────────────────────────────────────────────────

  it("creates session and returns { id, created: true }", async () => {
    const result = await handler({
      auth: { uid: callerUid },
      data: {
        tenantId,
        data: { name: "2025-2026", startDate: "2025-06-01", endDate: "2026-05-31" },
      },
    });

    expect(result.created).toBe(true);
    expect(result.id).toBeDefined();
  });

  it("throws when required fields are missing on create", async () => {
    await expect(
      handler({ auth: { uid: callerUid }, data: { tenantId, data: { name: "Partial" } } })
    ).rejects.toThrow("name, startDate, and endDate are required");
  });

  it("throws when tenant is inactive", async () => {
    mockGetTenant.mockResolvedValue({ status: "suspended" });

    await expect(
      handler({
        auth: { uid: callerUid },
        data: { tenantId, data: { name: "X", startDate: "2025-01-01", endDate: "2025-12-31" } },
      })
    ).rejects.toThrow("Tenant not found or inactive");
  });

  it("uses batch when isCurrent is true to unset previous current", async () => {
    const existingDoc = {
      id: "old-session",
      ref: { id: "old-session" },
    };
    mockWhereGet.mockResolvedValue({ docs: [existingDoc] });

    await handler({
      auth: { uid: callerUid },
      data: {
        tenantId,
        data: {
          name: "2025-2026",
          startDate: "2025-06-01",
          endDate: "2026-05-31",
          isCurrent: true,
        },
      },
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
    expect(mockBatchSet).toHaveBeenCalled();
    expect(mockBatchCommit).toHaveBeenCalled();
  });

  it("creates without batch when isCurrent is false", async () => {
    await handler({
      auth: { uid: callerUid },
      data: {
        tenantId,
        data: { name: "2024-2025", startDate: "2024-06-01", endDate: "2025-05-31" },
      },
    });

    expect(mockDocSet).toHaveBeenCalled();
    expect(mockBatchCommit).not.toHaveBeenCalled();
  });

  // ── UPDATE ────────────────────────────────────────────────────────

  it("updates session and returns { id, created: false }", async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ isCurrent: false }) });

    const result = await handler({
      auth: { uid: callerUid },
      data: { id: "sess-1", tenantId, data: { name: "Renamed" } },
    });

    expect(result).toEqual({ id: "sess-1", created: false });
  });

  it("throws not-found when updating non-existing session", async () => {
    mockDocGet.mockResolvedValue({ exists: false });

    await expect(
      handler({ auth: { uid: callerUid }, data: { id: "missing", tenantId, data: { name: "X" } } })
    ).rejects.toThrow("Academic session not found");
  });

  it("uses batch on update when setting isCurrent to true", async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ isCurrent: false }) });
    mockWhereGet.mockResolvedValue({
      docs: [{ id: "other-session", ref: { id: "other-session" } }],
    });

    await handler({
      auth: { uid: callerUid },
      data: { id: "sess-1", tenantId, data: { isCurrent: true } },
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
    expect(mockBatchCommit).toHaveBeenCalled();
  });

  it("does not unset its own isCurrent when updating itself", async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ isCurrent: true }) });
    // The query returns this same session as "current"
    mockWhereGet.mockResolvedValue({
      docs: [{ id: "sess-1", ref: { id: "sess-1" } }],
    });

    await handler({
      auth: { uid: callerUid },
      data: { id: "sess-1", tenantId, data: { isCurrent: true, name: "Updated" } },
    });

    // batchUpdate called once for the session itself, not for unsetting
    // (it skips doc.id === id)
    expect(mockBatchUpdate).toHaveBeenCalledTimes(1);
  });
});
