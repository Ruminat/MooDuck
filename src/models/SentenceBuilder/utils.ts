import { MoodString, TInterjectionsPairs, TMoodString, TMoodWordPair } from "./definitions";

export function moodToString(mood: number): TMoodString | undefined {
  // @ts-expect-error I don't know why TypeScript is complaining here, but it works fine
  return MoodString[mood];
}

export function moodStringToNumber(mood: TMoodString): number {
  return Number(mood);
}

export function interjectionsPairs(items: TMoodWordPair[]): TInterjectionsPairs {
  return { is: "interjections", items };
}

export function isInterjectionsPairs(item: unknown): item is TInterjectionsPairs {
  return typeof item === "object" && item !== null && "is" in item && item.is === "interjections" && "items" in item;
}
