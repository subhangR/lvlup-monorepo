import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Stable mocks ────────────────────────────────────────────────────────────
const mockSet = vi.fn().mockResolvedValue({});

const stableDb: any = {
  doc: vi.fn(() => ({ set: mockSet })),
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

// The source uses firebase-functions/v1 with .region().auth.user().onCreate()
// We need to mock the chained API that extracts the handler
const handlerContainer = vi.hoisted(() => ({ handler: null as any }));

vi.mock("firebase-functions/v1", () => {
  const chain = {
    region: () => ({
      auth: {
        user: () => ({
          onCreate: (handler: any) => {
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

vi.mock("../../utils/auth-helpers", () => ({
  determineProvider: vi.fn(() => "password"),
}));

// Import triggers the mock setup, capturing the handler
import "../../triggers/on-user-created";

// The handler will be captured by the onCreate mock

describe("onUserCreated", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a user document when auth account is created", async () => {
    const user = {
      uid: "user-1",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      phoneNumber: null,
      providerData: [{ providerId: "password" }],
    };

    await handlerContainer.handler(user);

    expect(stableDb.doc).toHaveBeenCalledWith("users/user-1");
    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.email).toBe("test@example.com");
    expect(setData.isSuperAdmin).toBe(false);
    expect(setData.status).toBe("active");
  });

  it("should handle user with no display name", async () => {
    const user = {
      uid: "user-2",
      email: "nodisplay@example.com",
      displayName: null,
      photoURL: null,
      phoneNumber: null,
      providerData: [],
    };

    await handlerContainer.handler(user);

    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.displayName).toBe("nodisplay"); // email prefix fallback
  });

  it("should handle Google provider", async () => {
    const user = {
      uid: "user-3",
      email: "google@gmail.com",
      displayName: "Google User",
      photoURL: "https://photo.google.com/avatar",
      phoneNumber: null,
      providerData: [{ providerId: "google.com" }],
    };

    await handlerContainer.handler(user);

    expect(mockSet).toHaveBeenCalled();
    const setData = mockSet.mock.calls[0][0];
    expect(setData.photoURL).toBe("https://photo.google.com/avatar");
  });
});
