import { notEmpty } from "@shreklabs/core";
import { databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { clearUserMoodsEntries } from "../Mood/storage";
import { TUser } from "./definitions";

export type TUsersStorage = Record<TUser["id"], TUser | undefined>;

const $users = createJsonStorage<TUsersStorage>({ filePath: databasePath("users.json"), defaultValue: {} });

export function getUserById(id: TUser["id"]) {
  return $users.get()[id];
}

export function createUserEntryIfNotPresent(id: TUser["id"], params?: Pick<TUser, "login">) {
  const user = getUserById(id);

  if (notEmpty(user)) {
    return user;
  } else {
    const newUser = createNewUser(id, params);

    createUserEntry(newUser);

    return newUser;
  }
}

export function createUserEntry(newUser: TUser) {
  $users.update((old) => ({ ...old, [newUser.id]: newUser }));
}

export function removeUserEntry({ id }: Pick<TUser, "id">) {
  removeUserDependencies({ id });

  $users.update((old) => ({ ...old, [id]: undefined }));
}

function removeUserDependencies({ id }: Pick<TUser, "id">) {
  clearUserMoodsEntries({ id });
}

function createNewUser(id: TUser["id"], params?: Pick<TUser, "login">): TUser {
  return { ...params, id, created: Date.now() };
}
