import type { DiaryEntry } from "@/types/diary";

interface DiaryGridProps {
  entries: DiaryEntry[];
}

export function DiaryGrid({ entries }: DiaryGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {entries.map((entry) => (
        <article key={entry.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-950">
          <img src={entry.image_url} alt={entry.notes} className="mb-4 h-72 w-full rounded-3xl object-cover" />
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{new Date(entry.created_at).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</p>
            <p className="text-slate-700 dark:text-slate-200">{entry.notes}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
