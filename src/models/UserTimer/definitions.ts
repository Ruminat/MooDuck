import { TTimestamp } from "../Date/definitions";
import { TUser } from "../User/definitions";

export type TMoodUserTimer = {
  type: "mood-user-timer";
  userId: TUser["id"];
  timestamp: TTimestamp;
};

export type TUserTimer = TMoodUserTimer;
