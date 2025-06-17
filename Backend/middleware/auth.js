import jwt from "jsonwebtoken";
import User from "../models/authSchema.js";
import { JWT_SECRET, JWT_EXPIRES } from "../config/cloudinary.js";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

const ProtectRoutes = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        error: "Please authenticate to access this route",
        ok: false,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        error: "User no longer exists",
        ok: false,
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({  
      message: "Invalid or expired token",
      ok: false
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const options = {
    expires: new Date(Date.now() + JWT_EXPIRES * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode)
    .cookie('jwt', token, options)
    .json({
      success: true,
      token,
      message: `Welcome to Ora, ${user.username}!`, // Added welcome message
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
};

export { sendTokenResponse, ProtectRoutes };