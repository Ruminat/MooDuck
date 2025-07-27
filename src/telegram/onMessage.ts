import TelegramBot from "node-telegram-bot-api";
import { logInfo } from "../common/logging";
import { telegramMoodEntry } from "./commands/addMoodEntry";
import { telegramHelpCommand } from "./commands/help";
import { telegramStartCommand } from "./commands/start";
import { TelegramInputError, TTelegramCommandProps, TTelegramGetReplyFn } from "./definitions";
import { getErrorSticker } from "./stickers/presets";
import { telegramSendReply } from "./utils";
import { sentence } from "../models/SentenceBuilder";
import { Interjection } from "../models/SentenceBuilder/interjections";

const MAX_SYMBOLS = 1024;

const getReply: TTelegramGetReplyFn = (props) => {
  if (telegramStartCommand.test(props)) {
    return telegramStartCommand.getReply();
  }

  if (telegramHelpCommand.test(props)) {
    return telegramHelpCommand.getReply();
  }

  if (telegramMoodEntry.test(props)) {
    return telegramMoodEntry.getReply(props);
  }

  return { text: `Не пон... Напиши /help, чтобы почитать, как мной пользоваться` };
};

export function telegramOnMessage(bot: TelegramBot): void {
  bot.on("message", (message, metadata) => {
    console.log("Hoba!", sentence`${2} plus ${2} is ${4}! ${[]}`);

    const { from, chat } = message;

    const chatId = chat.id;
    const fromPart = from ? `@${from.username} (${from.first_name} ${from.last_name}):` : `Unknown fool:`;
    const messageParsed = message.text ? message.text.toLowerCase().replace(/ё/g, "е") : message.text;

    const commandProps = {
      metadata,
      chatId,
      message,
      fromPart,
      messageParsed,
    } satisfies TTelegramCommandProps;

    try {
      if (!message.text) {
        console.log("\nReceived message without text, ignoring...", message.sticker?.file_id, "\n");
        throw new TelegramInputError("Не знаю, что делать с таким сообщением...");
      }

      if (message.text === "e") {
        throw new Error("OSHIBKA");
      }

      if (message.text.length >= MAX_SYMBOLS) {
        throw new TelegramInputError(`Не могу обрабатывать больше, чем ${MAX_SYMBOLS} символа`);
      }

      logInfo(`${fromPart} ${message.text}`);

      const reply = getReply(commandProps);

      logInfo(`@MooDuck: ${reply}\n`);

      telegramSendReply(bot, commandProps, reply);
    } catch (error) {
      if (error instanceof TelegramInputError) {
        telegramSendReply(bot, commandProps, { text: error.message });
      } else {
        console.log("Oopsie!...", error);

        telegramSendReply(bot, commandProps, [
          { sticker: getErrorSticker() },
          { text: sentence`${Interjection.negative} Какая-то ошибка! Попробуй написать попозже...` },
        ]);
      }
    }
  });

  console.log(`\n  - MooDuck is listening...\n`);
}
