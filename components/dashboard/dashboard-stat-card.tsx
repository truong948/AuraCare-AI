import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: string;
  description: string;
  tone: string;
  icon: LucideIcon;
}

export function DashboardStatCard({
  title,
  value,
  description,
  tone,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white py-0 shadow-sm shadow-slate-950/5">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </CardTitle>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4 text-sm leading-6 text-slate-500">
        {description}
      </CardContent>
    </Card>
  );
}
