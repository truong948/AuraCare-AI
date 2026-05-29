import { Bot, CalendarDays, ClipboardList, ShieldAlert, Sparkles, User } from "lucide-react";
import { loadAllConsultations } from "@/lib/database-service.server";
import { requireAdmin } from "@/lib/auth/roles";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardConsultationsPage() {
  await requireAdmin();
  const consultations = await loadAllConsultations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Quản trị AI Consultations
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Nhật ký tư vấn chăm sóc da
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Theo dõi và giám sát các phiên tư vấn AI từ khách hàng để thấu hiểu vấn đề về da và các đề xuất routine từ chatbot.
            </p>
          </div>
          <div className="flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white">
            <ShieldAlert className="h-4 w-4 text-cyan-300" />
            Admin only
          </div>
        </div>
      </section>

      {/* Main logs list */}
      <section className="space-y-4">
        {consultations.length === 0 ? (
          <Card className="rounded-[32px] border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Chưa có lịch sử tư vấn AI nào.
          </Card>
        ) : (
          consultations.map((c) => (
            <Card key={c.id} className="rounded-[32px] border-slate-200/85 bg-white p-6 shadow-sm shadow-slate-950/5">
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                
                {/* Left Section: User and Request info */}
                <div className="space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950 text-base">{c.userFullName}</p>
                      <p className="text-xs text-slate-400">{c.userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Mối bận tâm chính
                    </span>
                    <p className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
                      {c.skinConcern}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Chi tiết mô tả
                    </span>
                    <p className="text-sm leading-6 text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-2xl italic">
                      &quot;{c.description}&quot;
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Thời gian tư vấn: {formatDate(c.createdAt)}</span>
                  </div>
                </div>

                {/* Right Section: AI Response Analysis */}
                <div className="space-y-4 lg:w-1/2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                        Phân tích chẩn đoán từ AI
                      </span>
                    </div>

                    {c.aiSummary?.analysis && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500">Chuẩn đoán cơ chế:</p>
                        <p className="text-xs leading-5 text-slate-700">{c.aiSummary.analysis}</p>
                      </div>
                    )}

                    {c.aiSummary?.routine && c.aiSummary.routine.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <ClipboardList className="h-3.5 w-3.5 text-indigo-500" /> Routine đề xuất:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          {c.aiSummary.routine.map((step, idx) => (
                            <li key={idx} className="text-xs text-slate-800 font-medium">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {c.aiSummary?.explanation && (
                    <div className="mt-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Giải thích cơ chế điều trị
                      </p>
                      <p className="text-xs leading-5 text-slate-700 mt-1.5">
                        {c.aiSummary.explanation}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
