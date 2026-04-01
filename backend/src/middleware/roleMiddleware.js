const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'authentication required' });
  }

  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: 'insufficient permissions' });
  }

  return next();
};

export default roleMiddleware;
