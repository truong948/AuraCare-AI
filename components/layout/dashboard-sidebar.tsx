"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, PackageOpen, LayoutDashboard, Truck, UserCog, HeartPulse, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { UserRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { label: "Doanh thu", href: "/dashboard/revenue", icon: Banknote, adminOnly: true },
  { label: "Sản phẩm", href: "/dashboard/products", icon: PackageOpen, adminOnly: true },
  { label: "Đơn hàng", href: "/dashboard/orders", icon: ReceiptText, adminOnly: true },
  { label: "Giao hàng", href: "/dashboard/shipping", icon: Truck, adminOnly: true },
  { label: "Khách hàng", href: "/dashboard/users", icon: UserCog, adminOnly: true },
] as const;

export function DashboardLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0d9488] via-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/20">
        <HeartPulse className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0d9488]">
          Quản trị
        </p>
        <p className="text-lg font-semibold tracking-tight text-slate-900">
          AuraCare Admin
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
              "h-12 justify-start rounded-2xl px-4 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#0d9488] text-white hover:bg-[#0f766e] shadow-md shadow-teal-900/10"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            )}
          >
            <Link href={item.href} onClick={onNavigate} prefetch={false}>
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
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
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200/70 bg-[#f6f4ee] px-5 py-6 lg:flex lg:flex-col">
      <DashboardLogo />

      <Separator className="my-6 bg-[#dce6df]" />

      <div className="space-y-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">
          Điều hướng
        </p>
        <DashboardSidebarNav role={role} />
      </div>

      <div className="mt-auto rounded-3xl border border-[#dce6df] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0d9488]">
            <UserCog className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Admin Panel</p>
            <p className="text-xs leading-5 text-[#475569]">
              Quản lý toàn bộ hệ thống bán hàng và dịch vụ nội bộ của AuraCare.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
