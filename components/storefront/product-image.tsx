import type { ReactNode } from "react";
import Image from "next/image";
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
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn("object-contain p-6 transition duration-500", imageClassName)}
      />
      {children}
    </div>
  );
}
