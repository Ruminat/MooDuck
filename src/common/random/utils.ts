import { notEmptyArray, randomFrom } from "@shreklabs/core";

export function withProbability<T>(probability: number, getValue: () => T): T | undefined {
  if (Math.random() < probability) {
    return getValue();
  }

  return undefined;
}

export function callRandomParameter(...parameters: (() => unknown)[]) {
  if (notEmptyArray(parameters)) {
    return randomFrom(parameters)();
  } else {
    return undefined;
  }
}
