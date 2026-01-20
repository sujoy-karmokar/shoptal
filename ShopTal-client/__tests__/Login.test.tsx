import LoginPage from "@/app/login/page";
import { render, screen } from "@testing-library/react";

// Mock the useSearchParams hook
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe("Login", () => {
  it("should be a button", () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });
});
