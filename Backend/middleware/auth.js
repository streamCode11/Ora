import jwt from 'jsonwebtoken';
import User from '../models/authSchema.js';
import { JWT_SECRET } from '../config/cloudinary.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      code: 'MISSING_TOKEN',
      message: 'Authorization header is required'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      code: 'INVALID_TOKEN_FORMAT',
      message: 'Token must be in format: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        code: 'USER_NOT_FOUND',
        message: 'The user belonging to this token no longer exists'
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        code: 'PASSWORD_CHANGED',
        message: 'User recently changed password. Please log in again'
      });
    }

    req.user = currentUser;
    next();
    
  } catch (err) {
    let message = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      message = 'Your token has expired. Please log in again';
    }

    res.status(401).json({
      status: 'fail',
      code: 'AUTH_ERROR',
      message
    });
  }
};

const admin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      status: 'fail',
      code: 'FORBIDDEN',
      message: 'You do not have permission to perform this action'
    });
  }
  next();
};

export { protect, admin };