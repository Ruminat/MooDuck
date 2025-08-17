// import { TMoodReactionMode } from "../Mood/definitions";

// export const UserSetting = {
//   reactionMode: setting<TMoodReactionMode>("reaction.mode", { type: "toxic" }),
// } satisfies Record<string, TSetting<unknown>>;

// export const UserSettingDefaults = {};

// export type TUserSettings = typeof UserSetting;
// export type TUserSettingKey = keyof TUserSettings;
// export type TUserSetting<TKey extends TUserSettingKey> = TUserSettings[TKey];

// type TSetting<T> = ReturnType<typeof setting<T>>;

// function setting<T>(name: string, defaultValue: T, params?: { label?: string }) {
//   UserSettingDefaults[name] = defaultValue;

//   return {
//     name,
//     defaultValue,
//     label: params?.label,
//   };
// }
