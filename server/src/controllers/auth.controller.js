import bcrypt from 'bcryptjs';

import cloudinary from '../lib/cloudinary.js';
import AuthService from '../services/auth.service.js';

export default class AuthController {
    static async signup (req, res) {
        const { fullName, phone, password } = req.body;

        try {
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required"})
            }

            if (password.length < 6 ) {
                return res.status(400).JSON({ message: "Password must be at least 6 charachters long"})
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            return await AuthService.signup(fullName, phone, password);
            
        } catch (error) {
            console.log("Error in singup controller", error)
            res.status(500).json({ message: "Internal server error"})
        }
    }

    static async login (req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user ) {
                return res.status(400).json({ message: "Invalid credentials"})
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials"})
            }

            generateToken(user._id, res);

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });
        } catch (error) {
            console.error("Error in login controller:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async logout (req, res) {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }

    static async updateProfile (req, res) {
        try {
            const { profilePic } = req.body;
            if (!profilePic) return res.status(400).json({ message: "Profile pic is required" })

            const userId = req.user._id;

            const uploadResponse = await cloudinary.uploader.upload(profilePic);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadResponse.secure_url }, 
                { new: true }
            ).select('-password');

            res.status(200).json(updatedUser)
        } catch (error) {
            console.log("Error in update profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}