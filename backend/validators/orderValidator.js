const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const REQUIRED_ADDRESS_FIELDS = ['fullName', 'phone', 'address', 'city', 'postalCode'];

const LABELS = {
  fullName: 'Full name',
  phone: 'Phone number',
  address: 'Address',
  city: 'City',
  state: 'State',
  postalCode: 'Postal code',
  country: 'Country',
};

/**
 * Validate a checkout/order payload.
 * Returns an array of error messages (empty when valid).
 */
export const validateOrder = (body = {}) => {
  const errors = [];
  const { shippingAddress, paymentMethod } = body;

  if (!shippingAddress || typeof shippingAddress !== 'object' || Array.isArray(shippingAddress)) {
    errors.push('Shipping address is required');
  } else {
    for (const field of REQUIRED_ADDRESS_FIELDS) {
      if (isBlank(shippingAddress[field])) {
        errors.push(`${LABELS[field] || field} is required`);
      }
    }

    if (!isBlank(shippingAddress.phone) && !/^[0-9+\-\s()]{7,15}$/.test(String(shippingAddress.phone).trim())) {
      errors.push('Phone number is not valid');
    }

    if (!isBlank(shippingAddress.postalCode) && !/^[0-9]{4,10}$/.test(String(shippingAddress.postalCode).trim())) {
      errors.push('Postal code is not valid');
    }
  }

  if (paymentMethod !== undefined && !['COD', 'Card', 'UPI'].includes(paymentMethod)) {
    errors.push('Payment method must be COD, Card or UPI');
  }

  return errors;
};
