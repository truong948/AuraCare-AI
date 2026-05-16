"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadCart, saveCart, type CartItem, getCartItemCount, getCartSubtotal, normalizeCartItems } from "@/lib/cart";
import { mockProducts } from "@/lib/mock-data/catalog";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (productSlug: string, quantity?: number) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  removeItem: (productSlug: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setItems(normalizeCartItems(loadCart()));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveCart(items);
  }, [hasHydrated, items]);

  const count = useMemo(() => getCartItemCount(items), [items]);
  const subtotal = useMemo(() => getCartSubtotal(items, mockProducts), [items]);

  const addItem = (productSlug: string, quantity = 1) => {
    setItems((current) => {
      const normalized = normalizeCartItems(current);
      const existing = normalized.find((item) => item.productSlug === productSlug);
      if (existing) {
        return normalizeCartItems(
          normalized.map((item) =>
            item.productSlug === productSlug
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      }

      return normalizeCartItems([...normalized, { productSlug, quantity }]);
    });
  };

  const updateQuantity = (productSlug: string, quantity: number) => {
    setItems((current) =>
      normalizeCartItems(
        current.map((item) =>
          item.productSlug === productSlug ? { ...item, quantity } : item
        )
      )
    );
  };

  const removeItem = (productSlug: string) => {
    setItems((current) => current.filter((item) => item.productSlug !== productSlug));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
