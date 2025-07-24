import { isEmpty, notEmpty, stringToNumberOrUndefined } from "@shreklabs/core";
import { TelegramInputError, TTelegramCommandMethods } from "../definitions";
import { createMoodEntry, newMood } from "../../models/mood/storage";
import { createUserEntryIfNotPresent } from "../../models/users/storage";

export const telegramMoodEntry = {
  test: ({ messageParsed }) => {
    if (!messageParsed) return false;

    if (!/^\d{1,2}( .+)?$/.test(messageParsed)) {
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
    const login = props.message.from?.username;
    if (!message) throw new Error("Empty message");
    if (!login) throw new TelegramInputError("Нужен логин, чтобы записать данные...");

    const [scoreString, ...rest] = message.split(" ");
    const comment = rest && rest.length > 0 ? rest.join(" ") : undefined;
    const score = getValidMoodScoreOrUndefined(scoreString);

    if (isEmpty(score)) {
      throw new TelegramInputError("Нужно число от 1 до 10");
    }

    createMoodEntry(createUserEntryIfNotPresent(login), newMood({ score, comment }));

    return `Понял, принял, обработал (${score}${comment ? ` с комментарием "${comment}"` : ""})`;
  },
} satisfies TTelegramCommandMethods;

function getValidMoodScoreOrUndefined(scoreString: string | undefined) {
  if (!scoreString) return undefined;

  const score = stringToNumberOrUndefined(scoreString);

  return notEmpty(score) && score >= 1 && score <= 10 ? score : undefined;
}
