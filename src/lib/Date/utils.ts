import moment = require("moment");

moment.locale("ru");

export function formatTimeAgo(time: number): string {
  return moment(time).fromNow();
}

export const minutes = (value: number) => ({
  value,
  toSeconds: () => value * 60,
  toMs: () => value * 60 * 1000,
});

export const seconds = (value: number) => ({
  value,
  toMs: () => value * 1000,
});
