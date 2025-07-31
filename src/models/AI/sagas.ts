import { notEmpty } from "@shreklabs/core";
import axios from "axios";
import https from "https";
import OpenAI from "openai";
import { TModel, TokenAI } from "./definitions";
import { addAIReplyEntry } from "./storage";

// const cert = fs.readFileSync("/crt/yaGPT.pem");
// const httpsAgent = new https.Agent({ ca: cert });
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const deepseek = new OpenAI({ baseURL: "https://api.deepseek.com", apiKey: TokenAI.deepseek });

export async function getAIReply({ model, prompt, score }: { model: TModel; prompt: string; score?: number }) {
  const token = TokenAI[model];

  if (!token) {
    throw new Error(`No API key provided for ${model}`);
  }

  if (model === "deepseek") {
    const completion = await deepseek.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-chat",
    });

    const reply = completion.choices[0].message.content;

    if (reply && notEmpty(score)) {
      addAIReplyEntry({ model: "deepseek", score, reply });
    }

    return reply;
  } else if (model === "yaGPT") {
    const url = process.env.YA_GPT_API_URL;

    if (!url) throw new Error("No yaGPT url provided");

    const body: Record<string, unknown> = { messages: [{ role: "user", content: prompt }] };
    const model = process.env.YA_GPT_API_MODEL;
    if (model) {
      body.model = model;
    }

    try {
      const response = await axios.post(url, body, {
        httpsAgent,
        maxRedirects: 10,
        headers: {
          Authorization: `OAuth ${token}`,
          "Content-Type": "application/json",
        },
      });

      const reply =
        response?.data?.response?.Responses?.[0]?.Response ??
        (response?.data?.response?.choices?.[0]?.message?.content as string | undefined);

      if (reply && notEmpty(score)) {
        addAIReplyEntry({ model: model ?? { url }, score, reply });
      }

      return reply;
    } catch (error) {
      console.error("Ya GPT error", error);
      throw error;
    }
  } else {
    throw new Error(`Unknown model ${model}`);
  }
}
