export const minutes = (value: number) => ({
  value,
  toSeconds: () => value * 60,
  toMs: () => value * 60 * 1000,
});

export const seconds = (value: number) => ({
  value,
  toMs: () => value * 1000,
});
