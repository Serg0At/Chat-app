import jwt from 'jsonwebtoken';
import config from '../configs/variables.config.js';
import Auth from '../models/Auth.js';

export default class AuthMiddleware {
    static async protectRoute (req, res, next) {
        try {
            const token = req.cookies.jwt;

            if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

            const decoded = jwt.verify(token, ENV.JWT_SECRET)
            if (!decoded)return res.status(401).json({ message: "Unauthorized - Invalid token" });

            const user = await Auth.findById(decoded.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            req.user = user
            next()
        } catch (error) {
            console.log("Error in middleware", error);
            next(error)
        }
    }
}