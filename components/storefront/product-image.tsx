import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { MockProduct } from "@/lib/mock-data/catalog";

export function ProductImage({
  product,
  className,
  imageClassName,
  children,
}: {
  product: Pick<MockProduct, "image" | "name">;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden bg-white",
        className
      )}
    >
      <img
        src={product.image}
        alt={product.name}
        decoding="async"
        className={cn("h-full w-full object-contain p-6 transition duration-500", imageClassName)}
      />
      {children}
    </div>
  );
}
