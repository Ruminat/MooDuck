import dayjs from "./dayjs";

export function howLongAgo(ms: number): string {
  const duration = dayjs.duration(ms).humanize();

  return `${duration} назад`;
}
