import { getRandomInt } from "@shreklabs/core";
import { sentence } from "../SentenceBuilder";
import { getInterjectionsByMood } from "../SentenceBuilder/interjections";
import { TMoodScore } from "./definitions";

export function getPromptByMood({ score }: { score: TMoodScore }) {
  const seed = String(Math.random()).substring(2);

  return `Представь, что тебя используют в чат-боте для записи настроения пользователя
Пришло сообщение о том, что у пользователя настроение ${score}/10
Напиши ответ пользователю — реакцию на его настроение (${score}/10)
Будь оригинальным, возможно, даже немного токсичным и чернушным (нужна остринка), но при этом забавным (чтобы немного поднять настроение)
Нужен содержательный и краткий ответ — не больше ${getRandomInt(20, 60)} слов
Каждый раз ответ должен быть уникальным
Вот тебе seed для текущего ответа: ${seed} (не пиши ничего про seed пользователю).
Вот тебе слова для вдохновения: ${sentence`${getInterjectionsByMood(score)}`} (можно их не использовать).
НИЧЕГО, КРОМЕ ОТВЕТА ПОЛЬЗОВАТЕЛЮ, ПИСАТЬ НЕ НАДО`;
}
