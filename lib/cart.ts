import { MockProduct } from "@/lib/mock-data/catalog";

export interface CartItem {
  productSlug: string;
  quantity: number;
}

export const CART_STORAGE_KEY = "auracare_cart";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item.productSlug === "string" && typeof item.quantity === "number")
      : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function findCartItem(items: CartItem[], slug: string) {
  return items.find((item) => item.productSlug === slug);
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[], products: MockProduct[]) {
  return items.reduce((total, item) => {
    const product = products.find((product) => product.slug === item.productSlug);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

export function normalizeCartItems(items: CartItem[]) {
  return items
    .map((item) => ({
      productSlug: item.productSlug,
      quantity: Math.max(1, Math.round(item.quantity)),
    }))
    .filter((item) => item.productSlug && item.quantity > 0);
}
