import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User, Auth } from "firebase/auth";
import { auth } from "../firebase/config";
import { errorHandler } from "../utils/errorHandler";
import { isValidEmail, checkRateLimit } from "../utils/authUtils";

// Enhanced user interface with roles
interface EnhancedUser extends User {
  role?: "user" | "moderator" | "admin" | null;
  permissions?: string[];
}

interface AuthContextType {
  user: EnhancedUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validatePassword: (password: string) => {
    isValid: boolean;
    errors: string[];
  };
  validateEmail: (email: string) => boolean;
  hasPermission: (permission: string) => boolean;
  getUserRole: () => "user" | "moderator" | "admin" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user role based on email
  const getUserRoleByEmail = useCallback(
    (email: string | null): "user" | "moderator" | "admin" | null => {
      if (!email) return null;

      // Admin emails (in production, this would come from environment variables)
      const adminEmails = [
        "admin@quranic-signs.com",
        "superadmin@quranic-signs.com",
      ];
      const moderatorEmails = [
        "moderator@quranic-signs.com",
        "editor@quranic-signs.com",
      ];

      if (adminEmails.includes(email)) return "admin";
      if (moderatorEmails.includes(email)) return "moderator";
      return "user";
    },
    []
  );

  // Get user permissions based on role
  const getUserPermissions = useCallback(
    (email: string | null): string[] => {
      const role = getUserRoleByEmail(email);
      switch (role) {
        case "admin":
          return [
            "read",
            "write",
            "delete",
            "moderate",
            "manage_users",
            "view_analytics",
          ];
        case "moderator":
          return ["read", "write", "moderate", "view_analytics"];
        case "user":
          return ["read", "write"];
        default:
          return ["read"];
      }
    },
    [getUserRoleByEmail]
  );

  useEffect(() => {
    // Skip Firebase auth if not available (for production deployment)
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as unknown as Auth, (user) => {
      if (user) {
        // Enhance user with role information
        const enhancedUser: EnhancedUser = {
          ...user,
          role: getUserRoleByEmail(user.email),
          permissions: getUserPermissions(user.email),
        };
        setUser(enhancedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [getUserRoleByEmail, getUserPermissions]);

  // Password validation
  const validatePassword = useCallback((password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  // Email validation
  const validateEmail = useCallback((email: string) => {
    return isValidEmail(email);
  }, []);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return user.permissions?.includes(permission) || false;
    },
    [user]
  );

  // Get current user role
  const getCurrentUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  // Enhanced login with rate limiting and validation
  const login = async (email: string, password: string) => {
    try {
      setError(null);

      // Skip if Firebase is not available
      if (!auth) {
        throw new Error("Authentication is not available in this environment");
      }

      // Check rate limiting
      if (!checkRateLimit(email, 5, 15 * 60 * 1000)) {
        throw new Error("Too many login attempts. Please try again later.");
      }

      // Validate email
      if (!validateEmail(email)) {
        throw new Error("Invalid email address");
      }

      await signInWithEmailAndPassword(
        auth as unknown as Auth,
        email,
        password
      );
    } catch (err) {
      const authError = errorHandler.handleAuthError(err, { email });
      setError(authError.message);
      throw err;
    }
  };

  // Enhanced signup with validation
  const signup = async (email: string, password: string) => {
    try {
      setError(null);

      // Skip if Firebase is not available
      if (!auth) {
        throw new Error("Authentication is not available in this environment");
      }

      // Validate email
      if (!validateEmail(email)) {
        throw new Error("Invalid email address");
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      await createUserWithEmailAndPassword(
        auth as unknown as Auth,
        email,
        password
      );
    } catch (err) {
      const authError = errorHandler.handleAuthError(err, { email });
      setError(authError.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);

      // Skip if Firebase is not available
      if (!auth) {
        setUser(null);
        return;
      }

      await signOut(auth as unknown as Auth);
    } catch (err) {
      const authError = errorHandler.handleAuthError(err);
      setError(authError.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        validatePassword,
        validateEmail,
        hasPermission,
        getUserRole: getCurrentUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
