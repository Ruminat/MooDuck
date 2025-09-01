import { getRandomInt, randomFrom } from "@shreklabs/core";
import { sentence } from "../../SentenceBuilder";
import { getInterjectionsByMood } from "../../SentenceBuilder/interjections";
import { TUser } from "../../User/definitions";
import { TMoodScore } from "../definitions";
import { getMoodStatInfoForPrompt } from "../sagas/getMoodStatInfoForPrompt";
import { MoodPromptCommon } from "./definitions";

const MODE = {
  deadpan: "Сухая ирония, разговорный тон, без пафоса.",
  buddy: "По-дружески и прямо. Можно слегка подколоть, без грубости.",
  calm: "Спокойно и бережно, без нотаций и советов.",
  practical: "Предметно и просто. Без призывов и наставлений.",
};

const modesHigh = [MODE.deadpan, MODE.buddy, MODE.practical];
const modesMid = [MODE.buddy, MODE.practical, MODE.calm];
const modesLow = [MODE.calm, MODE.buddy];

const BAN_OPENERS = ["Окей", "Ок", "Понял", "Понимаю", "Бывает", "Круто", "Кайф", "Неплохо", "Супер"];

const HUMOR_TRICKS = [
  "Короткое наблюдение из жизни по теме пользователя (без морали).",
  "Лёгкая самоирония «так бывает у всех» — одним предложением.",
  "Гиперконкретика: один приземлённый пример из быта вместо общих слов.",
  "Мягкий контраст: «и смешно, и утомляет» — одной фразой.",
];

type TProps = { user: TUser; score: TMoodScore; comment?: string };

export function getPromptByMood(props: TProps) {
  const score = `${props.score}/10`;

  const inspirationWords = sentence`${getInterjectionsByMood(props.score)} ${getInterjectionsByMood(props.score)}`;

  const mode = getMode(props);
  const wordsLimit = getWordsLimit(props);

  const stats = getMoodStatInfoForPrompt({ user: props.user }) ?? "";

  const prompt = `${MoodPromptCommon.promptRole}
У пользователя настроение ${score}.
${getCommentHint(props)}

Напиши ответ простым разговорным русским, с лёгким приземлённым юмором.
Без вопросов и без призывов к действию. Не используй знак вопроса.
Без эмодзи, без восклицательных знаков, без метафор и поэзии.
Не начинай словами: ${BAN_OPENERS.join(", ")}.
${MoodPromptCommon.banPhrases}

Стиль: ${mode}

Как писать:
- 2–4 коротких предложения.
- Возьми одну тему/слово из комментария (если есть) и сделай по ней лаконичное наблюдение.
- Используй 1–2 приёма юмора естественно:
  - ${randomFrom(HUMOR_TRICKS)}
  - ${randomFrom(HUMOR_TRICKS)}
- Будь конкретным; никакой мотивационной пены.
- Заканчивай уверенной точкой, без вопроса и без призывов.

${MoodPromptCommon.wordsLimit(wordsLimit)}
Ничего, кроме ответа пользователю, писать не надо.

Слова для вдохновения: ${inspirationWords} (можешь не использовать).

${stats}`;

  return prompt;
}

function getCommentHint(props: TProps) {
  return props.comment
    ? `Пользователь написал: "${props.comment}". Вытащи один конкретный момент и коротко обыграй его без пересказа.`
    : "";
}

function getMode(props: TProps) {
  if (props.score >= 8) return randomFrom(modesHigh);
  if (props.score >= 4) return randomFrom(modesMid);
  return randomFrom(modesLow);
}

function getWordsLimit(props: TProps) {
  if (props.score >= 8) return getRandomInt(40, 70);
  if (props.score >= 4) return getRandomInt(38, 65);
  return getRandomInt(34, 60);
}
