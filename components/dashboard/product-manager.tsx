"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockProducts, type MockProduct, type ProductCategory } from "@/lib/mock-data/catalog";

const DASHBOARD_PRODUCTS_KEY = "auracare_admin_products";

function loadAdminProducts() {
  if (typeof window === "undefined") return mockProducts;
  try {
    const raw = window.localStorage.getItem(DASHBOARD_PRODUCTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as MockProduct[]) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return mockProducts;
}

function saveAdminProducts(products: MockProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DASHBOARD_PRODUCTS_KEY, JSON.stringify(products));
}

function buildEmptyProduct(): Partial<MockProduct> {
  return {
    name: "",
    brand: "AuraCare Lab",
    category: "supplement",
    shortDescription: "",
    longDescription: "",
    price: 0,
    compareAtPrice: 0,
    stockStatus: "in_stock",
    packageSize: "1 set",
    ingredientsText: "",
    usageInstructions: "",
    warnings: "",
    concernTags: [],
    symptomTags: [],
    benefitTags: [],
    searchableText: "",
    rating: 4.5,
    reviewCount: 0,
    originCountry: "Vietnam",
    badge: "New",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
  };
}

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "supplement", label: "Thực phẩm bổ sung" },
  { value: "skincare", label: "Chăm sóc da" },
];

const badgeOptions = ["Best seller", "New", "AI pick", "Flash deal"] as const;

export function DashboardProductManager() {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<MockProduct>>(() => buildEmptyProduct());

  useEffect(() => {
    const loaded = loadAdminProducts();
    setProducts(loaded);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      saveAdminProducts(products);
    }
  }, [products]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.slug === editingSlug) ?? null,
    [editingSlug, products]
  );

  useEffect(() => {
    if (selectedProduct) {
      setDraft(selectedProduct);
    } else {
      setDraft(buildEmptyProduct());
    }
  }, [selectedProduct]);

  const setField = <K extends keyof MockProduct>(field: K, value: MockProduct[K] | string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!draft.name || !draft.category || !draft.price || !draft.shortDescription) {
      return;
    }

    const slugBase = draft.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);

    const slug = editingSlug ?? `${slugBase || "product"}-${Date.now()}`;
    const product: MockProduct = {
      id: editingSlug ? selectedProduct!.id : `admin-${Date.now()}`,
      slug,
      name: draft.name,
      brand: draft.brand || "AuraCare Lab",
      category: draft.category as ProductCategory,
      shortDescription: draft.shortDescription,
      longDescription: draft.longDescription || draft.shortDescription,
      price: Number(draft.price) || 0,
      compareAtPrice: Number(draft.compareAtPrice) || Number(draft.price) || 0,
      stockStatus: draft.stockStatus || "in_stock",
      packageSize: draft.packageSize || "1 set",
      ingredientsText: draft.ingredientsText || "",
      usageInstructions: draft.usageInstructions || "",
      warnings: draft.warnings || "",
      concernTags: draft.concernTags || [],
      symptomTags: draft.symptomTags || [],
      benefitTags: draft.benefitTags || [],
      searchableText: draft.searchableText || "",
      rating: Number(draft.rating) || 4.5,
      reviewCount: Number(draft.reviewCount) || 0,
      originCountry: draft.originCountry || "Vietnam",
      badge: draft.badge || "New",
      image: draft.image || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
      embeddingVector: draft.embeddingVector ?? null,
    };

    setProducts((current) => {
      const existingIndex = current.findIndex((item) => item.slug === slug);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = product;
        return next;
      }
      return [product, ...current];
    });
    setEditingSlug(null);
    setDraft(buildEmptyProduct());
  };

  const handleCancel = () => {
    setEditingSlug(null);
    setDraft(buildEmptyProduct());
  };

  const handleDelete = (slug: string) => {
    setProducts((current) => current.filter((item) => item.slug !== slug));
    if (editingSlug === slug) {
      handleCancel();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Catalog Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Quản lý sản phẩm</h1>
          </div>
          <Button onClick={() => setEditingSlug(null)} className="inline-flex items-center gap-2 rounded-2xl bg-[#5b8c7a] text-white hover:bg-[#4f7c6d]">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-700">Số sản phẩm trong catalog</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">{products.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Last update</p>
            <p className="mt-2 text-base text-slate-500">Dữ liệu lưu trong localStorage, phù hợp cho Phase 2 MVP.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Danh sách sản phẩm</p>
                <p className="mt-2 text-sm text-slate-600">Danh sách sản phẩm mock catalog, hỗ trợ chỉnh sửa và xóa trực tiếp.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{products.length} items</span>
            </div>

            <div className="mt-6 space-y-4">
              {products.slice(0, 12).map((product) => (
                <div key={product.slug} className="rounded-3xl border border-slate-200 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.brand} · {product.category}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button onClick={() => setEditingSlug(product.slug)} variant="outline" className="rounded-2xl">
                        <Pencil className="h-4 w-4" /> Sửa
                      </Button>
                      <Button onClick={() => handleDelete(product.slug)} variant="destructive" className="rounded-2xl">
                        <Trash2 className="h-4 w-4" /> Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Trạng thái biên tập</p>
                <p className="mt-2 text-sm text-slate-600">Chọn sản phẩm để cập nhật hoặc tạo mới catalog.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {editingSlug ? "Đang chỉnh sửa" : "Tạo mới"}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Tên sản phẩm
                  <Input value={draft.name ?? ""} onChange={(event) => setField("name", event.target.value)} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Giá bán
                  <Input type="number" value={draft.price ?? 0} onChange={(event) => setField("price", Number(event.target.value))} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Danh mục
                  <select
                    value={draft.category ?? "supplement"}
                    onChange={(event) => setField("category", event.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Nhãn
                  <select
                    value={draft.badge ?? "New"}
                    onChange={(event) => setField("badge", event.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                  >
                    {badgeOptions.map((badge) => (
                      <option key={badge} value={badge}>{badge}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Mô tả ngắn
                <Input value={draft.shortDescription ?? ""} onChange={(event) => setField("shortDescription", event.target.value)} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Mô tả dài
                <Input value={draft.longDescription ?? ""} onChange={(event) => setField("longDescription", event.target.value)} />
              </label>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="rounded-2xl bg-[#5b8c7a] text-white hover:bg-[#4f7c6d]">Lưu</Button>
                <Button variant="outline" onClick={handleCancel} className="rounded-2xl">Hủy</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <div className="flex items-center gap-3 text-slate-900">
            <Archive className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">Lời nhắc Phase 2</p>
              <p className="mt-1 text-sm text-slate-600">Nâng cấp sản phẩm sang backend thật hoặc Supabase khi bước sang Phase 3.</p>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-sm leading-7 text-slate-600">
            Danh mục hiện đang dùng bộ dữ liệu mock, nhưng UX đã sẵn sàng cho CRUD admin. Kết nối API product vào database thật là bước tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}
