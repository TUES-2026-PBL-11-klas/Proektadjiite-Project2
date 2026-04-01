import asyncHandler from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/auth.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing bearer token' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: 'missing bearer token' });
  }

  try {
    req.user = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }

  return next();
});

export default authMiddleware;
