import ScanShell from "@/components/scan/scan-shell";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">AI Skin Scan & Consultant</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Mô phỏng giao diện camera scanner, phân tích triệu chứng da bằng Gemini 1.5 Pro và gợi ý sản phẩm phù hợp.
          </p>
        </section>
        <ScanShell />
      </div>
    </main>
  );
}
