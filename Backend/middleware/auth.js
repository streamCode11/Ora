import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/cloudinary.js';
import User from '../models/authSchema.js';
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.' 
        });
      }
      
      res.status(401).json({ 
        code: 'INVALID_TOKEN',
        message: 'Not authorized, invalid token' 
      });
    }
  } else {
    res.status(401).json({ 
      code: 'NO_TOKEN',
      message: 'Not authorized, no token provided' 
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export { protect, admin };