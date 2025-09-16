import { notEmpty } from "@shreklabs/core";
import axios from "axios";
import https from "https";
import { TModel, TokenAI } from "./definitions";
import { addAIReplyEntry } from "./storage";

const httpsAgent = new https.Agent({
  /* rejectUnauthorized: false */
});

// const deepseek = new OpenAI({ baseURL: "https://api.deepseek.com", apiKey: TokenAI.deepseek });

export async function getAIReply({ model, prompt, score }: { model: TModel; prompt: string; score?: number }) {
  if (process.env.RETURN_PROMPT_INSTEAD_OF_ACTUALLY_REQUESTING === "true") {
    return prompt;
  }

  const token = TokenAI[model];

  if (!token) {
    throw new Error(`No API key provided for ${model}`);
  }

  // console.log("\n\n", prompt, "\n\n");

  if (model === "deepseek") {
    throw new Error("Not supported at the moment");
    // const completion = await deepseek.chat.completions.create({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "deepseek-chat",
    // });

    // const reply = completion.choices[0].message.content;

    // if (reply && notEmpty(score)) {
    //   addAIReplyEntry({ model: "deepseek", score, reply });
    // }

    // return reply;
  } else if (model === "yaGPT") {
    const url = process.env.YA_GPT_API_URL;

    if (!url) throw new Error("No yaGPT url provided");

    const folder = process.env.YA_GPT_FOLDER_ID;

    if (!folder) throw new Error("No yaGPT folder provided");

    // const body: Record<string, unknown> = { messages: [{ role: "user", content: prompt }] };

    const body: Record<string, unknown> = {
      modelUri: `gpt://${folder}/yandexgpt`,
      messages: [{ role: "user", text: prompt }],
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: "2000",
        reasoningOptions: { mode: "DISABLED" },
      },
    };

    // const model = process.env.YA_GPT_API_MODEL;
    // if (model) {
    //   body.model = model;
    // }

    try {
      const response = await axios.post(url, body, {
        httpsAgent,
        maxRedirects: 10,
        headers: {
          // Authorization: `OAuth ${token}`,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const reply =
        response?.data?.result?.alternatives?.[0]?.message?.text ??
        response?.data?.response?.Responses?.[0]?.Response ??
        (response?.data?.response?.choices?.[0]?.message?.content as string | undefined);

      // try {
      //   console.log("HOBA!", JSON.stringify(response?.data, null, 2));
      // } catch (error) {
      //   console.log("Couldn't parse", error);
      // }

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
