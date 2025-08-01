// Secure authentication utilities
import type { User } from "firebase/auth";

// User roles interface
export interface UserRole {
  uid: string;
  email: string;
  role: "user" | "admin" | "moderator";
  permissions: string[];
}

// Admin emails - in production, this should come from a secure database
const ADMIN_EMAILS = new Set([
  "admin@example.com",
  // Add more admin emails as needed
]);

// Moderator emails
const MODERATOR_EMAILS = new Set([
  "moderator@example.com",
  // Add more moderator emails as needed
]);

// Check if user is admin
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.has(user.email.toLowerCase());
}

// Check if user is moderator
export function isModerator(user: User | null): boolean {
  if (!user || !user.email) return false;
  return MODERATOR_EMAILS.has(user.email.toLowerCase()) || isAdmin(user);
}

// Check if user has specific permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;

  // Admin has all permissions
  if (isAdmin(user)) return true;

  // Moderator permissions
  if (isModerator(user)) {
    const moderatorPermissions = [
      "read:all",
      "write:reviews",
      "moderate:content",
    ];
    return moderatorPermissions.includes(permission);
  }

  // Regular user permissions
  const userPermissions = [
    "read:public",
    "write:favorites",
    "read:own-content",
  ];
  return userPermissions.includes(permission);
}

// Get user role
export function getUserRole(
  user: User | null
): "admin" | "moderator" | "user" | "guest" {
  if (!user) return "guest";
  if (isAdmin(user)) return "admin";
  if (isModerator(user)) return "moderator";
  return "user";
}

// Secure route protection
export function requireAuth(
  user: User | null,
  requiredRole: "admin" | "moderator" | "user" = "user"
): boolean {
  if (!user) return false;

  const userRole = getUserRole(user);

  switch (requiredRole) {
    case "admin":
      return userRole === "admin";
    case "moderator":
      return userRole === "admin" || userRole === "moderator";
    case "user":
      return (
        userRole === "admin" || userRole === "moderator" || userRole === "user"
      );
    default:
      return false;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
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
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const attempts = authAttempts.get(identifier);

  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    return false;
  }

  // Increment attempt count
  attempts.count++;
  attempts.lastAttempt = now;
  authAttempts.set(identifier, attempts);

  return true;
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  for (const [identifier, attempts] of authAttempts.entries()) {
    if (now - attempts.lastAttempt > windowMs) {
      authAttempts.delete(identifier);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
