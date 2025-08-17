import { produce } from "immer";
import memoize from "lodash/memoize";
import { createDirIfMissing, databasePath } from "../../lib/FS/utils";
import { createJsonStorage } from "../../lib/JsonStorage";
import { TMoodScore } from "../Mood/definitions";

type TModelName = string;
type TModel = string | { url: string };
type TReply = string;

export type TAIStorage = {
  replies: Record<TMoodScore, Record<TReply, number | undefined> | undefined>;
};

const getStorage = memoize((model: TModelName) => {
  createDirIfMissing(databasePath(`ai`));

  return createJsonStorage<TAIStorage>({
    filePath: databasePath(`ai/${model}.json`),
    defaultValue: { replies: {} },
  });
});

export function addAIReplyEntry({ model, score, reply }: { model: TModel; score: TMoodScore; reply: string }) {
  const storage = getStorage(getModelName(model));

  storage.update((current) =>
    produce(current, (draft) => {
      if (!draft.replies[score]) {
        draft.replies[score] = {};
      }

      const byScore = draft.replies[score]!;
      byScore[reply] = (byScore[reply] ?? 0) + 1;
    })
  );
}

function getModelName(model: TModel): TModelName {
  try {
    if (typeof model === "string") {
      return toSafeFSName(model);
    } else {
      return toSafeFSName(new URL(model.url).pathname) || "unknown";
    }
  } catch (error) {
    return "unknown";
  }
}

function toSafeFSName(name: string): string {
  return name.replace(/\W/g, "-");
}
