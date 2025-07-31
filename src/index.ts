import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { createDataDirIfMissing } from "./lib/FS/utils";
import { checkNodeFeatures } from "./lib/NodeJS/utils";
import { telegramOnMessage } from "./telegram/onMessage";

checkNodeFeatures();

config();

createDataDirIfMissing();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
  throw new Error("No telegram token provided");
}

const TELEGRAM_BOT = new TelegramBot(TOKEN, { polling: true });

// Start the bot
telegramOnMessage(TELEGRAM_BOT);
