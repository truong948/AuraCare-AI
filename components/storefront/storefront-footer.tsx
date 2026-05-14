import Link from "next/link";

const footerColumns = [
  {
    title: "Mua sắm",
    links: [
      { label: "Thực phẩm bổ sung", href: "/categories/supplement" },
      { label: "Chăm sóc da", href: "/categories/skincare" },
      { label: "Ưu đãi nhanh", href: "/#deals" },
      { label: "Bài viết mới", href: "/#knowledge" },
    ],
  },
  {
    title: "Tính năng AI",
    links: [
      { label: "Aura AI", href: "/#ai-consult" },
      { label: "Tìm kiếm ngữ nghĩa", href: "/#ai-consult" },
      { label: "Gợi ý sản phẩm", href: "/#deals" },
      { label: "Ghi chú AI", href: "/#knowledge" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Giao hàng", href: "/" },
      { label: "Đổi trả", href: "/" },
      { label: "Quyền riêng tư", href: "/" },
      { label: "Liên hệ", href: "/" },
    ],
  },
] as const;

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[#d7e5df] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">AuraCare</p>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Mô hình thương mại điện tử sức khỏe định hướng nghiên cứu, tập trung vào khám phá sản phẩm rõ ràng, AI hữu
            ích và nội dung đáng tin cậy.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">
              {column.title}
            </p>
            <div className="space-y-2">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-slate-600 transition hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
