import TelegramBot from "node-telegram-bot-api";
import { logInfo } from "../common/logging";
import { telegramMoodEntry } from "./commands/addMoodEntry";
import { TelegramInputError, TTelegramCommandProps } from "./definitions";

const MAX_SYMBOLS = 1024;

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
        throw new TelegramInputError("Не знаю, что делать с таким сообщением...");
      }

      if (message.text.length >= MAX_SYMBOLS) {
        throw new TelegramInputError(`Не могу обрабатывать больше, чем ${MAX_SYMBOLS} символа`);
      }

      logInfo(`${fromPart} ${message.text}`);

      const reply = getReply();

      logInfo(`@MooDuck: ${reply}\n`);

      bot.sendMessage(chatId, reply, { parse_mode: "HTML" });

      function getReply() {
        if (telegramMoodEntry.test(commandProps)) {
          return telegramMoodEntry.getReply(commandProps);
        }

        return `The fuck is: ""${messageParsed}""?`;
      }
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
