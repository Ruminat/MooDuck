import { notEmpty } from "@shreklabs/core";
import { TMoodEntry, TMoodInterest, TMoodScore } from "../../models/Mood/definitions";
import { getUserMood } from "../../models/Mood/storage";
import { getMoodInterest } from "../../models/Mood/utils";
import { TTelegramCommandMethods } from "../definitions";
import { b, code, getOrCreateTelegramUser } from "../utils";
import { padStart, round, take } from "lodash";

export const telegramStatCommand = {
  test: ({ messageParsed }) => {
    return messageParsed === "/stat";
  },

  getReply: (props) => {
    const user = getOrCreateTelegramUser(props);
    const mood = getUserMood(user.id);

    if (!mood) {
      return noEntriesReply();
    }

    const allMoodEntries = Object.values(mood).filter(notEmpty).flat();

    if (allMoodEntries.length === 0) {
      return noEntriesReply();
    }

    const scores: Record<TMoodScore, number | undefined> = {};
    let scoresSum = 0;
    const interestingEntries: (TMoodEntry & { interest: TMoodInterest })[] = [];

    for (const entry of allMoodEntries) {
      const { score, comment } = entry;

      scoresSum += score;

      scores[score] = (scores[score] ?? 0) + 1;

      const interest = getMoodInterest({ avgMood: 5.5, mood: score });

      if (comment && interest >= 1.5) {
        interestingEntries.push({ ...entry, interest });
      }
    }

    const avgMood = scoresSum / allMoodEntries.length;

    const scoresCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      .map((score) => `— ${moodMarkup(score)}: ${scores[score] ?? 0}`)
      .join("\n");

    const topEntries = take(
      interestingEntries.sort((entryA, entryB) => {
        const byInterest = entryB.interest - entryA.interest;

        return byInterest !== 0 ? byInterest : entryB.created - entryA.created;
      }),
      10
    ).sort((entryA, entryB) => {
      const byScore = entryB.score - entryA.score;

      return byScore !== 0 ? byScore : entryB.created - entryA.created;
    });

    const topEntriesMarkup =
      topEntries.length > 0
        ? `\n\n${b("Топ интересных комментариев")}\n\n${topEntries
            .map((entry) => `— ${moodMarkup(entry.score)}: ${entry.comment}`)
            .join("\n")}`
        : "";

    const text = `${b("Вот твоя статистика")}

— Среднее настроение: ${round(avgMood, 2)}

${b("Оценки")}

${scoresCount}${topEntriesMarkup}`;

    return { text };
  },
} satisfies TTelegramCommandMethods;

function noEntriesReply() {
  return {
    text: "Пока нет никаких записей... Не могу выдать никакой статистики без них. Напиши /help для того, чтобы посмотреть, как мной пользоваться",
  };
}

function moodMarkup(score: TMoodScore): string {
  return code(`${padStart(String(score), 2, " ")}/10`);
}
