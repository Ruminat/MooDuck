export const TokenAI = {
  deepseek: process.env.DEEPSEEK_API_TOKEN,
  yaGPT: process.env.YA_GPT_API_TOKEN,
  GigaChat: process.env.GIGA_CHAT_TOKEN,
} as const;

export type TModel = keyof typeof TokenAI;

export type TPrompt = string /* | [{ type: "system"; content: string } | { type: "user"; content: string }] */;
