import { Droplets, Flame, Sparkles } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { TodayRoutineCard } from "@/components/dashboard/today-routine-card";

const stats = [
  {
    title: "Tình trạng da hiện tại",
    value: "Calm & Balanced",
    description: "Da ổn định, bề mặt mịn hơn và ít xuất hiện kích ứng trong 48 giờ gần nhất.",
    tone: "bg-gradient-to-br from-cyan-500 to-emerald-400",
    icon: Sparkles,
  },
  {
    title: "Số ngày chăm sóc liên tục",
    value: "18 ngày",
    description: "Bạn đang duy trì thói quen chăm sóc rất tốt, chỉ còn 3 ngày để chạm mốc mới.",
    tone: "bg-gradient-to-br from-orange-400 to-rose-500",
    icon: Flame,
  },
  {
    title: "Đánh giá mức độ ẩm",
    value: "76%",
    description: "Độ ẩm đang ở vùng lý tưởng, phù hợp để tiếp tục routine phục hồi và khóa ẩm.",
    tone: "bg-gradient-to-br from-sky-500 to-cyan-500",
    icon: Droplets,
  },
] as const;

const morningRoutine = [
  { id: "morning-cleanser", label: "Sữa rửa mặt dịu nhẹ", completed: true },
  { id: "morning-serum", label: "Serum Vitamin C", completed: true },
  { id: "morning-moisturizer", label: "Kem dưỡng cấp ẩm", completed: false },
  { id: "morning-spf", label: "Kem chống nắng SPF 50+", completed: false },
];

const eveningRoutine = [
  { id: "evening-remover", label: "Tẩy trang và làm sạch kép", completed: false },
  { id: "evening-treatment", label: "Treatment phục hồi barrier", completed: false },
  { id: "evening-mask", label: "Mặt nạ cấp ẩm 10 phút", completed: false },
  { id: "evening-sleeping-mask", label: "Khóa ẩm với sleeping mask", completed: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.14),_transparent_32%),linear-gradient(135deg,_#ffffff_0%,_#f1f5f9_100%)] px-6 py-8 shadow-sm shadow-slate-950/5 ring-1 ring-slate-200/80">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
            AuraCare overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard theo dõi hành trình chăm sóc da của bạn
          </h1>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Toàn bộ nội dung bên dưới đang dùng mock data để định hình shell dashboard,
            từ chỉ số nhanh đến checklist routine hằng ngày.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6">
        <TodayRoutineCard morning={morningRoutine} evening={eveningRoutine} />
      </section>
    </div>
  );
}
