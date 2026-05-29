import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Medal, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import {
  skincareProducts,
  supplementProducts,
} from "@/lib/mock-data/catalog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const categories = [
  { name: "Chăm sóc da mặt", icon: "🧴", href: "/categories/skincare" },
  { name: "Thực phẩm chức năng", icon: "💊", href: "/categories/supplement" },
  { name: "Chăm sóc cá nhân", icon: "🧼", href: "/categories/personal-care" },
  { name: "Thiết bị y tế", icon: "🌡️", href: "/categories/medical-devices" },
  { name: "Mẹ & Bé", icon: "👶", href: "/categories/mom-baby" },
  { name: "Dược mỹ phẩm", icon: "🌿", href: "/categories/skincare" },
];

const features = [
  { icon: ShieldCheck, title: "100% Chính hãng", desc: "Đảm bảo chất lượng" },
  { icon: Truck, title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 300k" },
  { icon: RotateCcw, title: "Đổi trả 30 ngày", desc: "Miễn phí đổi trả" },
  { icon: Medal, title: "Tư vấn chuyên môn", desc: "Từ Dược sĩ" },
];

export default function HomePage() {
  const topSkincare = skincareProducts.slice(0, 8);
  const topSupplements = supplementProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StorefrontHeader />

      <main className="pb-16">
        {/* Features Bar */}
        <section className="bg-white border-b border-slate-200 py-3 hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-[#0d9488]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{feature.title}</p>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Carousel */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Carousel className="w-full rounded-2xl overflow-hidden shadow-sm">
            <CarouselContent>
              <CarouselItem>
                <div className="relative aspect-[21/9] w-full bg-slate-100">
                  <Image 
                    src="/images/promo_banner_1.png" 
                    alt="Khuyến mãi Dược mỹ phẩm"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative aspect-[21/9] w-full bg-slate-100">
                  <Image 
                    src="/images/promo_banner_2.png" 
                    alt="Khuyến mãi Thực phẩm chức năng"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        {/* Category Grid */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Danh Mục Nổi Bật</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={cat.href}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0d9488] hover:shadow-md"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-center text-sm font-semibold text-slate-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Skincare Section */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 uppercase">Dược Mỹ Phẩm Bán Chạy</h2>
            <Link href="/products?category=skincare" className="flex items-center text-sm font-semibold text-[#0d9488] hover:underline">
              Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {topSkincare.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Banner Break */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0d9488] to-teal-600 p-8 text-white sm:p-12 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-3">Tải Ứng Dụng AuraCare</h2>
              <p className="text-teal-50 max-w-lg leading-relaxed">
                Quản lý đơn hàng, tích điểm thành viên và nhận thông báo khuyến mãi sớm nhất. Tải app ngay hôm nay!
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-12 px-6 bg-white/20 rounded-xl flex items-center justify-center font-bold border border-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition">
                App Store
              </div>
              <div className="h-12 px-6 bg-white text-[#0d9488] rounded-xl flex items-center justify-center font-bold shadow-sm cursor-pointer hover:bg-slate-50 transition">
                Google Play
              </div>
            </div>
          </div>
        </section>

        {/* Supplements Section */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 uppercase">Thực Phẩm Chức Năng</h2>
            <Link href="/products?category=supplement" className="flex items-center text-sm font-semibold text-[#0d9488] hover:underline">
              Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {topSupplements.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      <StorefrontFooter />
    </div>
  );
}
