import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const BACKEND_URL = process.env.BACKEND_URL;

console.log('Telegram bot is running...');

function getPendingTokenForUser (chatId) {

}

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1]; // abcdef123456

  const tokensArray = []
  const tokenString = token.toString() + ' ' + chatId.toString()

  tokensArray.push(tokenString)

  let telegramPhone = null;

  // Check if user shared phone
  if (msg.contact && msg.contact.phone_number) {
    telegramPhone = msg.contact.phone_number;
  }

  // Ask user to share their phone if not available
  if (!telegramPhone) {
    await bot.sendMessage(chatId, "Please share your phone number to verify your account.", {
      reply_markup: {
        keyboard: [
          [{ text: "Share phone number", request_contact: true }]
        ],
        one_time_keyboard: true
      }
    });
    return;
  }

  // Send verification request to backend
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/verify/start`, {
      tokenTo: token,
      telegramUserId: chatId,
      telegramPhone
    });

    if (response.data.success) {
      const loginToken = response.data.loginToken; // XYZ token
      await bot.sendMessage(chatId, `✅ Verification successful! Click below to open the app.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Open App", url: `${process.env.CLIENT_URL}/verified?token=${loginToken}` }]
          ]
        }
      });
    } else {
      await bot.sendMessage(chatId, `❌ Verification failed: ${response.data.message}`);
    }
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "❌ Something went wrong while verifying. Try again later.");
  }
});

// Listen for contact messages
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const token = await getPendingTokenForUser(chatId); // You need a way to store token from initial /start

  const telegramPhone = msg.contact.phone_number;

  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/verify/start`, {
      tokenTo: token,
      telegramUserId: chatId,
      telegramPhone
    });

    if (response.data.success) {
      const loginToken = response.data.loginToken;
      await bot.sendMessage(chatId, `✅ Verification successful! Click below to open the app.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Open App", url: `${process.env.CLIENT_URL}/verified?token=${loginToken}` }]
          ]
        }
      });
    } else {
      await bot.sendMessage(chatId, `❌ Verification failed: ${response.data.message}`);
    }
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "❌ Something went wrong while verifying. Try again later.");
  }
});
