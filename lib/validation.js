/**
 * PULSE Command — Validation Utilities
 * 
 * Reusable validation helpers for input sanitization, security checks, and 
 * data integrity across API routes and client-side helpers.
 */

/**
 * Validates that a value is a string and satisfies length constraints.
 * @throws {Error} if validation fails
 */
export function validateString(val, minLen, maxLen, fieldName = 'value') {
  if (typeof val !== 'string') {
    throw new Error(`${fieldName} must be a string.`);
  }
  const len = val.trim().length;
  if (len < minLen || len > maxLen) {
    throw new Error(`${fieldName} must be between ${minLen} and ${maxLen} characters.`);
  }
  return val.trim();
}

/**
 * Validates that a value is present in a set of allowed options.
 * @throws {Error} if validation fails
 */
export function validateEnum(val, allowedOptions, fieldName = 'value') {
  if (!allowedOptions.includes(val)) {
    throw new Error(`${fieldName} is invalid. Allowed values: ${allowedOptions.join(', ')}`);
  }
  return val;
}

/**
 * Validates that a value is a non-null object.
 * @throws {Error} if validation fails
 */
export function validateObject(val, fieldName = 'value') {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    throw new Error(`${fieldName} must be a valid non-array object.`);
  }
  return val;
}

/**
 * Validates that a value is a valid array and optionally conforms to size limits.
 * @throws {Error} if validation fails
 */
export function validateArray(val, maxItems = 100, fieldName = 'value') {
  if (!Array.isArray(val)) {
    throw new Error(`${fieldName} must be a valid array.`);
  }
  if (val.length > maxItems) {
    throw new Error(`${fieldName} size cannot exceed ${maxItems} items.`);
  }
  return val;
}

/**
 * Parses and sanitizes numerical inputs safely.
 */
export function parseBoundedNumber(val, fallback, minVal, maxVal) {
  if (val === undefined || val === null) return fallback;
  const num = parseFloat(val);
  if (isNaN(num) || num < minVal || num > maxVal) {
    return fallback;
  }
  return num;
}
