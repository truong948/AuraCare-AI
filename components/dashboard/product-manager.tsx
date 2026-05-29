"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockProducts, type MockProduct, type ProductCategory } from "@/lib/mock-data/catalog";
import { getProducts, adminUpsertProduct, adminDeleteProduct, adminBulkUpsertProducts } from "@/lib/database-service";

const DASHBOARD_PRODUCTS_KEY = "auracare_admin_products";
const defaultProductImage = mockProducts[0]?.image ?? "";

function loadAdminProductsFallback() {
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

function saveAdminProductsFallback(products: MockProduct[]) {
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
    image: defaultProductImage,
  };
}

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "supplement", label: "Thực phẩm bổ sung" },
  { value: "skincare", label: "Dược mỹ phẩm" },
  { value: "medicine", label: "Thuốc không kê đơn" },
  { value: "personal-care", label: "Chăm sóc cá nhân" },
  { value: "medical-devices", label: "Thiết bị y tế" },
];

const badgeOptions = ["Best seller", "New", "AI pick", "Flash deal"] as const;

export function DashboardProductManager() {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<MockProduct>>(() => buildEmptyProduct());

  useEffect(() => {
    async function init() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setProducts(loadAdminProductsFallback());
    }
    init();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      saveAdminProductsFallback(products);
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

  const handleSave = async () => {
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
      image: draft.image || defaultProductImage,
      embeddingVector: draft.embeddingVector ?? null,
    };

    // Save to Supabase (dynamic fallback inside)
    const { success, data: savedData } = await adminUpsertProduct(product);
    const finalProduct = success && savedData ? savedData : product;

    setProducts((current) => {
      const existingIndex = current.findIndex((item) => item.slug === slug);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = finalProduct;
        return next;
      }
      return [finalProduct, ...current];
    });
    setEditingSlug(null);
    setDraft(buildEmptyProduct());
  };

  const handleCancel = () => {
    setEditingSlug(null);
    setDraft(buildEmptyProduct());
  };

  const handleDelete = async (slug: string) => {
    await adminDeleteProduct(slug);
    setProducts((current) => current.filter((item) => item.slug !== slug));
    if (editingSlug === slug) {
      handleCancel();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">Catalog Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#0f172a]">Quản lý sản phẩm</h1>
          </div>
          <Button onClick={() => { setEditingSlug(null); setDraft(buildEmptyProduct()); }} className="inline-flex items-center gap-2 rounded-2xl bg-[#0d9488] text-white hover:bg-[#0f766e] shadow-sm">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Số sản phẩm trong catalog</p>
            <p className="mt-2 text-4xl font-semibold text-[#0d9488]">{products.length}</p>
          </div>
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Trạng thái đồng bộ</p>
            <p className="mt-2 text-sm text-[#475569]">Đã kết nối cơ sở dữ liệu Supabase (dự phòng LocalStorage). Real-time Updates Bật.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Danh sách sản phẩm</p>
                <p className="mt-2 text-sm text-[#475569]">Danh sách sản phẩm hỗ trợ chỉnh sửa và xóa trực tiếp.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0d9488]">{products.length} items</span>
                <Button 
                  onClick={() => {
                    if(confirm('Hành động này sẽ tải lại toàn bộ 60 sản phẩm mẫu vào danh sách hiện tại của bạn. Bạn có chắc chắn không?')) {
                      setProducts(mockProducts);
                    }
                  }} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  Nạp dữ liệu mẫu
                </Button>
                <Button 
                  onClick={async () => {
                    if(confirm('Hành động này sẽ lưu toàn bộ danh sách sản phẩm hiện tại lên Supabase. Bạn có chắc chắn không?')) {
                      const { success } = await adminBulkUpsertProducts(products);
                      if(success) alert('Đồng bộ thành công!');
                      else alert('Đồng bộ thất bại, hãy kiểm tra kết nối Supabase.');
                    }
                  }} 
                  variant="default" 
                  size="sm" 
                  className="rounded-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Đồng bộ lên Supabase
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce6df] shadow-sm">
              <div className="max-h-[800px] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                <table className="w-full text-left text-sm text-[#475569]">
                  <thead className="sticky top-0 bg-[#0d9488] text-xs uppercase text-white shadow-sm">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-center w-16">STT</th>
                      <th className="px-4 py-3 font-semibold w-24 text-center">Hình ảnh</th>
                      <th className="px-4 py-3 font-semibold min-w-[200px]">Tên sản phẩm</th>
                      <th className="px-4 py-3 font-semibold">Danh mục</th>
                      <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                      <th className="px-4 py-3 font-semibold text-center w-40">Tác vụ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dce6df] bg-white">
                    {products.map((product, index) => (
                      <tr key={product.slug} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-center font-medium text-[#0f172a]">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="relative mx-auto h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="line-clamp-2 font-bold text-[#0f172a]" title={product.name}>{product.name}</p>
                          <p className="mt-0.5 text-xs text-[#5b8c7a]">{product.brand}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stockStatus === 'in_stock' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'}`}>
                            {product.stockStatus === 'in_stock' ? 'Còn hàng' : 'Hết/Sắp hết'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button onClick={() => setEditingSlug(product.slug)} size="sm" className="h-7 rounded bg-amber-500 text-white hover:bg-amber-600 px-2.5 text-xs">
                              <Pencil className="mr-1.5 h-3 w-3" /> Sửa
                            </Button>
                            <Button onClick={() => handleDelete(product.slug)} size="sm" className="h-7 rounded bg-red-500 text-white hover:bg-red-600 px-2.5 text-xs">
                              <Trash2 className="mr-1.5 h-3 w-3" /> Xóa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>          <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Biên tập sản phẩm</p>
                <p className="mt-2 text-sm text-[#475569]">Điền thông tin và lưu trực tiếp vào cơ sở dữ liệu.</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0d9488]">
                {editingSlug ? "Đang chỉnh sửa" : "Tạo mới"}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#0f172a]">
                  Tên sản phẩm *
                  <Input value={draft.name ?? ""} onChange={(event) => setField("name", event.target.value)} className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
                </label>
                <label className="block text-sm font-medium text-[#0f172a]">
                  Giá bán *
                  <Input type="number" value={draft.price ?? 0} onChange={(event) => setField("price", Number(event.target.value))} className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#0f172a]">
                  Danh mục
                  <select
                    value={draft.category ?? "supplement"}
                    onChange={(event) => setField("category", event.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-[#dce6df] bg-[#f6f4ee] px-4 py-3 text-sm text-[#0f172a] focus:ring-[#0d9488]"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-[#0f172a]">
                  Nhãn
                  <select
                    value={draft.badge ?? "New"}
                    onChange={(event) => setField("badge", event.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-[#dce6df] bg-[#f6f4ee] px-4 py-3 text-sm text-[#0f172a] focus:ring-[#0d9488]"
                  >
                    {badgeOptions.map((badge) => (
                      <option key={badge} value={badge}>{badge}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#0f172a]">
                  Hình ảnh (URL)
                  <Input value={draft.image ?? ""} onChange={(event) => setField("image", event.target.value)} placeholder="https://..." className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
                </label>
                <label className="block text-sm font-medium text-[#0f172a]">
                  Trạng thái tồn kho
                  <select
                    value={draft.stockStatus ?? "in_stock"}
                    onChange={(event) => setField("stockStatus", event.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-[#dce6df] bg-[#f6f4ee] px-4 py-3 text-sm text-[#0f172a] focus:ring-[#0d9488]"
                  >
                    <option value="in_stock">Còn hàng</option>
                    <option value="low_stock">Sắp hết</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium text-[#0f172a]">
                Mô tả ngắn *
                <Input value={draft.shortDescription ?? ""} onChange={(event) => setField("shortDescription", event.target.value)} className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
              </label>
              <label className="block text-sm font-medium text-[#0f172a]">
                Mô tả dài
                <textarea 
                  value={draft.longDescription ?? ""} 
                  onChange={(event) => setField("longDescription", event.target.value)}
                  className="mt-2 flex min-h-[80px] w-full rounded-2xl border border-[#dce6df] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#0f172a]">
                  Quy cách
                  <Input value={draft.packageSize ?? ""} onChange={(event) => setField("packageSize", event.target.value)} placeholder="Ví dụ: 30 viên" className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
                </label>
                <label className="block text-sm font-medium text-[#0f172a]">
                  Mối quan tâm (cách nhau bởi dấu phẩy)
                  <Input 
                    value={draft.concernTags?.join(", ") ?? ""} 
                    onChange={(event) => setField("concernTags", event.target.value.split(",").map(s => s.trim()).filter(Boolean))} 
                    placeholder="Mụn, Nám..." 
                    className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-[#0f172a]">
                Thành phần
                <textarea 
                  value={draft.ingredientsText ?? ""} 
                  onChange={(event) => setField("ingredientsText", event.target.value)}
                  className="mt-2 flex min-h-[80px] w-full rounded-2xl border border-[#dce6df] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]"
                />
              </label>
              <label className="block text-sm font-medium text-[#0f172a]">
                Hướng dẫn sử dụng
                <textarea 
                  value={draft.usageInstructions ?? ""} 
                  onChange={(event) => setField("usageInstructions", event.target.value)}
                  className="mt-2 flex min-h-[80px] w-full rounded-2xl border border-[#dce6df] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488]"
                />
              </label>
              <label className="block text-sm font-medium text-[#0f172a]">
                Cảnh báo
                <Input value={draft.warnings ?? ""} onChange={(event) => setField("warnings", event.target.value)} className="mt-2 border-[#dce6df] focus-visible:ring-[#0d9488]" />
              </label>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="rounded-2xl bg-[#0d9488] text-white hover:bg-[#0f766e]">Lưu sản phẩm</Button>
                <Button variant="outline" onClick={handleCancel} className="rounded-2xl border-[#dce6df] text-[#475569] hover:bg-[#f6f4ee]">Hủy</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0d9488]">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Cơ sở dữ liệu</p>
              <p className="mt-1 text-sm text-[#475569]">Đã cập nhật kết nối</p>
            </div>
          </div>
          <Separator className="my-6 bg-[#dce6df]" />
          <p className="text-sm leading-7 text-[#475569]">
            Trang quản trị sản phẩm hiện tại đã được cấu hình liên kết trực tiếp tới các API thao tác dữ liệu. Các thông tin sẽ được cập nhật thời gian thực vào giao diện người dùng.
          </p>
          {draft.image && (
             <div className="mt-6 rounded-2xl border border-[#dce6df] p-2 bg-[#f6f4ee]">
               <p className="text-xs font-semibold text-[#5b8c7a] mb-2 px-2">XEM TRƯỚC HÌNH ẢNH</p>
               <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white border border-[#dce6df]">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={draft.image} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
