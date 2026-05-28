import { mockProducts, type MockProduct, type ProductCategory, searchMockProducts } from "@/lib/mock-data/catalog";
import { createClient } from "@/utils/supabase/client";
import { getLocalFeedbacks, addLocalFeedback, deleteLocalFeedback, type ProductFeedback } from "@/lib/mock-data/feedbacks";
import { getLocalConsultations, type MockConsultation } from "@/lib/mock-data/consultations";

async function getSupabaseClient(): Promise<any> {
  return createClient();
}

function mapDbProductToMock(dbProduct: any): MockProduct {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    brand: dbProduct.brand || "AuraCare Lab",
    category: dbProduct.category as ProductCategory,
    shortDescription: dbProduct.short_description || "",
    longDescription: dbProduct.long_description || "",
    price: dbProduct.price || 0,
    compareAtPrice: dbProduct.compare_at_price || 0,
    stockStatus: (dbProduct.stock_status === "out_of_stock" ? "low_stock" : dbProduct.stock_status) as "in_stock" | "low_stock",
    packageSize: dbProduct.package_size || "",
    ingredientsText: dbProduct.ingredients_text || "",
    usageInstructions: dbProduct.usage_instructions || "",
    warnings: dbProduct.warnings || "",
    concernTags: dbProduct.concern_tags || [],
    symptomTags: dbProduct.symptom_tags || [],
    benefitTags: dbProduct.benefit_tags || [],
    searchableText: dbProduct.searchable_text || "",
    rating: Number(dbProduct.rating || 4.5),
    reviewCount: dbProduct.review_count || 0,
    originCountry: dbProduct.origin_country || "Vietnam",
    badge: (dbProduct.badge || "AI pick") as any,
    image: dbProduct.image || "",
    embeddingVector: null,
  };
}

export async function getProducts(): Promise<MockProduct[]> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapDbProductToMock);
    }
  } catch (err) {
    console.warn("Failed to fetch products from Supabase, falling back to mock catalog:", err);
  }
  return mockProducts;
}

export async function getProductBySlug(slug: string): Promise<MockProduct | undefined> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return mapDbProductToMock(data);
    }
  } catch (err) {
    console.warn(`Failed to fetch product ${slug} from Supabase, falling back to mock catalog:`, err);
  }
  return mockProducts.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: ProductCategory): Promise<MockProduct[]> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapDbProductToMock);
    }
  } catch (err) {
    console.warn(`Failed to fetch products for category ${category} from Supabase, falling back to mock:`, err);
  }
  return mockProducts.filter((p) => p.category === category);
}

export async function searchProducts(query: string, category?: ProductCategory): Promise<MockProduct[]> {
  try {
    const supabase = await getSupabaseClient();
    const normalizedQuery = query.trim();
    
    if (normalizedQuery) {
      const { data, error } = await supabase.rpc("match_products_by_symptoms", {
        symptom_keywords: normalizedQuery,
        match_limit: 12
      } as any);

      if (!error && data && data.length > 0) {
        const slugs = data.map((d: any) => d.slug);
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("slug", slugs);

        if (!productsError && productsData) {
          const mapped: MockProduct[] = productsData.map(mapDbProductToMock);
          return slugs
            .map((slug: string) => mapped.find((p: MockProduct) => p.slug === slug))
            .filter((p: MockProduct | undefined): p is MockProduct => p !== undefined);
        }
      }
    }
  } catch (err) {
    console.warn("RPC product search failed, falling back to mock search:", err);
  }
  return searchMockProducts(query, category);
}

export async function adminUpsertProduct(product: Partial<MockProduct>): Promise<{ success: boolean; data?: MockProduct; error?: any }> {
  try {
    const supabase = await getSupabaseClient();
    const row = {
      slug: product.slug,
      name: product.name,
      brand: product.brand || "AuraCare Lab",
      category: product.category,
      short_description: product.shortDescription,
      long_description: product.longDescription,
      price: product.price,
      compare_at_price: product.compareAtPrice || 0,
      stock_status: product.stockStatus || "in_stock",
      package_size: product.packageSize,
      ingredients_text: product.ingredientsText,
      usage_instructions: product.usageInstructions,
      warnings: product.warnings,
      concern_tags: product.concernTags || [],
      symptom_tags: product.symptomTags || [],
      benefit_tags: product.benefitTags || [],
      searchable_text: product.searchableText || "",
      rating: product.rating || 4.5,
      review_count: product.reviewCount || 0,
      origin_country: product.originCountry || "Vietnam",
      badge: product.badge,
      image: product.image,
    };

    const { data, error } = await supabase
      .from("products")
      .upsert(row, { onConflict: "slug" })
      .select("*")
      .single();

    if (error) throw error;
    return { success: true, data: mapDbProductToMock(data) };
  } catch (err: any) {
    console.error("Admin upsert product to Supabase failed:", err);
    return { success: false, error: err };
  }
}

export async function adminDeleteProduct(slug: string): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("slug", slug);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error(`Admin delete product ${slug} from Supabase failed:`, err);
    return { success: false, error: err };
  }
}

export async function getProductFeedbacks(productId?: string): Promise<ProductFeedback[]> {
  try {
    const supabase = await getSupabaseClient();
    let query = supabase.from("product_feedbacks").select(`
      id,
      product_id,
      user_id,
      rating,
      comment,
      created_at,
      profiles (
        full_name,
        email
      ),
      products (
        name,
        slug
      )
    `);
    
    if (productId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
      if (isUuid) {
        query = query.eq("product_id", productId);
      } else {
        const product = await getProductBySlug(productId);
        if (product) {
          query = query.eq("product_id", product.id);
        }
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        productId: d.product_id,
        productSlug: d.products?.slug || "",
        productName: d.products?.name || "",
        userId: d.user_id,
        userName: d.profiles?.full_name || d.profiles?.email || "Khách hàng AuraCare",
        rating: d.rating,
        comment: d.comment,
        createdAt: d.created_at
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch feedbacks from Supabase, falling back to mock feedbacks:", err);
  }
  return getLocalFeedbacks(productId);
}

export async function submitProductFeedback(productId: string, rating: number, comment: string): Promise<{ success: boolean; data?: ProductFeedback; error?: any }> {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Bạn cần đăng nhập để gửi đánh giá." };
    }

    let resolvedProductId = productId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    let resolvedProductSlug = productId;
    let resolvedProductName = "";

    const product = isUuid ? await getProductBySlug(productId) : await getProductBySlug(productId);
    if (product) {
      resolvedProductId = product.id;
      resolvedProductSlug = product.slug;
      resolvedProductName = product.name;
    }

    const { data, error } = await supabase
      .from("product_feedbacks")
      .insert({
        product_id: resolvedProductId,
        user_id: user.id,
        rating,
        comment
      })
      .select(`
        id,
        product_id,
        user_id,
        rating,
        comment,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        id: data.id,
        productId: data.product_id,
        productSlug: resolvedProductSlug,
        productName: resolvedProductName,
        userId: data.user_id,
        userName: data.profiles?.full_name || data.profiles?.email || "Khách hàng AuraCare",
        rating: data.rating,
        comment: data.comment,
        createdAt: data.created_at
      }
    };
  } catch (err: any) {
    console.warn("Failed to submit feedback to Supabase, saving to local fallback:", err);
    const product = await getProductBySlug(productId);
    const newFb = addLocalFeedback({
      productId: product?.id || productId,
      productSlug: product?.slug || productId,
      productName: product?.name || "Sản phẩm",
      userId: "local-user",
      userName: "Khách hàng (Offline)",
      rating,
      comment
    });
    return { success: true, data: newFb };
  }
}

export async function adminDeleteProductFeedback(feedbackId: string): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("product_feedbacks")
      .delete()
      .eq("id", feedbackId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.warn(`Failed to delete feedback ${feedbackId} from Supabase, applying local fallback:`, err);
    const deleted = deleteLocalFeedback(feedbackId);
    return { success: deleted };
  }
}

export async function loadAllConsultations(): Promise<MockConsultation[]> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("consultations")
      .select(`
        id,
        user_id,
        skin_concern,
        description,
        ai_summary,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        userEmail: d.profiles?.email || "anonymous@example.com",
        userFullName: d.profiles?.full_name || "Khách hàng ẩn danh",
        skinConcern: d.skin_concern,
        description: d.description,
        aiSummary: typeof d.ai_summary === "string" ? JSON.parse(d.ai_summary) : d.ai_summary || {},
        createdAt: d.created_at
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch consultations from Supabase, falling back to mock:", err);
  }
  return getLocalConsultations();
}
