import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Mock Firebase auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock Firebase auth instance
jest.mock("../../firebase/auth", () => ({
  auth: {},
}));

// Test component to access context
const TestComponent = () => {
  const { user, loading, error, login, signup, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : "No user"}</div>
      <div data-testid="loading">{loading ? "Loading" : "Not loading"}</div>
      <div data-testid="error">{error || "No error"}</div>
      <button
        data-testid="login"
        onClick={() => login("test@example.com", "password")}
      >
        Login
      </button>
      <button
        data-testid="signup"
        onClick={() => signup("test@example.com", "password")}
      >
        Signup
      </button>
      <button data-testid="logout" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock onAuthStateChanged to call the callback immediately
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null); // No user initially
      return jest.fn(); // Return unsubscribe function
    });
  });

  it("should provide authentication context", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("should handle successful login", async () => {
    const mockUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      emailVerified: true,
    };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId("login");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password"
      );
    });
  });

  it("should handle login errors", async () => {
    const mockError = {
      code: "auth/user-not-found",
      message: "User not found",
    };

    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId("login");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("User not found");
    });
  });

  it("should handle successful signup", async () => {
    const mockUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      emailVerified: false,
    };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signupButton = screen.getByTestId("signup");
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password"
      );
    });
  });

  it("should handle signup errors", async () => {
    const mockError = {
      code: "auth/email-already-in-use",
      message: "Email already in use",
    };

    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signupButton = screen.getByTestId("signup");
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Email already in use"
      );
    });
  });

  it("should handle logout", async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByTestId("logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(expect.anything());
    });
  });

  it("should handle logout errors", async () => {
    const mockError = {
      code: "auth/network-request-failed",
      message: "Network error",
    };

    (signOut as jest.Mock).mockRejectedValue(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByTestId("logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Network error");
    });
  });

  it("should clear error when starting new auth operation", async () => {
    const mockError = {
      code: "auth/user-not-found",
      message: "User not found",
    };

    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId("login");
    fireEvent.click(loginButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("User not found");
    });

    // Mock successful login for next attempt
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    // Click login again - error should be cleared
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("No error");
    });
  });
});
