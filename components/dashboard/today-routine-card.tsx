import { CheckCircle2, Circle, MoonStar, Sunrise } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface RoutineItem {
  id: string;
  label: string;
  completed: boolean;
}

interface RoutineSectionProps {
  title: string;
  description: string;
  icon: "morning" | "evening";
  accentClassName: string;
  items: RoutineItem[];
}

function RoutineSection({
  title,
  description,
  icon,
  accentClassName,
  items,
}: RoutineSectionProps) {
  const Icon = icon === "morning" ? Sunrise : MoonStar;

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", accentClassName)}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
          {items.filter((item) => item.completed).length}/{items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-sm shadow-slate-950/5"
          >
            <Checkbox checked={item.completed} disabled aria-label={item.label} />
            {item.completed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300" />
            )}
            <span
              className={cn(
                "text-sm",
                item.completed ? "text-slate-400 line-through" : "text-slate-700"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TodayRoutineCardProps {
  morning: RoutineItem[];
  evening: RoutineItem[];
}

export function TodayRoutineCard({ morning, evening }: TodayRoutineCardProps) {
  return (
    <Card className="rounded-[32px] border border-slate-200/80 bg-white py-0 shadow-sm shadow-slate-950/5">
      <CardHeader className="border-b border-slate-100 px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
          Routine hôm nay
        </p>
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          Lộ trình chăm sóc da hôm nay
        </CardTitle>
        <p className="text-sm leading-6 text-slate-500">
          Checklist tĩnh để mô phỏng luồng chăm sóc buổi sáng và buổi tối trong dashboard.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 px-6 py-6 lg:grid-cols-2">
        <RoutineSection
          title="Morning Routine"
          description="Tập trung làm sạch dịu nhẹ, chống oxy hóa và bảo vệ da."
          icon="morning"
          accentClassName="bg-gradient-to-br from-amber-400 to-orange-500"
          items={morning}
        />
        <RoutineSection
          title="Evening Routine"
          description="Khóa ẩm, phục hồi và tối ưu hiệu quả treatment ban đêm."
          icon="evening"
          accentClassName="bg-gradient-to-br from-slate-800 to-cyan-700"
          items={evening}
        />
      </CardContent>
    </Card>
  );
}
