import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardSettingsPage() {
  return (
    <Card className="rounded-[32px] border border-slate-200/80 bg-white py-0 shadow-sm shadow-slate-950/5">
      <CardHeader className="border-b border-slate-100 px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
          Cài đặt
        </p>
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          Khu vực thiết lập dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6 text-sm leading-7 text-slate-600">
        Trang này là placeholder tĩnh để menu điều hướng không dẫn tới trang lỗi trong quá
        trình hoàn thiện UI shell.
      </CardContent>
    </Card>
  );
}
