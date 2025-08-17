import { InlineKeyboardButton } from "node-telegram-bot-api";
import { TTelegramCommandMethods } from "../definitions";
import { TelegramKeyboard } from "../keyboard/definitions";
import { telegramKeyboardsToInlineKeyboardButtons } from "../keyboard/utils";

const keyboard: InlineKeyboardButton[][] = [
  telegramKeyboardsToInlineKeyboardButtons([TelegramKeyboard.reactions, TelegramKeyboard.deleteData]),
];

export const telegramSettingsCommand = {
  test: ({ messageParsed }) => {
    return messageParsed === "/settings";
  },

  getReply: () => {
    return { text: "Какие настройки интересуют?", options: { reply_markup: { inline_keyboard: keyboard } } };
  },
} satisfies TTelegramCommandMethods;
