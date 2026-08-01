"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { themeAtom, type Theme } from "./atom";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const resolved: Theme =
      theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.classList.toggle("dark", resolved === "dark");
    if (theme === null) setTheme(resolved);
  }, [theme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
