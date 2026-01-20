import DashboardPage from "@/app/(dashboard-layout)/dashboard/page";
import { render, screen } from "@testing-library/react";

// Mock the useSession hook
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { role: "admin" } },
    status: "authenticated",
  }),
}));

describe("Dashboard", () => {
  it("should render the dashboard heading", () => {
    render(<DashboardPage />);

    const heading = screen.getByRole("heading", { name: /analytics dashboard/i });
    expect(heading).toBeInTheDocument();
  });
});
