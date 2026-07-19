"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn("animate-spin rounded-full border-2 border-primary-500 border-t-transparent", {
          "h-4 w-4": size === "sm",
          "h-8 w-8": size === "md",
          "h-12 w-12": size === "lg",
        })}
      />
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" />
    </div>
  );
}

interface AgentProgressProps {
  steps: string[];
  currentStep: number;
}

export function AgentProgress({ steps, currentStep }: AgentProgressProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
            i < currentStep ? "bg-emerald-500 text-white" : i === currentStep ? "bg-primary-500 text-white animate-pulse" : "bg-slate-700 text-slate-400"
          )}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          <span className={cn("text-sm", i <= currentStep ? "text-white" : "text-slate-500")}>{step}</span>
        </div>
      ))}
    </div>
  );
}
