import { isEmpty, notEmpty, stringToNumberOrUndefined } from "@shreklabs/core";
import TelegramBot from "node-telegram-bot-api";
import { createMoodEntry, newMood } from "../../models/Moods/storage";
import { TUser } from "../../models/User/definitions";
import { createUserEntryIfNotPresent } from "../../models/User/storage";
import { TelegramInputError, TTelegramCommandMethods } from "../definitions";

export const telegramMoodEntry = {
  test: ({ messageParsed }) => {
    if (!messageParsed) return false;

    if (!/^([1-9]|10)( .+)?$/.test(messageParsed)) {
      return false;
    }

    const matched = messageParsed.match(/^\d{1,2}/);
    if (!matched || matched.length !== 1) {
      throw new Error("invalid start number");
    }

    const [scoreString] = matched;

    const score = getValidMoodScoreOrUndefined(scoreString);
    if (notEmpty(score)) {
      return true;
    } else {
      throw new TelegramInputError("Нужно число от 1 до 10");
    }
  },

  getReply: (props) => {
    const message = props.message.text;
    if (!message) throw new Error("Empty message");

    const [scoreString, ...rest] = message.split(" ");
    const comment = rest && rest.length > 0 ? rest.join(" ") : undefined;
    const score = getValidMoodScoreOrUndefined(scoreString);

    if (isEmpty(score)) {
      throw new TelegramInputError("Нужно число от 1 до 10");
    }

    const user = createUserEntryIfNotPresent(props.chatId, getUserPropsFromMessage(props.message));
    createMoodEntry(user, newMood({ score, comment }));

    return `Понял, принял, обработал (${score}${comment ? ` с комментарием "${comment}"` : ""})`;
  },
} satisfies TTelegramCommandMethods;

function getValidMoodScoreOrUndefined(scoreString: string | undefined) {
  if (!scoreString) return undefined;

  const score = stringToNumberOrUndefined(scoreString);

  return notEmpty(score) && score >= 1 && score <= 10 ? score : undefined;
}

function getUserPropsFromMessage(message: TelegramBot.Message) {
  return { login: message.from?.username } satisfies Partial<TUser>;
}
