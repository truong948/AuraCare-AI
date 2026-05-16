import { readAiLogsSummary } from "@/lib/ai/log-reader";

export interface UserAiHistoryItem {
  id: string;
  type: "search" | "chat";
  timestamp: string;
  title: string;
  body: string;
  source: string;
}

export async function getUserAiHistory() {
  const summary = await readAiLogsSummary();

  const searchItems: UserAiHistoryItem[] = summary.searchLogs.map((entry, index) => ({
    id: `search-${index}-${entry.timestamp}`,
    type: "search",
    timestamp: String(entry.timestamp ?? ""),
    title: `Tìm kiếm: ${String(entry.query ?? "Không rõ truy vấn")}`,
    body: `Nguồn: ${String(entry.source ?? "unknown")} · Top kết quả: ${Array.isArray(entry.topSlugs) ? entry.topSlugs.join(", ") : "Chưa có"}`,
    source: String(entry.source ?? "unknown"),
  }));

  const chatItems: UserAiHistoryItem[] = summary.chatLogs.map((entry, index) => ({
    id: `chat-${index}-${entry.timestamp}`,
    type: "chat",
    timestamp: String(entry.timestamp ?? ""),
    title: `Chat AI: ${String(entry.message ?? "Không rõ nội dung")}`,
    body: String(entry.handoffSummary ?? "Chưa có handoff summary."),
    source: String(entry.source ?? "unknown"),
  }));

  return [...searchItems, ...chatItems].sort((first, second) =>
    second.timestamp.localeCompare(first.timestamp)
  );
}
