import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET || 'development_secret_change_me').id; next(); }
  catch { return res.status(401).json({ message: 'Session expired or invalid' }); }
};
