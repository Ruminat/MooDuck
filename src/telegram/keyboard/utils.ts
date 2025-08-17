import { InlineKeyboardButton } from "node-telegram-bot-api";
import { TTelegramKeyboard } from "./definitions";

export function telegramKeyboardToInlineKeyboardButton(keyboard: TTelegramKeyboard): InlineKeyboardButton {
  return {
    text: keyboard.label,
    callback_data: keyboard.id,
  };
}

export function telegramKeyboardsToInlineKeyboardButtons(keyboards: TTelegramKeyboard[]): InlineKeyboardButton[] {
  return keyboards.map(telegramKeyboardToInlineKeyboardButton);
}
