import { TTimestamp } from "./definitions";

const msPerMonth = 1000 * 60 * 60 * 24 * 30;

export function getDateFromTimestamp(timestamp: TTimestamp) {
  return String(Math.floor(timestamp / msPerMonth));
}
