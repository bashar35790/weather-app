import { cn } from "@/utils/cn";
import React from "react";

const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden w-full flex py-4 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/60 ring-1 ring-inset ring-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.15)] before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-white/60 before:via-transparent before:to-white/10 dark:bg-slate-900/40 dark:border-white/10 dark:ring-white/10 dark:before:from-white/10",
        props.className
      )}
    />
  );
};

export default Container;
