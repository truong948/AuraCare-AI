"use client";

import { useEffect, useMemo, useState } from "react";
import { AiRecommendationShelf } from "@/components/storefront/ai-recommendation-shelf";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { getPersonalizedRecommendations } from "@/lib/ai/recommendations";
import {
  loadRecentlyViewedEntries,
  type RecentlyViewedEntry,
} from "@/lib/recently-viewed";
import type { RecommendationItem } from "@/lib/ai/types";

export function PersonalizedShelf() {
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedEntry[]>([]);

  useEffect(() => {
    setRecentlyViewed(loadRecentlyViewedEntries());
  }, []);

  const signals = {
    cart: cartItems.map((item) => ({
      productSlug: item.productSlug,
      quantity: item.quantity,
    })),
    wishlist: wishlistItems,
    recentlyViewed,
  };
  const analyticsContext = useMemo(() => {
    const cartWeight = cartItems.reduce(
      (sum, item) => sum + 3.8 + Math.min(item.quantity, 4) * 0.7,
      0
    );
    const wishlistWeight = wishlistItems.reduce(
      (sum, _item, index) => sum + 2.8 + Math.max(0, 0.9 - index * 0.15),
      0
    );
    const recentlyViewedWeight = recentlyViewed.reduce((sum, item, index) => {
      const recencyWeight = Math.max(0.75, 1.9 - index * 0.22);
      const repeatViewWeight = Math.min(item.viewCount, 4) * 0.32;
      return sum + recencyWeight + repeatViewWeight;
    }, 0);

    return {
      signalBreakdown: {
        cart: {
          count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          weight: Number(cartWeight.toFixed(3)),
        },
        wishlist: {
          count: wishlistItems.length,
          weight: Number(wishlistWeight.toFixed(3)),
        },
        recently_viewed: {
          count: recentlyViewed.reduce((sum, item) => sum + item.viewCount, 0),
          weight: Number(recentlyViewedWeight.toFixed(3)),
        },
      },
      signalSummary: [
        `${cartItems.length} sản phẩm trong giỏ`,
        `${wishlistItems.length} sản phẩm đã lưu`,
        `${recentlyViewed.length} sản phẩm vừa xem`,
      ],
    };
  }, [cartItems, recentlyViewed, wishlistItems]);
  const recommendations: RecommendationItem[] = getPersonalizedRecommendations(signals, 4);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <AiRecommendationShelf
      title="Dành cho bạn"
      description="Gợi ý dựa trên sản phẩm bạn đã xem, lưu hoặc thêm vào giỏ."
      items={recommendations}
      href="/ai-history"
      hrefLabel="Xem tín hiệu AI"
      surface="home-personalized"
      analyticsContext={analyticsContext}
    />
  );
}
