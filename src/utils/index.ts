// Centralized utility exports
export * from "./securityUtils";
export * from "./searchIndex";
export * from "./performanceMonitor";
export * from "./errorHandler";
export {
  isValidEmail,
  isStrongPassword,
  hasPermission,
  getUserRole,
  requireAuth,
  isAdmin,
  isModerator,
  checkRateLimit,
} from "./authUtils";
export * from "./scrollUtils";
export * from "./validation";
export * from "./exportUtils";
export * from "./sanitize";
export * from "./htmlEscape";
