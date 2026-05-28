"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, BookOpenText, Droplets, ReceiptText, ScanLine, Settings, Sparkles, SquareKanban, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { UserRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Tổng quan", href: "/dashboard", icon: SquareKanban, adminOnly: false },
  { label: "Người dùng", href: "/dashboard/users", icon: UserCog, adminOnly: true },
  { label: "Sản phẩm", href: "/dashboard/products", icon: SquareKanban, adminOnly: true },
  { label: "Đơn hàng", href: "/dashboard/orders", icon: ReceiptText, adminOnly: true },
  { label: "AI Ops", href: "/dashboard/ai-ops", icon: BrainCircuit, adminOnly: true },
  { label: "Nhật ký da", href: "/diary", icon: BookOpenText, adminOnly: false },
  { label: "AI Scan", href: "/scan", icon: ScanLine, adminOnly: false },
  { label: "Cài đặt", href: "/dashboard/settings", icon: Settings, adminOnly: true },
] as const;

export function DashboardLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-400 text-white shadow-lg shadow-cyan-500/20">
        <Droplets className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Dashboard
        </p>
        <p className="text-lg font-semibold tracking-tight text-slate-900">
          AuraCare AI
        </p>
      </div>
    </Link>
  );
}

interface DashboardSidebarNavProps {
  role: UserRole;
  onNavigate?: () => void;
}

export function DashboardSidebarNav({ role, onNavigate }: DashboardSidebarNavProps) {
  const pathname = usePathname();
  const visibleItems = navigationItems.filter(
    (item) => !item.adminOnly || role === "admin"
  );

  return (
    <nav className="grid gap-2" aria-label="Dashboard navigation">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-12 justify-start rounded-2xl px-4 text-sm font-medium",
              isActive
                ? "bg-slate-900 text-white hover:bg-slate-900/95"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            )}
          >
            <Link href={item.href} onClick={onNavigate}>
              <item.icon className={cn("mr-3 h-4 w-4", isActive && "text-cyan-300")} />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200/70 bg-[#eef6f5] px-5 py-6 lg:flex lg:flex-col">
      <DashboardLogo />

      <Separator className="my-6 bg-slate-200/70" />

      <div className="space-y-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Điều hướng
        </p>
        <DashboardSidebarNav role={role} />
      </div>

      <div className="mt-auto rounded-3xl border border-white/80 bg-white/90 p-4 shadow-sm shadow-cyan-950/5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Aura Routine</p>
            <p className="text-xs leading-5 text-slate-500">
              {role === "admin"
                ? "Bạn có quyền quản trị người dùng, sản phẩm, đơn hàng và AI Ops."
                : "Tài khoản user chỉ thấy các khu vực chăm sóc da cá nhân."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
