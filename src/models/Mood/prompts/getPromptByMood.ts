import { getRandomInt, randomFrom } from "@shreklabs/core";
import { pickRandomPromptMode, PROMPT_MODE } from "../../Prompt/mode";
import { TUser } from "../../User/definitions";
import { TMoodScore } from "../definitions";
import { getLastMoodCommentsForPrompt } from "../sagas/getLastMoodCommentsForPrompt";

type TProps = { user: TUser; score: TMoodScore; comment?: string };

export function getPromptByMood(props: TProps) {
  const seed = String(Math.random()).substring(2);

  const score = `${props.score}/10`;

  // const inspirationWords = sentence`${getInterjectionsByMood(props.score)} ${getInterjectionsByMood(props.score)}`;
  // Вот тебе слова для вдохновения: ${inspirationWords} (можно их не использовать).

  return `Представь, что тебя используют в чат-боте для записи настроения пользователя.
Пришло сообщение о том, что у пользователя настроение ${score}.

${getComment(props)}

Напиши ответ пользователю — реакцию на его настроение.
Не предлагай кофе, пряники или печеньки — это банально и скучно.
НИЧЕГО, КРОМЕ ОТВЕТА ПОЛЬЗОВАТЕЛЮ, ПИСАТЬ НЕ НАДО

${getMode(props)}

Нужен содержательный и краткий ответ — не больше ${getWordsLimit(props)} слов.
Каждый раз ответ должен быть уникальным и интересным.

${getLastMoodCommentsForPrompt({ user: props.user }) ?? ""}

ЕЩЁ РАЗ, НИЧЕГО, КРОМЕ ОТВЕТА ПОЛЬЗОВАТЕЛЮ, ПИСАТЬ НЕ НАДО`;
}

function getComment(props: TProps) {
  return props.comment
    ? `Пользователь написал: "${props.comment}". Обыграй это в ответе — возможно, это ключ к его настроению!`
    : "";
}

function getMode(props: TProps) {
  if (props.score >= 4) {
    return pickRandomPromptMode();
  } else if (props.score >= 2) {
    return randomFrom([PROMPT_MODE.friendly, PROMPT_MODE.philosophical]);
  } else {
    return PROMPT_MODE.friendly;
  }
}

function getWordsLimit(props: TProps) {
  switch (props.score) {
    case 10:
    case 1:
      return getRandomInt(80, 120);
    case 9:
    case 2:
      return getRandomInt(70, 110);
    case 8:
    case 3:
      return getRandomInt(60, 100);
    case 7:
    case 4:
      return getRandomInt(30, 70);
    default:
      return getRandomInt(20, 60);
  }
}
