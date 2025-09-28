import { generateToken } from '../lib/utils.js';
import User from '../models/User.js'

export default class AuthService {
    static async signup (fullName, phone, password) {

        const user = await User.findByPhone({ phone });
        if (user) return res.status(400).json({ message: "User already exists" })
                
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const savedUser = await User.registerUser(fullName, phone, hashedPassword);

        if (savedUser) {
            const tokens = generateToken(newUser._id, res);

            res.status(201).json({
                id: savedUser.id,
                fullName: savedUser.fullName,
                phone: savedUser.phone_number,
                profilePic: savedUser.profilePic,
                accessToken: tokens.accessToken
            })
        } else {
            res.status(400).json({ message: "Invalid user data" });
        } 
    }
}