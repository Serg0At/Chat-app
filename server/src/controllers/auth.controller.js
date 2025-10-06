import bcrypt from 'bcryptjs';

// import cloudinary from '../lib/cloudinary.js';
import AuthService from '../services/auth.service.js';

export default class AuthController {
    static async signup (req, res) {
        const { fullName, phone, password } = req.body;

        try {
            if (!fullName || !phone || !password) {
                return res.status(400).json({ message: "All fields are required"})
            }

            if (password.length < 6 ) {
                return res.status(400).JSON({ message: "Password must be at least 6 charachters long"})
            }

            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "Invalid phone format" });
            }

            const result = await AuthService.signup(fullName, phone, password);
            
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(400).json({ message: "Failed to create user" })
            }
            
        } catch (error) {
            console.log("Error in singup controller", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }

    static async verifyTelegram(req, res) {
        try {
            const { tokenTo, telegramUserId, telegramPhone } = req.body;

            if (!tokenTo || !telegramPhone || !telegramUserId) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const result = await AuthService.verifyTelegram(tokenTo, telegramUserId, telegramPhone);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error verifying Telegram user:", error);
            return res.status(500).json({ success: false, message: "Server error" });
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