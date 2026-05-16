"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadCompare, saveCompare } from "@/lib/compare";

interface CompareContextValue {
  items: string[];
  count: number;
  hasItem: (productSlug: string) => boolean;
  toggleItem: (productSlug: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCompare());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveCompare(items);
  }, [hasHydrated, items]);

  const count = useMemo(() => items.length, [items]);
  const hasItem = (productSlug: string) => items.includes(productSlug);

  const toggleItem = (productSlug: string) => {
    setItems((current) => {
      if (current.includes(productSlug)) {
        return current.filter((item) => item !== productSlug);
      }

      if (current.length >= 4) {
        return [...current.slice(1), productSlug];
      }

      return [...current, productSlug];
    });
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        count,
        hasItem,
        toggleItem,
        clearCompare: () => setItems([]),
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }

  return context;
}
