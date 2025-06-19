import User from "../models/authSchema.js";
import { JWT_EXPIRES, JWT_SECRET , CLIENT_URL } from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "email-validator";
import pwd from "password-validator";
import emailTemplate from "../helpers/emailTemplate.js";
import { AWSSES } from "../config/awsses.js";
const PwdSchema = new pwd();

PwdSchema.is()
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

  const PreSignup = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password ) {
        return res.status(400).json({
          message: "Please fill all the fields",
          ok: false,
        });
      }
  
      if (!PwdSchema.validate(password)) {
        return res.status(400).json({
          message: "Invalid password format",
          ok: false,
        });
      }
  
      if (!validator.validate(email)) {
        return res.status(400).json({
          message: "Invalid email format",
          ok: false,
        });
      }
  
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(400).json({
          message: "Email already exists",
          ok: false,
        });
      }
  
      // const usernameExist = await User.findOne({ username });
      // if (usernameExist) {
      //   return res.status(400).json({
      //     message: "Username already exists",
      //     ok: false,
      //   });
      // }
  
      const token = jwt.sign({  email, password }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });
  
      AWSSES.sendEmail(
        emailTemplate(
          email,
          `Signup - Verification Link`,
          `
            <h2>Ora Register Page</h2>
            <p>Please click on the link below to complete the signup process:</p>
            <a href="${CLIENT_URL}/${token}">Create Account</a>
          `
        ),
        (err, data) => {
          if (err) {
            // Send error response and return to prevent further execution
            return res.status(500).json({
              ok: false,
              message: "Failed to send verification email",
              error: err.message,
            });
          }
  
          // Send success response and return to prevent further execution
          return res.status(200).json({
            ok: true,
            message:
              "Please check your email to complete the signup process with almari.com",
          });
        }
      );
    } catch (err) {
      return res.status(500).json({
        message: "An error occurred during pre-signup",
        error: err.message,
        ok: false,
      });
    }
  };

const signup = async (req, res) => {
  try {
    const {  email, password } = jwt.verify(
      req.body.token,
      JWT_SECRET
    );
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
        ok: false,
      });
    }
    if (!PwdSchema.validate(password)) {
      return res.status(400).json({
        message: "Invalid password format",
        ok: false,
      });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        ok: false,
      });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
        ok: false,
      });
    }

    // const usernameExist = await User.findOne({ username });
    // if (usernameExist) {
    //   return res.status(400).json({
    //     message: "Username already exists",
    //     ok: false,
    //   });
    // }
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      password: hashedPass,
    }).save();
    return res.json({
      message: "User created successfully",
      user,
      ok: true,
    });
  } catch (err) {
    return res.json({
      message: "An error occurred during signup",
      ok: false,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email,  password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
        ok: false,
      });
    }

    const isEmail = validator.validate(email);
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials - user not found",
        ok: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials - wrong password",
        ok: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred during login",
      error: err.message,
      ok: false,
    });
  }
};
export { PreSignup, signup, login };
