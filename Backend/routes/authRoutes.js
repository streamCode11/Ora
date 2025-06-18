import express from "express"
const authRouter = express.Router();
import * as auth from "../controllers/authController.js"

authRouter.post('/pre-signup' , auth.PreSignup);
authRouter.post('/signup' , auth.signup);
authRouter.post('/login' , auth.login );



export default authRouter