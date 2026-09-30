import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT containing the user id and a token-version claim.
 * Bumping the user's tokenVersion (e.g. on password change) instantly
 * invalidates every previously issued token.
 * Secret and expiry come from environment variables.
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, tv: user.tokenVersion || 0 }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
