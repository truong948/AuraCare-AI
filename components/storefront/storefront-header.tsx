"use client";

import Link from "next/link";
import { BookOpen, Heart, Home, Menu, PackageSearch, ReceiptText, Scale, Search, Sparkles, User2 } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StorefrontCartSheet } from "@/components/storefront/storefront-cart-sheet";

const navItems = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Danh mục", href: "/products", icon: PackageSearch },
  { label: "Tư vấn AI", href: "/consult", icon: Sparkles },
  { label: "Bài viết", href: "/articles", icon: BookOpen },
  { label: "So sánh", href: "/compare", icon: Scale },
] as const;

const utilityItems = [
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Đơn hàng", href: "/orders", icon: ReceiptText },
  { label: "Lịch sử AI", href: "/ai-history", icon: User2 },
] as const;

export function StorefrontHeader() {
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();

  return (
    <header className="sticky top-0 z-30 border-b border-[#d7e5df] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl border-[#d7e5df] bg-white lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[86vw] border-[#d7e5df] bg-[#fbfcfa] p-0 sm:max-w-sm">
            <SheetHeader className="border-b border-[#d7e5df] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5b8c7a] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold text-[#0f172a]">AuraCare</SheetTitle>
                  <SheetDescription className="text-sm text-[#64748b]">Mua sắm sức khỏe với AI</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form action="/search" className="px-5 pt-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Tìm sản phẩm..."
                  className="h-12 rounded-2xl border-[#d7e5df] bg-white pl-11 text-sm"
                />
              </div>
            </form>

            <nav className="grid gap-2 p-5">
              {navItems.map((item) => (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#334155] transition hover:bg-[#edf4f1] hover:text-[#0f172a]"
                  >
                    <item.icon className="h-4 w-4 text-[#5b8c7a]" />
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto border-t border-[#d7e5df] p-5">
              <div className="grid gap-2">
                {utilityItems.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#334155]"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-[#5b8c7a]" />
                        {item.label}
                      </span>
                      {item.href === "/wishlist" && wishlistCount > 0 ? (
                        <span className="rounded-full bg-[#0f172a] px-2 py-0.5 text-xs text-white">{wishlistCount}</span>
                      ) : null}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

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
          <Button asChild variant="outline" size="icon" className="rounded-2xl border-[#d7e5df] bg-white lg:hidden">
            <Link href="/search" aria-label="Tìm kiếm">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="relative rounded-2xl border-[#d7e5df] bg-white">
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0f172a] px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="relative rounded-2xl border-[#d7e5df] bg-white">
            <Link href="/compare" aria-label="So sánh sản phẩm">
              <Scale className="h-4 w-4" />
              {compareCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b8c7a] px-1 text-[10px] font-semibold text-white">
                  {compareCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="rounded-2xl border-[#d7e5df] bg-white">
            <Link href="/ai-history" aria-label="Lịch sử AI">
              <User2 className="h-4 w-4" />
            </Link>
          </Button>
          <StorefrontCartSheet />
        </div>
      </div>
    </header>
  );
}
