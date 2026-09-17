const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

// True only for real, finite numbers (strings like "12.5" are allowed, but
// booleans, arrays and objects are rejected).
const isPlainNumber = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean' || typeof value === 'object') return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return Number.isFinite(Number(value));
};

const MAX_NAME_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_BRAND_LENGTH = 80;
const MAX_IMAGES = 8;

/**
 * Validate a product payload.
 * When `isUpdate` is true, only the provided fields are validated.
 * Returns an array of error messages (empty when valid).
 */
export const validateProduct = (body = {}, isUpdate = false) => {
  const errors = [];
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    rating,
    numReviews,
    brand,
    images,
    isFeatured,
  } = body;

  const required = (value) => !isUpdate || value !== undefined;

  if (required(name)) {
    if (isBlank(name)) {
      errors.push('Product name is required');
    } else if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters');
    } else if (name.trim().length > MAX_NAME_LENGTH) {
      errors.push(`Product name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
  }

  if (required(description)) {
    if (isBlank(description) || typeof description !== 'string') {
      errors.push('Product description is required');
    } else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Product description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
    }
  }

  if (required(price)) {
    if (!isPlainNumber(price) || Number(price) < 0) {
      errors.push('A valid non-negative price is required');
    }
  }

  if (required(category)) {
    if (isBlank(category)) errors.push('Product category is required');
  }

  if (required(stock)) {
    if (!isPlainNumber(stock) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      errors.push('Stock must be a whole number of 0 or more');
    }
  }

  if (discountPrice !== undefined && !isBlank(discountPrice)) {
    if (!isPlainNumber(discountPrice) || Number(discountPrice) < 0) {
      errors.push('Discount price must be a non-negative number');
    } else if (isPlainNumber(price) && Number(discountPrice) > Number(price)) {
      errors.push('Discount price cannot be greater than the price');
    }
  }

  if (rating !== undefined && !isBlank(rating)) {
    if (!isPlainNumber(rating) || Number(rating) < 0 || Number(rating) > 5) {
      errors.push('Rating must be a number between 0 and 5');
    }
  }

  if (numReviews !== undefined && !isBlank(numReviews)) {
    if (!isPlainNumber(numReviews) || Number(numReviews) < 0) {
      errors.push('Number of reviews must be 0 or more');
    }
  }

  if (brand !== undefined && brand !== null) {
    if (typeof brand !== 'string') {
      errors.push('Brand must be text');
    } else if (brand.trim().length > MAX_BRAND_LENGTH) {
      errors.push(`Brand cannot exceed ${MAX_BRAND_LENGTH} characters`);
    }
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) {
      errors.push('Images must be an array of image URLs');
    } else if (images.length > MAX_IMAGES) {
      errors.push(`You can add up to ${MAX_IMAGES} images`);
    } else if (images.some((image) => typeof image !== 'string' || !image.trim())) {
      errors.push('Each image must be a non-empty URL string');
    }
  }

  if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
    errors.push('isFeatured must be true or false');
  }

  return errors;
};
