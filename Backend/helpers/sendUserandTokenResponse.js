import {
    JWT_SECRET
} from '../config/cloudinary.js';
import jwt from 'jsonwebtoken';


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
            expiresIn: '30d'
        });

        user.password = undefined
        user.resetPasswordCode = undefined

        res.json({
            ok: true,
            token,
            refreshToken,
            user
        })

    } catch (err) {}

}

export default responseTokenAndUser