import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "email-validator";
import { JWT_SECRET , CLIENT_URL } from "../config/cloudinary.js";
import pwd from "password-validator";
import { AWSSES } from "../config/awsses.js";
import User from "../models/authSchema.js";
import responseTokenAndUser from "../helpers/sendUserandTokenResponse.js";
import EmailTemplate from "../helpers/emailTemplate.js";

const pschema = new pwd();

pschema
  .is()
  .min(8)
  .is()
  .max(30)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

const preSignup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.json({
        ok: false,
        error: "Please provide both fields",
      });
    }

    if (!pschema.validate(password)) {
      return res.json({
        ok: false,
        error: "Password is invalid",
      });
    }

    if (!validator.validate(email)) {
      return res.json({
        ok: false,
        error: "Email is invalid",
      });
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.json({
        ok: false,
        error: "Email is already taken please try with unique email",
      });
    }
    const usernameExist = await User.findOne({ username });

    if (usernameExist) {
      return res.json({
        ok: false,
        error: "username is already taken please try with unique username",
      });
    }

    const token = jwt.sign({ email, password, username }, JWT_SECRET, {
      expiresIn: "6h",
    });

    AWSSES.sendEmail(
      EmailTemplate(
        email,
        ` Signup - Verification Link `,
        `
                <h2>  Ora Register Page   </h2>
                <p>Please click on below link to complete the  
                signup process </p>

                <a href="${CLIENT_URL}/${token}"> Create Account   </a>

             
             `
      ),
      (err, data) => {
        if (err) {
          res.json({
            ok: false,
            error: err.message,
          });
        }
        if (data) {
          res.json({
            ok: true,
            data,
            message:
              "Please check your email address for complete the signup process with Ora.com",
          });
        }
      }
    );
  } catch (err) {
    return res.json({
      ok: false,
      error: err.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    if(!req.body.token){
      return res.json({
        ok: false,
        error: "Please provide token in request body",
      });
    }
    const token = req.body.token;
    const { email, password, username } = jwt.verify(
      token,
      JWT_SECRET
    );

    if (!email || !password || !username) {
      return res.json({
        ok: false,
        error: "Please provide both fields",
      });
    }

    if (!pschema.validate(password)) {
      return res.json({
        ok: false,
        error: "Password is invalid",
      });
    }

    if (!validator.validate(email)) {
      return res.json({
        ok: false,
        error: "Email is invalid",
      });
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.json({
        ok: false,
        error: "Email is already taken please try with unique email",
      });
    }
    const usernameExist = await User.findOne({ username });

    if (usernameExist) {
      return res.json({
        ok: false,
        error: "username is already taken please try with unique username",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email,
      password: hashedpassword,
      username: username,
    }).save();
    console.log(newUser);

    console.log("your account has been created.");
    return res.json({
      ok: true,
      message: "your account has been created.",
    });
  } catch (err) {
    return res.json({
      ok: false,
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const {  email, password } = req.body;

    if (!email  || !password) {
      return res.json({
        ok: false,
        error: "Please provide both fields",
      });
    }

    if (!pschema.validate(password)) {
      return res.json({
        ok: false,
        error: "Password is invalid",
      });
    }
    if (!validator.validate(email)) {
      return res.json({
        ok: false,
        error: "Email is invalid",
      });
    }
    const EmailName = await User.findOne({ email });
    if (!EmailName) {
      return res.json({
        ok: false,
        error: "User not found with this email",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, EmailName.password);
    if (!isPasswordMatched) {
      return res.json({
        ok: false,
        error: "Password is in-correct",
      });
    }

    responseTokenAndUser(req, res, EmailName);
  } catch (err) {
    res.json({
      ok: false,
      error: err.message,
    });
  }
};
let blacklistToken = [];
const Logout = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  try{
    if (!token) {
      return res.json({
        ok: false,
        error: "Please provide token in request header",
      });
    }
    blacklistToken.push(token);
    return res.json({
      ok: true,
      message: "You have been logged out successfully",
    });
  }catch(err){
    return res.json({
      ok: false,
      error: err.message,
    })
  }
}
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    
    const newToken = generateToken(user._id); // Your existing token generation function
    
    res.json({ 
      token: newToken 
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};



export { preSignup, signup, login , Logout };
