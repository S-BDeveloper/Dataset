// Validation utilities
export {
  sanitizeInput,
  isValidEmail,
  validatePassword,
  validateSearchQuery,
  validateFileUpload,
} from "../securityUtils";

// Re-export validation functions for easier imports
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateRequired = (value: string): boolean => {
  return Boolean(value && value.trim().length > 0);
};

export const validateLength = (
  value: string,
  min: number,
  max?: number
): boolean => {
  if (!value) return false;
  if (value.length < min) return false;
  if (max && value.length > max) return false;
  return true;
};
