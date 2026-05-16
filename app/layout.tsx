import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";
import { CompareProvider } from "@/components/compare/compare-context";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "AuraCare AI",
  description: "Prototype thương mại điện tử sức khỏe tích hợp AI cho AuraCare.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <ThemeProvider>
          <WishlistProvider>
            <CompareProvider>
              <CartProvider>{children}</CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
