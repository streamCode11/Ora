import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/cloudinary.js';


const responseTokenAndUser = (req, res, user) => {

    try {
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET, {
            expiresIn: '3h'
        });
        const refreshToken = jwt.sign({
            id: user._id
        }, JWT_SECRET, {
            expiresIn: 30 * 24 * 60 * 60 ,
        });

        user.password = undefined
        user.resetPasswordCode = undefined

        res.json({
            ok: true,
            token,
            refreshToken,
            user,
            message: 'Login successful'
        })

    } catch (err) {}

}

export default responseTokenAndUser