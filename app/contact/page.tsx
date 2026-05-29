import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Liên hệ - AuraCare",
  description: "Liên hệ với AuraCare để được hỗ trợ, tư vấn sức khỏe và giải đáp các thắc mắc.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      
      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl">Liên hệ với chúng tôi</h1>
            <p className="mt-4 text-lg text-[#475569] max-w-2xl mx-auto">
              Đội ngũ Dược sĩ của AuraCare luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm cũng như các vấn đề sức khỏe.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4f1] text-[#0d9488]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Địa chỉ</h3>
                    <p className="mt-1 text-[#475569]">Tòa nhà AuraCare, 123 Đường Sức Khỏe, Quận Y Tế, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4f1] text-[#0d9488]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Hotline (Miễn phí)</h3>
                    <p className="mt-1 text-[#475569]">1800 6928</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4f1] text-[#0d9488]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Email hỗ trợ</h3>
                    <p className="mt-1 text-[#475569]">support@auracare.vn</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4f1] text-[#0d9488]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Giờ làm việc</h3>
                    <p className="mt-1 text-[#475569]">Thứ 2 - Chủ Nhật: 7:00 - 22:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-[24px] overflow-hidden shadow-sm border border-slate-200">
                {/* Mock Map Image */}
                <div className="h-64 bg-slate-200 flex items-center justify-center relative">
                   <img src="/prime-dental/map.jpg" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" />
                   <div className="bg-white p-4 rounded-xl shadow-md z-10 font-bold text-[#0d9488] flex items-center gap-2">
                     <MapPin className="h-5 w-5" /> Trụ sở chính AuraCare
                   </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-[32px] border border-[#dce6df] bg-white p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
              <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-semibold text-[#334155]">Họ</label>
                    <input type="text" id="firstName" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0d9488]" placeholder="Nhập họ..." />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-semibold text-[#334155]">Tên</label>
                    <input type="text" id="lastName" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0d9488]" placeholder="Nhập tên..." />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#334155]">Email</label>
                  <input type="email" id="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0d9488]" placeholder="example@email.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[#334155]">Số điện thoại</label>
                  <input type="tel" id="phone" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0d9488]" placeholder="09xxxxxxxxx" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-[#334155]">Nội dung tin nhắn</label>
                  <textarea id="message" rows={5} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0d9488] resize-none" placeholder="Xin chào, tôi cần tư vấn về..."></textarea>
                </div>

                <Button type="button" className="w-full h-14 text-base rounded-xl bg-[#0d9488] hover:bg-teal-700">
                  Gửi tin nhắn
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
