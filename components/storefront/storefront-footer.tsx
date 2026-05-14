import Link from "next/link";

const footerColumns = [
  {
    title: "Shop",
    links: ["Supplement", "Skincare", "Flash deals", "New arrivals"],
  },
  {
    title: "AI Features",
    links: ["Aura assistant", "Semantic search", "Recommendation feed", "AI notes"],
  },
  {
    title: "Support",
    links: ["Shipping", "Returns", "Privacy", "Contact"],
  },
] as const;

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[#d7e5df] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">AuraCare</p>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            A research-first health commerce concept focused on clean product discovery, helpful AI,
            and trustworthy product education.
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
                  key={link}
                  href="/"
                  className="block text-sm text-slate-600 transition hover:text-slate-900"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
