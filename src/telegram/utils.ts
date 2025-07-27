import TelegramBot from "node-telegram-bot-api";
import { TTelegramCommandProps, TTelegramReply } from "./definitions";

export function code(content: string): string {
  return `<code>${content}</code>`;
}

export function b(content: string): string {
  return `<b>${content}</b>`;
}

export function messageHasPrefix(prefixes: string[], message: string) {
  return prefixes.some((prefix) => message.startsWith(prefix));
}

export function telegramSendReply(
  bot: TelegramBot,
  props: TTelegramCommandProps,
  reply: TTelegramReply
): Promise<TelegramBot.Message> {
  if ("text" in reply) {
    return bot.sendMessage(props.chatId, reply.text, { parse_mode: "HTML" });
  } else {
    return bot.sendSticker(props.chatId, reply.sticker);
  }
}
