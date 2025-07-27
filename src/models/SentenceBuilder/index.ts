import { randomFrom } from "@shreklabs/core";
import { isInterjectionsPairs } from "./utils";

export function sentence(strings: TemplateStringsArray, ...values: unknown[]): string {
  console.log("Sussy baka", { strings, values });

  return strings
    .reduce((result, str, i) => {
      const value = values[i - 1];

      if (isInterjectionsPairs(value)) {
        return result + randomFrom(value.items);
      } else {
        return result + str;
      }
    })
    .trim();
}
