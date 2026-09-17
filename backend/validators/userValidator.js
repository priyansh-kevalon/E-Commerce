const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 72;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const isValidEmail = (value) =>
  !isBlank(value) && String(value).trim().length <= 254 && EMAIL_REGEX.test(String(value).trim());

const isValidPassword = (value) =>
  typeof value === 'string' &&
  value.trim().length >= MIN_PASSWORD_LENGTH &&
  value.length <= MAX_PASSWORD_LENGTH;

/**
 * Validate a profile update payload (only provided fields are checked).
 * Returns an array of error messages (empty when valid).
 */
export const validateProfileUpdate = (body = {}) => {
  const errors = [];
  const { name, email } = body;

  if (body === null || typeof body !== 'object') {
    return ['Invalid request payload'];
  }

  if (name === undefined && email === undefined) {
    return ['Provide a name or email to update'];
  }

  if (name !== undefined) {
    if (isBlank(name) || String(name).trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (String(name).trim().length > 60) {
      errors.push('Name cannot exceed 60 characters');
    }
  }

  if (email !== undefined && !isValidEmail(email)) {
    errors.push('A valid email address is required');
  }

  return errors;
};

/**
 * Validate a password change payload.
 * Returns an array of error messages (empty when valid).
 */
export const validatePasswordChange = (body = {}) => {
  const errors = [];
  const { currentPassword, newPassword, confirmPassword } = body;

  if (isBlank(currentPassword)) {
    errors.push('Current password is required');
  }

  if (!isValidPassword(newPassword)) {
    errors.push(`New password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`);
  }

  if (newPassword !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (!isBlank(currentPassword) && currentPassword === newPassword) {
    errors.push('New password must be different from the current password');
  }

  return errors;
};
