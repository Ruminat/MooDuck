import { randomFrom } from "@shreklabs/core";
import { isInterjectionsPairs } from "./utils";

export function sentence(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = "";

  for (let i = 0; i < strings.length; i++) {
    const staticString = strings[i];
    const value = values[i];

    if (staticString) {
      result += staticString;
    }

    // There is no value for the last string, so we can skip it
    if (i === strings.length - 1) break;

    if (isInterjectionsPairs(value)) {
      const [, interjection] = randomFrom(value.items);
      result += interjection;
    } else {
      result += String(value);
    }
  }

  return result.trim();
}
