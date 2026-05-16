"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/components/wishlist/wishlist-context";

export function WishlistToggleButton({
  productSlug,
  className,
}: {
  productSlug: string;
  className?: string;
}) {
  const { hasItem, toggleItem } = useWishlist();
  const active = hasItem(productSlug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(productSlug);
      }}
      aria-label={active ? "Bỏ khỏi wishlist" : "Thêm vào wishlist"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.92)] text-[#64748b] shadow-sm transition hover:text-[#5b8c7a]",
        active && "bg-[#fff2f2] text-[#dc2626]",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
