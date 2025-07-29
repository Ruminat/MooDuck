import { config } from "dotenv";
import { createDataDirIfMissing } from "./lib/FS/utils";
import { telegramOnMessage } from "./telegram/onMessage";
import TelegramBot from "node-telegram-bot-api";

config();

createDataDirIfMissing();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
  throw new Error("No telegram token provided");
}

const TELEGRAM_BOT = new TelegramBot(TOKEN, { polling: true });

// Start the bot
telegramOnMessage(TELEGRAM_BOT);

// Check the node version is OK
(function () {
  const abortController = new AbortController();
  if (!abortController) {
    console.log("\n\n NO ABORT CONTROLLER — USE NEWER NODE JS VERSION \n\n");
  }
})();
