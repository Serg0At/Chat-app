import bcrypt from "bcryptjs";
import crypto from 'crypto';

import Auth from "../models/Auth.js";
import generateUsername from "../utils/generateUsername.js";
import BotModel from '../models/Bot.js';
export default class AuthService {
  static async signup(fullName, phone, password) {
    const existingUser = await Auth.findByPhone(phone);
    if (existingUser) {
      throw new Error("User with that phone number already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const vfyTokenToBot = crypto.randomBytes(32).toString("hex");
    const vfyTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const username = generateUsername(fullName);

    const savedUser = await Auth.registerPendingUser(
      username,
      fullName,
      phone,
      hashedPassword,
      vfyTokenToBot,
      vfyTokenExpiry
    );

    return {
      id: savedUser.id,
      username: savedUser.username,
      fullName: savedUser.full_name,
      phone: savedUser.phone_number,
      vfySecretTo: vfyTokenToBot,
    };
  }

   static async verifyTelegram(tokenTo, telegramUserId, telegramPhone) {
    // Step 1: Check if user exists with this token
    const user = await BotModel.findTokenToBot(tokenTo);

    if (!user) {
      return { success: false, message: "Invalid or expired verification token" };
    }

    // Step 2: Check if phone matches
    if (user.phone_number !== telegramPhone) {
      return { success: false, message: "Phone number does not match registered phone" };
    }

    // Step 3: Check if already verified
    if (user.account_status === "verified") {
      return { success: false, message: "User already verified" };
    }

    // Step 4: Generate final login token for frontend
    const vfyTokenFromBot = crypto.randomBytes(32).toString("hex");
    const vfyTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Step 5: Update user as verified
    await BotModel.verifyUserInTelegram(user.id, {
      telegram_id: telegramUserId,
      vfy_secret_from_bot: vfyTokenFromBot,
      vfy_secret_from_expires_at: vfyTokenExpiry,
      account_status: "verified"
    });

    return {
      success: true,
      message: "Verification successful",
      loginToken: vfyTokenFromBot
    };
  }
}
