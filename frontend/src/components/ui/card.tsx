"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          {
            "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl": variant === "glass",
            "bg-slate-900/50 border border-slate-700/50": variant === "default",
            "border border-white/10": variant === "bordered",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
export { Card };
