// import { databasePath } from "../../lib/FS/utils";
// import { createJsonStorage } from "../../lib/JsonStorage";
// import { TUser } from "../User/definitions";
// import { TUserSettings } from "./definitions";

// export type TUserSettingsStorage = Record<TUser["id"], TUserSettings | undefined>;

// const $userSettings = createJsonStorage<TUserSettingsStorage>({
//   filePath: databasePath("userSettings.json"),
//   defaultValue: {},
// });

// export function getUserSettings(id: TUser["id"]) {
//   return $userSettings.get()[id];
// }

// export function updateUserSetting<TKey extends TUserSettingKey>(
//   user: Pick<TUser, "id">,
//   key: TKey,
//   value: TUserSetting[TKey]["value"]
// ) {
//   $userSettings.update((old) =>
//     produce(old, (draft) => {
//       if (!draft[user.id]) {
//         draft[user.id] = UserSetting;
//       }

//       const byId = draft[user.id]!;

//       const truncated = getTruncatedTimestamp(newMood.created);
//       if (!byId[truncated]) {
//         byId[truncated] = [];
//       }

//       const moods = byId[truncated]!;

//       moods.push(newMood);
//     })
//   );
// }
