import bcrypt from "bcryptjs";
import crypto from 'crypto';

import Auth from "../models/Auth.js";
import generateUsername from "../utils/generateUsername.js";


export default class AuthService {
  static async signup(fullName, phone, password) {
    const existingUser = await Auth.findByPhone(phone);
    if (existingUser) {
      throw new Error("User with that phone number already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const VfyTokenToBot = crypto.randomBytes(32).toString("hex");
    const VfyTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const username = generateUsername(fullName);

    const savedUser = await Auth.registerPendingUser(
      username,
      fullName,
      phone,
      hashedPassword,
      VfyTokenToBot,
      VfyTokenExpiry
    );

    return {
      id: savedUser.id,
      username: savedUser.username,
      fullName: savedUser.full_name,
      phone: savedUser.phone_number,
      vfySecretTo: VfyTokenToBot,
    };
  }
}
