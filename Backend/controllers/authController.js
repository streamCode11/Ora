import User from "../models/authSchema.js";
import { sendTokenResponse } from "../middleware/auth.js";

const register = async (req, res) => {  // Fixed parameter order (req first)
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await User.create({ username, email, password, firstName, lastName });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      ok: false  // Fixed typo (fasle -> false)
    });
  }
};

const login = async (req, res) => {
     try {
       const { email, password } = req.body;
       
       // 1. Check if email and password exist
       if (!email || !password) {
         return res.status(400).json({
           success: false,
           message: 'Please provide both email and password'
         });
       }
   
       // 2. Check if user exists and password is correct
       const user = await User.findOne({ email }).select('+password');
       
       if (!user || !(await user.comparePassword(password))) {
         return res.status(401).json({
           success: false,
           message: 'Invalid email or password' // Generic message for security
         });
       }
   
       // 3. If everything is correct, send token
       sendTokenResponse(user, 200, res);
       
     } catch (err) {
       console.error('Login error:', err);
       return res.status(500).json({
         success: false,
         message: 'An error occurred during login'
       });
     }
   }

const getme = async (req, res) => {  
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({  
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({ 
      message: err.message,
      ok: false
    });
  }
}

export { getme, register, login };