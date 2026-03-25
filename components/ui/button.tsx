import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--brand)] text-white shadow-[0_10px_30px_rgba(18,79,68,0.25)] hover:bg-[var(--brand-strong)] focus:ring-[var(--brand)]",
        variant === "secondary" &&
          "border border-[var(--line)] bg-white/70 text-[var(--foreground)] hover:bg-white focus:ring-[var(--accent)]",
        variant === "ghost" &&
          "text-[var(--muted)] hover:bg-white/60 hover:text-[var(--foreground)] focus:ring-[var(--accent)]",
        variant === "danger" &&
          "bg-[var(--danger)] text-white hover:opacity-90 focus:ring-[var(--danger)]",
        className
      )}
      type={type}
      {...props}
    />
  );
}

