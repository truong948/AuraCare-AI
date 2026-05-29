import { notFound } from "next/navigation";
import { ChevronLeft, UserCircle, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireAdmin, type AppUserProfile } from "@/lib/auth/roles";
import { getConsultationsByUserId } from "@/lib/database-service";

export default async function UserDetailAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id: userId } = await params;

  const { data: user, error } = (await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()) as {
    data: AppUserProfile | null;
    error: Error | null;
  };

  if (error || !user) {
    console.error("Error fetching user:", error?.message);
    notFound();
  }

  const consultations = await getConsultationsByUserId(userId);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/users">
        <Button variant="ghost" className="mb-4 inline-flex items-center gap-2 rounded-2xl pl-0 text-slate-500 hover:text-slate-900">
          <ChevronLeft className="h-4 w-4" /> Quay lại danh sách
        </Button>
      </Link>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserCircle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Chi tiết người dùng
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {user.full_name || "Chưa đặt tên"}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
              <span>{user.email}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium capitalize text-slate-700">
                Vai trò: {user.role}
              </span>
              <span className={`rounded-full px-3 py-1 font-medium capitalize ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Trạng thái: {user.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Lịch sử tra cứu AI</h2>
          <p className="mt-1 text-sm text-slate-600">
            Các cuộc trò chuyện, tư vấn của tài khoản này với Trợ lý AI.
          </p>
        </div>

        {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-12 text-center">
            <Bot className="h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-900">Chưa có lịch sử</p>
            <p className="mt-1 text-sm text-slate-500">Người dùng này chưa thực hiện bất kỳ cuộc tư vấn AI nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Vấn đề: {consultation.skinConcern}</p>
                  <span className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(consultation.createdAt))}
                  </span>
                </div>
                {consultation.description && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Mô tả của khách hàng:</span> {consultation.description}
                  </p>
                )}
                {consultation.aiSummary && consultation.aiSummary.analysis && (
                  <div className="mt-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">AI Phân tích</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{consultation.aiSummary.analysis}</p>
                  </div>
                )}
                {consultation.aiSummary && consultation.aiSummary.routine && (
                  <div className="mt-2 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">Routine Khuyên dùng</p>
                    <ul className="list-disc pl-5 text-sm text-slate-700">
                      {consultation.aiSummary.routine.map((rec: string, idx: number) => (
                        <li key={idx} className="mt-1">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
