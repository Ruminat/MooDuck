import TelegramBot from "node-telegram-bot-api";
import { logInfo } from "../common/logging";
import { telegramMoodEntry } from "./commands/addMoodEntry";
import { telegramHelpCommand } from "./commands/help";
import { telegramStartCommand } from "./commands/start";
import { TelegramInputError, TTelegramCommandProps, TTelegramGetReplyFn } from "./definitions";
import { telegramSendReply } from "./utils";

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

      if (message.text.length >= MAX_SYMBOLS) {
        throw new TelegramInputError(`Не могу обрабатывать больше, чем ${MAX_SYMBOLS} символа`);
      }

      logInfo(`${fromPart} ${message.text}`);

      const reply = getReply(commandProps);

      logInfo(`@MooDuck: ${reply}\n`);

      telegramSendReply(bot, commandProps, reply);
    } catch (error) {
      if (error instanceof TelegramInputError) {
        bot.sendMessage(chatId, error.message, { parse_mode: "HTML" });
      } else {
        console.log("We fucked up...", error);

        bot.sendMessage(chatId, `Что-то пошло не так...`, { parse_mode: "HTML" });
      }
    }
  });

  console.log(`\n  - MooDuck is listening...\n`);
}
