const screenshot = require('screenshot-desktop');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Telegram bot token and chat ID
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID_IMG = process.env.CHAT_ID_IMG;
const CHAT_ID_CALLS = process.env.CHAT_ID_CALLS;
const chatIdTest = '-1002204563027'

const bot = new TelegramBot(BOT_TOKEN, { polling: true, request: {
  agentOptions: {
      keepAlive: true,
      family: 4
  }
}});

async function sendScreenshot() {
  try {
    const img = await screenshot({ format: 'png' });
    bot.sendPhoto(CHAT_ID_IMG, img);
    console.log('Screenshot sent to Telegram');
  } catch (err) {
    console.error('Failed to take screenshot:', err);
  }
}

const sendMessageToGroup = (message) => {
  bot.sendMessage(CHAT_ID_CALLS, message)
    .then((response) => {
      console.log('Message sent successfully:');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};





module.exports = {
  startScreenshotInterval: function() {
    // Set an interval to take and send a screenshot every hour
    setInterval(sendScreenshot, 900000); // 3600000 ms = 1 hour
  },
  sendScreenshot,
  sendMessageToGroup,
};
