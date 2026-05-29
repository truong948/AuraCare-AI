import Link from "next/link";

const footerColumns = [
  {
    title: "Về AuraCare",
    links: [
      { label: "Giới thiệu", href: "/about" },
      { label: "Tuyển dụng", href: "/about" },
      { label: "Hệ thống nhà thuốc", href: "/about" },
      { label: "Bài viết sức khỏe", href: "/articles" },
    ],
  },
  {
    title: "Mua sắm & Hỗ trợ",
    links: [
      { label: "Tất cả sản phẩm", href: "/products" },
      { label: "Theo dõi đơn hàng", href: "/orders" },
      { label: "Chính sách giao hàng", href: "/contact" },
      { label: "Đổi trả & Hoàn tiền", href: "/contact" },
    ],
  },
  {
    title: "Chính sách chung",
    links: [
      { label: "Liên hệ", href: "/contact" },
      { label: "Điều khoản sử dụng", href: "/about" },
      { label: "Quyền riêng tư", href: "/about" },
      { label: "Giải quyết khiếu nại", href: "/contact" },
    ],
  },
] as const;

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[#d7e5df] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:px-8">
        <div className="space-y-3">
          <p className="text-xl font-black tracking-tight text-[#0d9488]">AuraCare</p>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Hệ thống nhà thuốc và chăm sóc sức khỏe toàn diện. Cam kết 100% sản phẩm chính hãng, tư vấn tận tâm bởi đội ngũ dược sĩ chuyên môn cao.
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
