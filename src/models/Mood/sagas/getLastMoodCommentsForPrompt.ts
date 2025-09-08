import { howLongAgo } from "../../../lib/dayjs/utils";
import { TMoodStatsParams } from "../definitions";
import { getMoodStats } from "./getMoodStats";

export function getLastMoodCommentsForPrompt(params: TMoodStatsParams) {
  const stats = getMoodStats(params);

  if (!stats) {
    return undefined;
  }

  const lastEntries = stats.lastCommentedEntries;

  if (lastEntries.length === 0) {
    return undefined;
  }

  return `Недавние комментарии пользователя. Прими их к сведению, но не упоминай их. Можешь обыграть интересные комментарии, но только если это будет в тему:

${lastEntries
  .map((entry) => `- ${entry.score}/10: ${entry.comment} (${howLongAgo(Date.now() - entry.created)})`)
  .join("\n")}`;
}
