import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { ShieldCheck, Cross, Users2, Leaf, HeartPulse, Stethoscope, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Giới thiệu - AuraCare",
  description: "Tìm hiểu về sứ mệnh và tầm nhìn của AuraCare trong lĩnh vực y tế và chăm sóc sức khỏe.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a] selection:bg-[#0d9488] selection:text-white">
      <StorefrontHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0d9488] pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1920&q=80" 
              alt="Pharmacy background" 
              className="h-full w-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d9488] to-transparent mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-md border border-white/20 mb-8">
              <Activity className="h-4 w-4" />
              <span>Tiên phong chăm sóc sức khỏe số</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Vì Một Cuộc Sống <br className="hidden sm:block" />
              <span className="text-teal-200">Khỏe Mạnh Hơn</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-teal-50 max-w-2xl mx-auto sm:text-xl">
              Trở thành nền tảng y tế số hàng đầu Việt Nam, mang đến sự an tâm, tiện lợi và những sản phẩm chăm sóc sức khỏe đạt chuẩn quốc tế cho mọi gia đình.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-20 -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-white p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-[#dce6df] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-slate-100">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-[#0d9488]">10K+</p>
                <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">Sản phẩm</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-[#0d9488]">100%</p>
                <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">Chính hãng</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-[#0d9488]">24/7</p>
                <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">Dược sĩ tư vấn</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-[#0d9488]">500K+</p>
                <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">Khách hàng</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-100 to-teal-50 rounded-[40px] transform rotate-3 scale-105 -z-10" />
                <div className="rounded-[36px] overflow-hidden shadow-2xl relative z-10 border border-white/50">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80" 
                    alt="Nhà thuốc hiện đại" 
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white font-medium text-lg border-l-4 border-[#0d9488] pl-4">
                      "Sức khỏe của bạn không phải là lĩnh vực có thể thỏa hiệp. Chúng tôi cam kết chất lượng trên từng sản phẩm."
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0d9488] mb-3">Câu chuyện của chúng tôi</h2>
                <h3 className="text-3xl font-bold text-[#0f172a] mb-8 sm:text-4xl leading-tight">Khởi nguồn từ khao khát nâng tầm y tế Việt</h3>
                <div className="space-y-6 text-[#475569] leading-relaxed text-lg">
                  <p>
                    AuraCare ra đời từ sự thấu hiểu sâu sắc những khó khăn của người tiêu dùng khi phải đối mặt với thị trường dược phẩm phức tạp và thiếu minh bạch.
                  </p>
                  <p>
                    Chúng tôi số hóa hoàn toàn trải nghiệm mua sắm các sản phẩm chăm sóc sức khỏe, mang lại sự tiện lợi tối đa mà vẫn giữ trọn vẹn độ tin cậy tuyệt đối như khi bạn được thăm khám tại một cơ sở y tế uy tín.
                  </p>
                  <p>
                    Hệ thống AI Dược Sĩ của chúng tôi không ngừng học hỏi từ hàng triệu tài liệu y khoa để đưa ra những lời khuyên chuẩn xác nhất, giúp bạn lựa chọn đúng sản phẩm, đúng nhu cầu.
                  </p>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-[#0d9488]">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-slate-700">Tận tâm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-[#0d9488]">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-slate-700">Chuyên môn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-24 sm:py-32 border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0d9488] mb-3">Giá trị cốt lõi</h2>
              <h3 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">Những tiêu chuẩn chúng tôi không bao giờ thỏa hiệp</h3>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Chất lượng hàng đầu",
                  desc: "100% sản phẩm chính hãng, được kiểm định nghiêm ngặt qua 3 vòng.",
                  icon: ShieldCheck,
                },
                {
                  title: "Tư vấn chuẩn y khoa",
                  desc: "Đội ngũ Dược sĩ AI và chuyên gia luôn sẵn sàng giải đáp 24/7.",
                  icon: Cross,
                },
                {
                  title: "Trải nghiệm vượt trội",
                  desc: "Mọi tính năng, giao diện đều xoay quanh sự thuận tiện của khách hàng.",
                  icon: Users2,
                },
                {
                  title: "Phát triển bền vững",
                  desc: "Sử dụng bao bì thân thiện môi trường, đóng góp tích cực cho cộng đồng.",
                  icon: Leaf,
                },
              ].map((val, idx) => (
                <div 
                  key={idx} 
                  className="group rounded-[32px] bg-[#f8fafc] p-10 transition-all hover:bg-[#0d9488] hover:shadow-2xl hover:shadow-teal-900/20 hover:-translate-y-2 border border-slate-100 hover:border-transparent"
                >
                  <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-[#0d9488] shadow-sm transition-transform group-hover:scale-110 group-hover:text-[#0f172a]">
                    <val.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-white mb-4">{val.title}</h4>
                  <p className="text-slate-600 group-hover:text-teal-50 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-5xl mb-6">
              Sẵn sàng bắt đầu hành trình <br className="hidden sm:block" /> chăm sóc sức khỏe?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 mb-10 max-w-2xl mx-auto">
              Hàng ngàn sản phẩm chất lượng đang chờ đón bạn. Hãy để AuraCare đồng hành cùng sức khỏe của gia đình bạn ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#0f172a] rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
              >
                Khám phá sản phẩm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/articles" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0f172a] bg-white border border-[#dce6df] rounded-full hover:bg-slate-50 transition-colors"
              >
                Đọc kiến thức y khoa
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
