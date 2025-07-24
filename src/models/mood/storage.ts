import { produce } from "immer";
import { databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { getDateFromTimestamp } from "../date/utils";
import { TUser } from "../users/definitions";
import { TMoodEntry, TMoodEntryDate } from "./definitions";

export type TMoodStorage = Record<TUser["login"], Record<TMoodEntryDate, TMoodEntry[] | undefined> | undefined>;

const $mood = createJsonStorage<TMoodStorage>({ filePath: databasePath("mood.json"), defaultValue: {} });

export function getUserMood(login: TUser["login"]) {
  return $mood.get()[login];
}

export function createMoodEntry(user: Pick<TUser, "login">, newMood: TMoodEntry) {
  $mood.update((old) =>
    produce(old, (draft) => {
      if (!draft[user.login]) {
        draft[user.login] = {};
      }

      const byLogin = draft[user.login]!;

      const date = getDateFromTimestamp(newMood.created);
      if (!byLogin[date]) {
        byLogin[date] = [];
      }

      const moods = byLogin[date]!;

      moods.push(newMood);
    })
  );
}

export function clearUserMoodsEntries(user: Pick<TUser, "login">) {
  $mood.update((old) => ({ ...old, [user.login]: undefined }));
}

export function newMood(mood: Omit<TMoodEntry, "created">): TMoodEntry {
  return { ...mood, created: Date.now() };
}
