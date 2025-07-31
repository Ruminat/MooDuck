export const TokenAI = {
  deepseek: process.env.DEEPSEEK_API_TOKEN,
  yaGPT: process.env.YA_GPT_API_TOKEN,
} as const;

export type TModel = keyof typeof TokenAI;
