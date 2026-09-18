const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 15;
const MAX_SUBJECT_LENGTH = 120;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const isValidEmail = (value) =>
  !isBlank(value) && String(value).trim().length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(String(value).trim());

/**
 * Validate a contact form submission.
 * Returns an array of error messages (empty when valid).
 */
export const validateContact = (body = {}) => {
  const errors = [];
  const { name, email, phone, subject, message } = body;

  if (isBlank(name) || String(name).trim().length < MIN_NAME_LENGTH) {
    errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters long`);
  } else if (String(name).trim().length > MAX_NAME_LENGTH) {
    errors.push(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
  }

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required');
  }

  if (!isBlank(phone) && String(phone).trim().length > MAX_PHONE_LENGTH) {
    errors.push(`Phone number cannot exceed ${MAX_PHONE_LENGTH} characters`);
  }

  if (!isBlank(subject) && String(subject).trim().length > MAX_SUBJECT_LENGTH) {
    errors.push(`Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters`);
  }

  if (isBlank(message)) {
    errors.push('Message is required');
  } else if (String(message).trim().length < MIN_MESSAGE_LENGTH) {
    errors.push(`Message must be at least ${MIN_MESSAGE_LENGTH} characters long`);
  } else if (String(message).trim().length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
  }

  return errors;
};