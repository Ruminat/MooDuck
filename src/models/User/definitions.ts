import { TTimestamp } from "../Dates/definitions";

export type TUser = {
  id: number;
  login?: string;
  created: TTimestamp;
};
