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
        "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--primary-blue)] text-white shadow-[var(--shadow-strong)] hover:bg-[var(--primary-dark)] focus:ring-[var(--primary-blue)]",
        variant === "secondary" &&
          "border border-[var(--line)] bg-white text-[var(--heading)] shadow-[var(--shadow)] hover:-translate-y-0.5 hover:border-[var(--primary-blue)]/35 hover:bg-[var(--soft-surface)] focus:ring-[var(--primary-blue)]",
        variant === "ghost" &&
          "text-[var(--panel-text)] hover:bg-[var(--soft-surface)] hover:text-[var(--heading)] focus:ring-[var(--primary-blue)]",
        variant === "danger" &&
          "bg-[var(--danger)] text-white hover:opacity-90 focus:ring-[var(--danger)]",
        className
      )}
      type={type}
      {...props}
    />
  );
}
