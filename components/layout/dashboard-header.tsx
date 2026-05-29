"use client";

import { LogOut, Menu, Search, ShieldCheck } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DashboardLogo,
  DashboardSidebarNav,
} from "@/components/layout/dashboard-sidebar";
import type { AppUserProfile, UserRole } from "@/lib/auth/roles";

interface DashboardHeaderProps {
  profile: AppUserProfile;
  role: UserRole;
}

function getInitials(profile: AppUserProfile) {
  const source = profile.full_name || profile.email || "AuraCare";
  return source
    .split(/[ @._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function DashboardHeader({ profile, role }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#dce6df] bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl border-[#dce6df] bg-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] border-[#dce6df] bg-[#f6f4ee] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigation</SheetTitle>
            </SheetHeader>
            <div className="flex h-full flex-col px-5 py-6">
              <DashboardLogo />
              <div className="mt-8">
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">
                  Điều hướng
                </p>
                <DashboardSidebarNav role={role} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            className="h-12 rounded-2xl border-[#dce6df] bg-[#f6f4ee] pl-11 text-sm shadow-sm placeholder:text-slate-400 focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 rounded-2xl border border-[#dce6df] bg-white px-3 py-2 shadow-sm">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#0d9488] text-sm font-semibold text-white">
              {getInitials(profile) || "AC"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-[#0f172a]">
              {profile.full_name || profile.email}
            </p>
            <p className="flex items-center gap-1 text-xs text-[#5b8c7a]">
              {role === "admin" ? <ShieldCheck className="h-3 w-3" /> : null}
              {role === "admin" ? "Quản trị viên" : "Người dùng"}
            </p>
          </div>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-xl text-[#475569] hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
