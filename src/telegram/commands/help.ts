import { TTelegramCommandMethods } from "../definitions";

const helpMessage = `Просто пиши мне настроение в формате "1-10 комментарий" и я запомню его. Например:
4 болит живот
или:
8 навернул пельменей
либо же можно просто без комментария:
7

Доступные команды: /start, /help`;

export const telegramHelpCommand = {
  test: ({ messageParsed }) => {
    return messageParsed === "/help";
  },

  getReply: () => {
    return { text: helpMessage };
  },
} satisfies TTelegramCommandMethods;
