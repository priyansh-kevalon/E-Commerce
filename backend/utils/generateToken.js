import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT containing the user id.
 * Secret and expiry come from environment variables.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
