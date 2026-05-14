"use client";

import { Menu, Search } from "lucide-react";
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

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl border-slate-200 bg-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] border-slate-200 bg-[#eef6f5] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigation</SheetTitle>
            </SheetHeader>
            <div className="flex h-full flex-col px-5 py-6">
              <DashboardLogo />
              <div className="mt-8">
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Điều hướng
                </p>
                <DashboardSidebarNav />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm routine, AI scan, nhật ký..."
            className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-sm shadow-sm shadow-slate-950/5 placeholder:text-slate-400 focus-visible:ring-cyan-500/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm shadow-slate-950/5">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-slate-900 text-sm font-semibold text-white">
              AC
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">Aura Member</p>
            <p className="text-xs text-slate-500">Mock profile</p>
          </div>
        </div>
      </div>
    </header>
  );
}
