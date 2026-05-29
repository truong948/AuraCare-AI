"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, User2, MapPin, Phone, Truck, ShieldCheck, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StorefrontCartSheet } from "@/components/storefront/storefront-cart-sheet";
import { useCart } from "@/components/cart/cart-context";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Bài viết sức khỏe", href: "/articles" },
  { label: "Liên hệ", href: "/contact" },
] as const;

export function StorefrontHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="hidden w-full bg-[#0d9488] px-4 py-2 text-sm text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Hotline: 1800 6928 (Miễn phí)
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Miễn phí vận chuyển từ 300k
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Cam kết 100% chính hãng
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/stores" className="flex items-center gap-2 hover:underline">
              <MapPin className="h-4 w-4" /> Hệ thống nhà thuốc
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-[#0d9488]">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] p-0 sm:max-w-sm">
                <SheetHeader className="border-b border-slate-100 p-5 bg-[#0d9488] text-white">
                  <div className="flex items-center gap-2">
                    <Cross className="h-6 w-6" />
                    <SheetTitle className="text-xl font-bold text-white">AuraCare</SheetTitle>
                  </div>
                </SheetHeader>
                <nav className="grid gap-2 p-5">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#0d9488]"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="my-2 h-px bg-slate-200"></div>
                  <SheetClose asChild>
                    <Link href="/login" className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#0d9488]">
                      Đăng nhập / Đăng ký
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 text-[#0d9488]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d9488] text-white">
                <Cross className="h-6 w-6" />
              </div>
              <span className="hidden text-2xl font-black tracking-tight sm:block">AuraCare</span>
            </Link>
          </div>

          <form action="/search" className="relative flex max-w-2xl flex-1 items-center">
            <Input
              type="search"
              name="q"
              placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
              className="h-11 w-full rounded-full border-2 border-[#0d9488] bg-white pl-4 pr-12 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-9 w-9 rounded-full bg-[#0d9488] text-white hover:bg-teal-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="hidden flex-col items-center justify-center gap-1 text-slate-600 hover:text-[#0d9488] sm:flex">
              <User2 className="h-6 w-6" />
              <span className="text-[10px] font-semibold">Tài khoản</span>
            </Link>
            <div className="relative">
              <StorefrontCartSheet customTrigger={
                <Button variant="ghost" className="flex h-auto flex-col items-center gap-1 px-2 text-slate-600 hover:bg-transparent hover:text-[#0d9488]">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden text-[10px] font-semibold sm:block">Giỏ hàng</span>
                </Button>
              } />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu (Desktop) */}
      <div className="hidden w-full bg-white lg:block shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-bold uppercase tracking-wide text-slate-700 transition-colors hover:text-[#0d9488]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

