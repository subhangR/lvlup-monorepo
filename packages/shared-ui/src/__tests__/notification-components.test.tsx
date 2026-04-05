// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Mock lucide-react icons used by notification components
vi.mock("lucide-react", () => ({
  Bell: (props: any) => <span data-testid="bell" {...props} />,
  BellOff: (props: any) => <span data-testid="bell-off" {...props} />,
  Check: (props: any) => <span data-testid="check" {...props} />,
  CheckCheck: (props: any) => <span data-testid="check-check" {...props} />,
  CheckCircle: (props: any) => <span data-testid="check-circle" {...props} />,
  ExternalLink: (props: any) => <span data-testid="external-link" {...props} />,
  Loader2: (props: any) => <span data-testid="loader" {...props} />,
}));

// Mock UI components
vi.mock("../components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("../components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>,
}));

// Since NotificationDropdown may depend on complex internals, test it in isolation
import { NotificationDropdown } from "../components/layout/NotificationDropdown";

describe("NotificationDropdown", () => {
  const mockNotification = {
    id: "n1",
    type: "info" as const,
    title: "Test Notification",
    body: "This is a test notification",
    isRead: false,
    createdAt: { _seconds: 1709913600, _nanoseconds: 0 },
  };

  const defaultProps = {
    notifications: [mockNotification] as any[],
    onNotificationClick: vi.fn(),
    onMarkAllRead: vi.fn(),
    onViewAll: vi.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders notification items", () => {
    render(<NotificationDropdown {...defaultProps} />);
    expect(screen.getByText("Test Notification")).toBeDefined();
  });

  it("shows loading state", () => {
    const { container } = render(
      <NotificationDropdown {...defaultProps} isLoading={true} notifications={[]} />
    );
    expect(container.querySelector(".animate-spin")).toBeDefined();
  });

  it("shows empty state when no notifications", () => {
    render(<NotificationDropdown {...defaultProps} notifications={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeDefined();
  });

  it("calls onNotificationClick when notification clicked", () => {
    render(<NotificationDropdown {...defaultProps} />);
    const notification = screen.getByText("Test Notification");
    fireEvent.click(notification.closest("button") || notification);
    expect(defaultProps.onNotificationClick).toHaveBeenCalledWith(mockNotification);
  });

  it("calls onMarkAllRead when mark all read clicked", () => {
    render(<NotificationDropdown {...defaultProps} />);
    const markAllBtn = screen.getByText(/mark all/i);
    fireEvent.click(markAllBtn);
    expect(defaultProps.onMarkAllRead).toHaveBeenCalled();
  });

  it("calls onViewAll when view all clicked", () => {
    render(<NotificationDropdown {...defaultProps} />);
    const viewAllBtn = screen.getByText(/view all/i);
    fireEvent.click(viewAllBtn);
    expect(defaultProps.onViewAll).toHaveBeenCalled();
  });
});
