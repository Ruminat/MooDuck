import { TTimestamp } from "../Date/definitions";

export type TUser = {
  id: number;
  login?: string;
  created: TTimestamp;
};
