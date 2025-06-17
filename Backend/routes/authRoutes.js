import express from "express"
const authRouter = express.Router();
import * as auth from "../controllers/authController.js"

authRouter.post('/pre-signup' , auth.PreSignup);
authRouter.post('/signup' , auth.signup);



export default authRouter