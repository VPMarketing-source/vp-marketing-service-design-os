import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "brand" | "accent" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
        tone === "neutral" && "bg-[var(--soft-surface)] text-[var(--panel-text)]",
        tone === "brand" && "bg-[var(--primary-light)] text-[var(--primary-dark)]",
        tone === "accent" && "bg-[linear-gradient(135deg,rgba(102,126,234,0.16),rgba(118,75,162,0.18))] text-[#4c4189]",
        tone === "danger" && "bg-[rgba(220,38,38,0.1)] text-[var(--danger)]",
        className
      )}
      {...props}
    />
  );
}
