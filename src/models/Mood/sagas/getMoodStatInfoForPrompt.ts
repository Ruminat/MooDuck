import { TMoodStatsParams } from "../definitions";
import { getMoodStatsLists } from "../utils";
import { getMoodStats } from "./getMoodStats";

export function getMoodStatInfoForPrompt(params: TMoodStatsParams) {
  const stats = getMoodStats(params);

  if (!stats) {
    return undefined;
  }

  const { statsList, scoresList, topEntriesList } = getMoodStatsLists(stats);

  const topEntriesMarkup =
    stats.topEntries.length > 0 ? `\n\n### Топ интересных комментариев\n\n${topEntriesList}` : "";

  return `### Статистика пользователя

Прими её к сведению, но не упоминай её. Можешь обыграть интересные комментарии из статистики, но только если это будет в тему

${statsList}

### Оценки

${scoresList}${topEntriesMarkup}`;
}
