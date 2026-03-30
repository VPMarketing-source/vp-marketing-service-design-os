import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--soft-surface-deep)]", trackClassName)}>
        <div
          className={cn("h-full rounded-full bg-[var(--primary-blue)] transition-[width] duration-300", barClassName)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

