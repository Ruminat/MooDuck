import { notEmpty } from "@shreklabs/core";
import { databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { TUser } from "../User/definitions";
import { TUserTimer } from "./definitions";

export type TUserTimerStorage = Record<TUser["id"], TUserTimer[] | undefined>;

const $userTimers = createJsonStorage<TUserTimerStorage>({
  filePath: databasePath("userTimer.json"),
  defaultValue: {},
});

export function getUsersTimers() {
  return Object.values($userTimers.get()).filter(notEmpty).flat();
}

export function getUserTimersByUserId(id: TUser["id"]) {
  return $userTimers.get()[id];
}
