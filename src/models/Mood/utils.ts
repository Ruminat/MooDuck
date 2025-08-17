import { getRandomInt, randomFrom } from "@shreklabs/core";
import { sentence } from "../SentenceBuilder";
import { getInterjectionsByMood } from "../SentenceBuilder/interjections";
import { TMoodInterest, TMoodScore } from "./definitions";

const MODE = {
  friendly: "Будь добрым и поддерживающим, как лучший друг.",
  toxic:
    "Будь оригинальным, возможно, даже немного токсичным и чернушным (нужна остринка), но при этом забавным (чтобы поднять настроение).",
  absurd: "Ответь чем-то совершенно абсурдным и неожиданным, возможно даже бессмысленным, но желательно забавным.",
  philosophical: "Начни рассуждать о смысле жизни, но кратко и с юмором.",
};

const modes = Object.values(MODE);

// const examples = {
//   "01": ["Нет слов... Как будто "],
// };

type TProps = { score: TMoodScore; comment?: string };

export function getPromptByMood(props: TProps) {
  const seed = String(Math.random()).substring(2);

  const score = `${props.score}/10`;

  const inspirationWords = sentence`${getInterjectionsByMood(props.score)} ${getInterjectionsByMood(props.score)}`;

  return `Представь, что тебя используют в чат-боте для записи настроения пользователя.
Пришло сообщение о том, что у пользователя настроение ${score}.

${getComment(props)}

Напиши ответ пользователю — реакцию на его настроение.
Не предлагай кофе, пряники или печеньки — это банально и скучно.
НИЧЕГО, КРОМЕ ОТВЕТА ПОЛЬЗОВАТЕЛЮ, ПИСАТЬ НЕ НАДО

${getMode(props)}

Нужен содержательный и краткий ответ — не больше ${getWordsLimit(props)} слов.
Каждый раз ответ должен быть уникальным и интересным.
Вот тебе seed для текущего ответа: ${seed} (не пиши ничего про seed пользователю).
Вот тебе слова для вдохновения: ${inspirationWords} (можно их не использовать).

ЕЩЁ РАЗ, НИЧЕГО, КРОМЕ ОТВЕТА ПОЛЬЗОВАТЕЛЮ, ПИСАТЬ НЕ НАДО`;
}

function getComment(props: TProps) {
  return props.comment
    ? `Пользователь написал: "${props.comment}". Обыграй это в ответе — возможно, это ключ к его настроению!`
    : "";
}

function getMode(props: TProps) {
  if (props.score > 3) {
    return randomFrom(modes);
  } else if (props.score > 1) {
    return randomFrom([MODE.friendly, MODE.philosophical]);
  } else {
    return MODE.friendly;
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

export function getMoodInterest({ mood, avgMood }: { mood: TMoodScore; avgMood: number }): TMoodInterest {
  return Math.abs(mood - avgMood);
}
