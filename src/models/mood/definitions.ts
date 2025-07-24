import { TTimestamp } from "../date/definitions";

// type TDigitString = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
export type TMoodEntryDate = string;

export type TMoodScore = number;

export type TMoodEntry = {
  score: TMoodScore;
  comment?: string;
  created: TTimestamp;
};
