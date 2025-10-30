import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const BACKEND_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

console.log("🤖 Telegram bot is running...");

const pendingTokens = {}; // store token per chatId

// Handle /start with or without token
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1]?.trim();

  if (!token) {
    return bot.sendMessage(
      chatId,
      "⚠️ Invalid or missing verification token. Please start from your app again."
    );
  }

  // store token temporarily
  pendingTokens[chatId] = token;

  await bot.sendMessage(
    chatId,
    "📱 Please share your phone number to verify your account.",
    {
      reply_markup: {
        keyboard: [
          [{ text: "Share phone number", request_contact: true }],
        ],
        one_time_keyboard: true,
      },
    }
  );
});

// When user shares phone
bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const telegramPhone = msg.contact.phone_number;
  const token = pendingTokens[chatId];

  if (!token) {
    return bot.sendMessage(
      chatId,
      "❌ No pending verification request. Please start again from your app."
    );
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/verify/start`, {
      tokenTo: token,
      telegramUserId: chatId,
      telegramPhone,
    });

    if (response.data.success) {
      const loginToken = response.data.loginToken;

    await bot.sendMessage(
      chatId,
      `✅ Verification successful!\n\nYour verification token:\n\`${loginToken}\`\n\n👉 Copy it and paste it in the app to complete login.`,
      { parse_mode: "Markdown" }
    );

    } else {
      await bot.sendMessage(
        chatId,
        `❌ Verification failed: ${response.data.message}`
      );
    }
  } catch (err) {
    console.error("Verification error:", err.response?.data || err.message);
    await bot.sendMessage(
      chatId,
      "❌ Something went wrong while verifying. Try again later."
    );
  } finally {
    delete pendingTokens[chatId]; // cleanup
  }
});
