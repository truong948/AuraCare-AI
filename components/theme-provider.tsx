"use client";

import { type PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </NextThemesProvider>
  );
}
