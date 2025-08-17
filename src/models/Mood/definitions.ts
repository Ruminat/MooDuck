import { TTimestamp } from "../Date/definitions";

// type TDigitString = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
export type TMoodEntryDate = string;

export type TMoodScore = number;

export type TMoodEntry = {
  score: TMoodScore;
  comment?: string;
  created: TTimestamp;
};

export type TMoodReactionModeType = TMoodReactionMode["type"];
export type TMoodReactionMode = { type: "toxic" } | { type: "normal" } | { type: "custom"; hint: string };

/**
 * The farther the number from the average score, the more interesting it is
 *
 * @example If the average mood is 5.5, then mood interest of mood 10 is abs(10 - 5.5) = 4.5
 *
 * @example If the average mood is 5.5, then mood interest of mood 1 is abs(1 - 5.5) = 4.5
 */
export type TMoodInterest = number;
