"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";

export function AddToCartButton({ productSlug }: { productSlug: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(productSlug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Button onClick={handleClick} className="inline-flex items-center gap-2 rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]">
      <PlusCircle className="h-4 w-4" />
      {added ? "Đã thêm" : "Thêm vào giỏ"}
    </Button>
  );
}
