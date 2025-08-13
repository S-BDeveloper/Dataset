/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for HTML attributes
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input
    // Remove HTML tags and their content
    .replace(/<[^>]*>/g, "")
    // Remove script tags and their content (handles whitespace in closing tags)
    .replace(/<script[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, "")
    // Remove data: protocol
    .replace(/data:/gi, "")
    // Remove all event handlers (onXXX=)
    .replace(/on\w+\s*=/gi, "")
    // Remove CSS expressions
    .replace(/expression\s*\(/gi, "")
    // Remove eval() calls
    .replace(/eval\s*\(/gi, "")
    // Remove dangerous CSS properties
    .replace(/url\s*\(/gi, "")
    // Remove potential SQL injection patterns
    .replace(/['";]/g, "")
    // Remove backticks (can be used for template injection)
    .replace(/`/g, "")
    // Remove angle brackets
    .replace(/[<>]/g, "")
    // Remove ampersands (can be used for HTML entity injection)
    .replace(/&/g, "&amp;")
    // Remove quotes
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Remove backslashes
    .replace(/\\/g, "")
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Additional check for any remaining dangerous patterns
  const dangerousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /eval\s*\(/gi,
  ];

  // If any dangerous patterns remain, remove them completely
  dangerousPatterns.forEach((pattern) => {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, "");
    }
  });

  return sanitized;
}

/**
 * Sanitizes input specifically for HTML content (less restrictive than attribute sanitization)
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for HTML content
 */
export function sanitizeHtmlContent(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return (
    input
      // Remove script tags and their content (handles whitespace in closing tags)
      .replace(/<script[^>]*>[\s\S]*?<\/script\s*>/gi, "")
      // Remove javascript: protocol
      .replace(/javascript:/gi, "")
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, "")
      // Remove data: protocol
      .replace(/data:/gi, "")
      // Remove all event handlers (onXXX=)
      .replace(/on\w+\s*=/gi, "")
      // Remove CSS expressions
      .replace(/expression\s*\(/gi, "")
      // Remove eval() calls
      .replace(/eval\s*\(/gi, "")
      // Remove dangerous CSS properties
      .replace(/url\s*\(/gi, "")
      // Remove null bytes
      .replace(/\0/g, "")
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, "")
      .trim()
  );
}

/**
 * Validates if input contains only safe characters for Islamic text
 * @param input - The user input to validate
 * @returns true if input is safe for Islamic text display
 */
export function isValidIslamicText(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  // Allow Arabic characters, English letters, numbers, and basic punctuation
  const safePattern =
    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF\u2000-\u206F\u2100-\u214F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF]*$/;

  return safePattern.test(input);
}
