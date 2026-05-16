"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/recently-viewed";

export function RecentlyViewedTracker({ productSlug }: { productSlug: string }) {
  useEffect(() => {
    pushRecentlyViewed(productSlug);
  }, [productSlug]);

  return null;
}
