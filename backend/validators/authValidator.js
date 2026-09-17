const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;
// bcrypt only considers the first 72 bytes, so cap the input to avoid two
// different passwords hashing to the same value.
const MAX_PASSWORD_LENGTH = 72;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const isValidEmail = (value) =>
  !isBlank(value) && String(value).trim().length <= 254 && EMAIL_REGEX.test(String(value).trim());

const isValidPassword = (value) =>
  typeof value === 'string' &&
  value.trim().length >= MIN_PASSWORD_LENGTH &&
  value.length <= MAX_PASSWORD_LENGTH;

/**
 * Validate the registration payload.
 * Returns an array of error messages (empty when valid).
 */
export const validateRegister = (body = {}) => {
  const errors = [];
  const { name, email, password, confirmPassword } = body;

  if (isBlank(name) || String(name).trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (String(name).trim().length > 60) {
    errors.push('Name cannot exceed 60 characters');
  }

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required');
  }

  if (!isValidPassword(password)) {
    errors.push(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`);
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};

/**
 * Validate the login payload.
 * Returns an array of error messages (empty when valid).
 */
export const validateLogin = (body = {}) => {
  const errors = [];
  const { email, password } = body;

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required');
  }
  if (isBlank(password)) {
    errors.push('Password is required');
  }

  return errors;
};
