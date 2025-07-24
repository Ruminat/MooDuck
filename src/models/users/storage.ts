import { notEmpty } from "@shreklabs/core";
import { databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { clearUserMoodsEntries } from "../mood/storage";
import { TUser } from "./definitions";

export type TUsersStorage = Record<TUser["login"], TUser | undefined>;

const $users = createJsonStorage<TUsersStorage>({ filePath: databasePath("users.json"), defaultValue: {} });

export function getUserByLogin(login: TUser["login"]) {
  return $users.get()[login];
}

export function createUserEntryIfNotPresent(login: TUser["login"]) {
  const user = getUserByLogin(login);

  if (notEmpty(user)) {
    return user;
  } else {
    const newUser = createNewUser(login);

    createUserEntry(newUser);

    return newUser;
  }
}

export function createUserEntry(newUser: TUser) {
  $users.update((old) => ({ ...old, [newUser.login]: newUser }));
}

export function removeUserEntry({ login }: Pick<TUser, "login">) {
  removeUserDependencies({ login });

  $users.update((old) => ({ ...old, [login]: undefined }));
}

function removeUserDependencies({ login }: Pick<TUser, "login">) {
  clearUserMoodsEntries({ login });
}

function createNewUser(login: TUser["login"]): TUser {
  return { login, created: Date.now() };
}
