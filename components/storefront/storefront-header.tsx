"use client";

import Link from "next/link";
import { Menu, Search, Sparkles, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorefrontCartSheet } from "@/components/storefront/storefront-cart-sheet";

const navItems = [
  { label: "Bổ sung", href: "/categories/supplement" },
  { label: "Chăm sóc da", href: "/categories/skincare" },
  { label: "AI tư vấn", href: "/#ai-consult" },
  { label: "Kiến thức", href: "/#knowledge" },
  { label: "Giới thiệu", href: "/#top" },
] as const;

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d7e5df] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl border-[#d7e5df] bg-white lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5b8c7a] text-white shadow-lg shadow-[#5b8c7a]/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">
              Sạch sẽ và tin cậy
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-900">AuraCare</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              asChild
              variant="ghost"
              className="rounded-2xl px-4 text-sm text-slate-600 hover:bg-[#edf4f1] hover:text-slate-900"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <form action="/search" className="relative ml-auto hidden max-w-xl flex-1 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            name="q"
            placeholder="Tìm sản phẩm, vấn đề da, thành phần..."
            className="h-12 rounded-2xl border-[#d7e5df] bg-[#f8fbfa] pl-11 pr-32 text-sm shadow-sm shadow-slate-950/5"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 h-8 -translate-y-1/2 rounded-xl bg-[#5b8c7a] px-4 text-[#ffffff] hover:bg-[#4f7c6d]"
          >
            Tìm
          </Button>
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button variant="outline" size="icon" className="rounded-2xl border-[#d7e5df] bg-white lg:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl border-[#d7e5df] bg-white">
            <User2 className="h-4 w-4" />
          </Button>
          <StorefrontCartSheet />
        </div>
      </div>
    </header>
  );
}
