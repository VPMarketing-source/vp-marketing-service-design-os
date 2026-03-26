import * as React from "react";

import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition duration-200 focus:border-[var(--primary-blue)] focus:bg-white focus:ring-4 focus:ring-[rgba(37,99,235,0.15)]",
        className
      )}
      {...props}
    />
  );
}
