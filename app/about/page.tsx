import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { ShieldCheck, Cross, Users2, Leaf } from "lucide-react";

export const metadata = {
  title: "Giới thiệu - AuraCare",
  description: "Tìm hiểu về sứ mệnh và tầm nhìn của AuraCare trong lĩnh vực y tế và chăm sóc sức khỏe.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#0d9488] text-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Về AuraCare</h1>
            <p className="mt-6 text-lg leading-8 text-teal-100 max-w-2xl mx-auto">
              Trở thành nền tảng chăm sóc sức khỏe hàng đầu, mang đến sự an tâm và những sản phẩm y tế chất lượng nhất cho mọi gia đình Việt.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">Giá trị cốt lõi</h2>
            <p className="mt-4 text-[#475569]">Những tiêu chuẩn chúng tôi không bao giờ thỏa hiệp.</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[24px] bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] text-[#0d9488] mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Chất lượng hàng đầu</h3>
              <p className="mt-2 text-sm text-[#475569]">100% sản phẩm chính hãng, được kiểm định nghiêm ngặt.</p>
            </div>
            
            <div className="rounded-[24px] bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] text-[#0d9488] mb-6">
                <Cross className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Tư vấn tận tâm</h3>
              <p className="mt-2 text-sm text-[#475569]">Đội ngũ dược sĩ chuyên môn cao, luôn sẵn sàng hỗ trợ.</p>
            </div>
            
            <div className="rounded-[24px] bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] text-[#0d9488] mb-6">
                <Users2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Lấy khách hàng làm trung tâm</h3>
              <p className="mt-2 text-sm text-[#475569]">Mọi cải tiến và dịch vụ đều hướng tới trải nghiệm người dùng.</p>
            </div>
            
            <div className="rounded-[24px] bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] text-[#0d9488] mb-6">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Bền vững</h3>
              <p className="mt-2 text-sm text-[#475569]">Phát triển song hành cùng trách nhiệm với cộng đồng.</p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Câu chuyện của chúng tôi</h2>
                <div className="space-y-4 text-[#475569] leading-8">
                  <p>
                    AuraCare được thành lập với mục tiêu đơn giản nhưng đầy tham vọng: Số hóa trải nghiệm mua sắm các sản phẩm chăm sóc sức khỏe, mang lại sự tiện lợi mà vẫn đảm bảo độ tin cậy tuyệt đối như khi bạn bước vào một nhà thuốc uy tín.
                  </p>
                  <p>
                    Từ những ngày đầu, chúng tôi hiểu rằng sức khỏe không phải là lĩnh vực có thể thỏa hiệp. Mọi sản phẩm trên hệ thống đều đi qua quy trình kiểm soát chất lượng khắt khe nhất, kết hợp với công nghệ hiện đại giúp tối ưu hóa việc phân phối đến tận tay người tiêu dùng.
                  </p>
                  <p>
                    Chúng tôi tự hào là người bạn đồng hành chăm sóc sức khỏe cho hàng triệu gia đình, không ngừng mở rộng danh mục từ Dược mỹ phẩm, Thực phẩm bổ sung cho đến các Thiết bị Y tế chuyên dụng.
                  </p>
                </div>
              </div>
              <div className="rounded-[36px] overflow-hidden shadow-lg h-[400px]">
                <img src="/prime-dental/blog1.jpg" alt="AuraCare Story" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
