import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

function getLogPath(filename: string) {
  return path.join(process.cwd(), ".ai-logs", filename);
}

async function appendJsonLine(filename: string, payload: Record<string, unknown>) {
  try {
    const directory = path.dirname(getLogPath(filename));
    await mkdir(directory, { recursive: true });
    await appendFile(getLogPath(filename), `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // Logging should never break the request lifecycle in this academic prototype.
  }
}

export async function logSearchEvent(payload: Record<string, unknown>) {
  await appendJsonLine("search-events.jsonl", {
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export async function logChatEvent(payload: Record<string, unknown>) {
  await appendJsonLine("chat-events.jsonl", {
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export async function logRecommendationEvent(payload: Record<string, unknown>) {
  await appendJsonLine("recommendation-events.jsonl", {
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export async function logEvaluationEvent(payload: Record<string, unknown>) {
  await appendJsonLine("evaluation-events.jsonl", {
    timestamp: new Date().toISOString(),
    ...payload,
  });
}
