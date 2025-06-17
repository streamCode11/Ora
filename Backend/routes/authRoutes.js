import { getme , login , register } from "../controllers/authController.js";
import { ProtectRoutes } from "../middleware/auth.js";
import express from "express"
const authRouter = express.Router();


authRouter.post('/login', login);
authRouter.post('/register' , register);
authRouter.get('/getme' , ProtectRoutes , getme);

export default authRouter