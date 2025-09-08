import { notEmpty } from "@shreklabs/core";
import { take, takeRight } from "lodash";
import { TMoodEntry, TMoodInterest, TMoodScore, TMoodStatsParams } from "../definitions";
import { getUserMood } from "../storage";
import { getMoodInterest } from "../utils";

export function getMoodStats(params: TMoodStatsParams) {
  const mood = getUserMood(params.user.id);

  if (!mood) {
    return undefined;
  }

  const allMoodEntries = Object.values(mood).filter(notEmpty).flat();

  if (allMoodEntries.length === 0) {
    return undefined;
  }

  const topEntriesCount = params.topEntries ?? 10;
  const lastEntriesCount = params.lastCommentedEntries ?? 5;
  const scores: Record<TMoodScore, number | undefined> = {};

  let scoresSum = 0;
  let std = 0;
  const withComments: TMoodEntry[] = [];
  const interestingEntries: (TMoodEntry & { interest: TMoodInterest })[] = [];

  for (const { mood } of traverseMoods(allMoodEntries)) {
    scoresSum += mood.score;

    scores[mood.score] = (scores[mood.score] ?? 0) + 1;

    if (mood.comment) {
      withComments.push(mood);
    }
  }

  const avg = scoresSum / allMoodEntries.length;

  for (const { mood } of traverseMoods(allMoodEntries)) {
    std += (mood.score - avg) ** 2;
  }

  std = Math.sqrt(std / allMoodEntries.length);

  const goodInterest = Math.max(std / 2, 1.1);

  for (const { mood } of traverseMoods(withComments)) {
    const interest = getMoodInterest({ avgMood: avg, mood: mood.score });

    if (interest >= goodInterest) {
      interestingEntries.push({ ...mood, interest });
    }
  }

  const lastCommentedEntries = takeRight(withComments, lastEntriesCount);

  const interestingEntriesSorted = interestingEntries.sort((entryA, entryB) => {
    const byInterest = entryB.interest - entryA.interest;

    return byInterest !== 0 ? byInterest : entryB.created - entryA.created;
  });

  const topEntries = take(interestingEntriesSorted, topEntriesCount).sort((entryA, entryB) => {
    const byScore = entryB.score - entryA.score;

    return byScore !== 0 ? byScore : entryB.created - entryA.created;
  });

  return { scores, avg, std, topEntries, goodInterest, lastCommentedEntries };
}

function* traverseMoods(moods: TMoodEntry[]) {
  for (let index = 0; index < moods.length; index++) {
    yield { index, mood: moods[index] };
  }
}
