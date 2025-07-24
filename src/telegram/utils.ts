import TelegramBot from "node-telegram-bot-api";
import { randomFrom } from "../common/random/utils";

export function code(content: string): string {
  return `<code>${content}</code>`;
}

export function b(content: string): string {
  return `<b>${content}</b>`;
}

export function messageHasPrefix(prefixes: string[], message: string) {
  return prefixes.some((prefix) => message.startsWith(prefix));
}

const RICARDO_STICKERS = [
  "CAACAgIAAxkBAAOXZBIRoGoQCfi7Hs-ZzrixXeaKKOUAAk0AA8XXGRXidaWumvAE-C8E",
  "CAACAgIAAxkBAAOdZBISy-HhGdra_v72UjMjB97Q2mgAAlAAA8XXGRXz_oYf98gHAy8E",
  "CAACAgIAAxkBAAOgZBIS5ks0nnG6WEI6SgSDIT0AARPhAAJMAAPF1xkVHZr3AAE5acDPLwQ",
];
export const sendRicardoSticker = (bot: TelegramBot, chatId: number) =>
  bot.sendSticker(chatId, randomFrom(RICARDO_STICKERS));

const SHREK_STICKERS = [
  "CAACAgIAAxkBAAOjZBITeHZW21J5k5V0yR68GoiFPqMAAjIAA1oMNxVIG42mhTZX-C8E",
  "CAACAgIAAxkBAAOmZBITpOs2UwxQFoJ_24QJ2SZEScAAAhoAA1oMNxU7Qwb0512wsi8E",
  "CAACAgIAAxkBAAOpZBITs643GcLUSXo0i_3qeucDRaoAAjQAA1oMNxVttDFM4v0nei8E",
];
export const sendShrekSticker = (bot: TelegramBot, chatId: number) =>
  bot.sendSticker(chatId, randomFrom(SHREK_STICKERS));

const WHAT_STICKERS = [
  "CAACAgIAAxkBAAIBM2Qsfe3paOFAVTQ9ZFw24DRCkjjpAAJLIQAC_TTQS9tic7xqm_ebLwQ",
  "CAACAgIAAxkBAAIBNWQsfica7pG--8dnvxrKv7RhSHL8AAL2IgACUi1wSwpceh9x3lzXLwQ",
  "CAACAgIAAxkBAAIBN2QsfmOCimQRi9JIg7l8AY7PJYrSAAJYAANDM50hhhSnO8Jvxc0vBA",
  "CAACAgIAAxkBAAIBOWQsfnttlzg684kb7jTiMXCGZP_0AAIyGAAC5tUxSvAcmoA-3pxULwQ",
  "CAACAgIAAxkBAAIBO2QsfpNqZ4rT3S_D74s_-48BPfKBAAI0IgACb0egSh_eGKcAARZX9i8E",
];
export const sendWhatSticker = (bot: TelegramBot, chatId: number) => bot.sendSticker(chatId, randomFrom(WHAT_STICKERS));
