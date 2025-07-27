export const MoodString = {
  1: "01",
  2: "02",
  3: "03",
  4: "04",
  5: "05",
  6: "06",
  7: "07",
  8: "08",
  9: "09",
  10: "10",
} as const;

export type TInterjectionsPairs = {
  is: "interjections";
  items: TMoodWordPair[];
};

export type TMoodString = ValueOf<typeof MoodString>;
export type TMoodWordPair = [TMoodString, string];
export type TMoodWordPairsMap = Record<string, TMoodWordPair[]>;
