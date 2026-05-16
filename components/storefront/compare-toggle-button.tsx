"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from "@/components/compare/compare-context";

export function CompareToggleButton({
  productSlug,
  className,
}: {
  productSlug: string;
  className?: string;
}) {
  const { hasItem, toggleItem } = useCompare();
  const active = hasItem(productSlug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(productSlug);
      }}
      aria-label={active ? "Bỏ khỏi so sánh" : "Thêm vào so sánh"}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full border border-[#d7e5df] bg-white px-4 text-xs font-semibold text-[#475569] transition hover:border-[#5b8c7a] hover:text-[#5b8c7a]",
        active && "border-[#5b8c7a] bg-[#edf4f1] text-[#4f7c6d]",
        className
      )}
    >
      <Scale className="mr-2 h-4 w-4" />
      {active ? "Đã chọn" : "So sánh"}
    </button>
  );
}
