"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadWishlist, saveWishlist } from "@/lib/wishlist";

interface WishlistContextValue {
  items: string[];
  count: number;
  hasItem: (productSlug: string) => boolean;
  toggleItem: (productSlug: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setItems(loadWishlist());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveWishlist(items);
  }, [hasHydrated, items]);

  const count = useMemo(() => items.length, [items]);

  const hasItem = (productSlug: string) => items.includes(productSlug);

  const toggleItem = (productSlug: string) => {
    setItems((current) =>
      current.includes(productSlug)
        ? current.filter((item) => item !== productSlug)
        : [productSlug, ...current]
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count,
        hasItem,
        toggleItem,
        clearWishlist: () => setItems([]),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
