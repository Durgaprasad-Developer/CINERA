import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export const verifyAdmin = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || (decoded.role && decoded.role !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    req.admin = decoded;
    return next();
  } catch (err) {
    console.error('verifyAdmin error', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
