import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const verifyToken = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      const user = await db.query(
        'SELECT id, role, account_status, is_email_verified FROM users WHERE id = $1',
        [decoded.id]
      );
      
      if (user.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      }

      req.user = user.rows[0];
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token attached.' });
  }
};
