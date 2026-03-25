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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "neutral" && "bg-black/5 text-[var(--foreground)]",
        tone === "brand" && "bg-[rgba(31,107,92,0.12)] text-[var(--brand-strong)]",
        tone === "accent" && "bg-[rgba(215,168,110,0.18)] text-[#8f5b1d]",
        tone === "danger" && "bg-[rgba(139,58,43,0.12)] text-[var(--danger)]",
        className
      )}
      {...props}
    />
  );
}

