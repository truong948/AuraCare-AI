"use client";

import Link from "next/link";
import { Scale, Trash2 } from "lucide-react";
import { CompareToggleButton } from "@/components/storefront/compare-toggle-button";
import { ProductImage } from "@/components/storefront/product-image";
import { useCompare } from "@/components/compare/compare-context";
import {
  formatMockPrice,
  getCategoryLabel,
  getProductBySlug,
  getStockLabel,
} from "@/lib/mock-data/catalog";

export function ComparePageContent() {
  const { items, count, clearCompare } = useCompare();
  const products = items
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (products.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-[#d7e5df] bg-white p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#edf4f1] text-[#5b8c7a]">
          <Scale className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-[#0f172a]">Bạn chưa chọn sản phẩm nào để so sánh</h2>
        <p className="mt-3 text-sm leading-7 text-[#475569]">
          Hãy thêm 2 đến 4 sản phẩm từ catalog hoặc PDP. So sánh rất hữu ích ở phase này vì nó làm AI storefront có cảm giác quyết định mua hàng rõ hơn.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white">
            Duyệt sản phẩm
          </Link>
          <Link
            href="/consult"
            className="rounded-2xl border border-[#d7e5df] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
          >
            Mở tư vấn AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[30px] border border-[#dce6df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">So sánh sản phẩm</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">{count} lựa chọn đang được đặt cạnh nhau</h2>
          <p className="mt-3 text-sm leading-7 text-[#475569]">
            Màn này giúp người dùng không phải chuyển qua lại giữa nhiều PDP, đặc biệt hữu ích khi so sánh công dụng, giá và cách dùng.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="inline-flex items-center rounded-2xl bg-[#fdf2f2] px-5 py-3 text-sm font-semibold text-[#b42318]"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa danh sách so sánh
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.slug} className="rounded-[28px] border border-[#dce6df] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-[22px] bg-[#f5fbf7]">
              <ProductImage product={product} className="aspect-[4/3]" imageClassName="p-5" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-[#0f172a]">{product.name}</p>
            <p className="mt-2 text-sm leading-6 text-[#475569]">{product.shortDescription}</p>
            <p className="mt-4 text-lg font-bold text-[#0f172a]">{formatMockPrice(product.price)}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-[#5b8c7a]">
                Xem PDP
              </Link>
              <CompareToggleButton productSlug={product.slug} />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[30px] border border-[#dce6df] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
        <table className="min-w-full divide-y divide-[#e6ede8]">
          <tbody className="divide-y divide-[#eef3ef]">
            {[
              { label: "Danh mục", render: (slug: string) => getCategoryLabel(getProductBySlug(slug)!.category) },
              { label: "Giá bán", render: (slug: string) => formatMockPrice(getProductBySlug(slug)!.price) },
              { label: "Tình trạng", render: (slug: string) => getStockLabel(getProductBySlug(slug)!.stockStatus) },
              { label: "Quy cách", render: (slug: string) => getProductBySlug(slug)!.packageSize },
              { label: "Thành phần", render: (slug: string) => getProductBySlug(slug)!.ingredientsText },
              { label: "Cách dùng", render: (slug: string) => getProductBySlug(slug)!.usageInstructions },
              { label: "Lưu ý", render: (slug: string) => getProductBySlug(slug)!.warnings },
            ].map((row) => (
              <tr key={row.label}>
                <td className="w-44 bg-[#f8fbfa] px-5 py-4 align-top text-sm font-semibold text-[#334155]">{row.label}</td>
                {products.map((product) => (
                  <td key={`${row.label}-${product.slug}`} className="px-5 py-4 align-top text-sm leading-7 text-[#475569]">
                    {row.render(product.slug)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
