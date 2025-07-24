import TelegramBot from "node-telegram-bot-api";

export class TelegramInputError extends Error {}

export type TTelegramCommandProps = {
  message: TelegramBot.Message;
  fromPart: string;
  messageParsed: string | undefined;
};

export type TTelegramCommandMethods = {
  test: (props: TTelegramCommandProps) => boolean;
  getReply: (props: TTelegramCommandProps) => string;
};
