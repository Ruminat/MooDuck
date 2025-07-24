import { produce } from "immer";
import { databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { getTruncatedTimestamp } from "../Dates/utils";
import { TUser } from "../User/definitions";
import { TMoodEntry, TMoodEntryDate } from "./definitions";

export type TMoodStorage = Record<TUser["id"], Record<TMoodEntryDate, TMoodEntry[] | undefined> | undefined>;

const $mood = createJsonStorage<TMoodStorage>({ filePath: databasePath("mood.json"), defaultValue: {} });

export function getUserMood(id: TUser["id"]) {
  return $mood.get()[id];
}

export function createMoodEntry(user: Pick<TUser, "id">, newMood: TMoodEntry) {
  $mood.update((old) =>
    produce(old, (draft) => {
      if (!draft[user.id]) {
        draft[user.id] = {};
      }

      const byId = draft[user.id]!;

      const truncated = getTruncatedTimestamp(newMood.created);
      if (!byId[truncated]) {
        byId[truncated] = [];
      }

      const moods = byId[truncated]!;

      moods.push(newMood);
    })
  );
}

export function clearUserMoodsEntries(user: Pick<TUser, "id">) {
  $mood.update((old) => ({ ...old, [user.id]: undefined }));
}

export function newMood(mood: Omit<TMoodEntry, "created">): TMoodEntry {
  return { ...mood, created: Date.now() };
}
