import { cn } from "@/utils/cn";
import React from "react";

const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full backdrop-blur-md bg-white/40 border border-white/20 shadow-sm rounded-xl flex py-4",
        props.className
      )}
    />
  );
};

export default Container;
