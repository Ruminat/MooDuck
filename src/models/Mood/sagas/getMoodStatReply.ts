import { padStart } from "lodash";
import { b, code } from "../../../telegram/utils";
import { TMoodStatsParams } from "../definitions";
import { getMoodStatsLists } from "../utils";
import { getMoodStats } from "./getMoodStats";

export function getMoodStatReply(params: TMoodStatsParams) {
  const stats = getMoodStats(params);

  if (!stats) {
    return undefined;
  }

  const { statsList, scoresList, topEntriesList } = getMoodStatsLists(stats, {
    moodMarkup: (score) => code(`${padStart(String(score), 2, " ")}/10`),
  });

  const topEntriesMarkup =
    stats.topEntries.length > 0 ? `\n\n${b("Топ интересных комментариев")}\n\n${topEntriesList}` : "";

  const statsMarkup = `${b("Вот твоя статистика")}

${statsList}

${b("Оценки")}

${scoresList}${topEntriesMarkup}`;

  return statsMarkup;
}
