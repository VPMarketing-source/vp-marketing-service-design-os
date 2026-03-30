import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardPanel({
  title,
  subtitle,
  actions,
  className,
  children
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-[var(--line)] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]", className)}>
      {title || subtitle || actions ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
            {subtitle ? <CardDescription className="mt-2">{subtitle}</CardDescription> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {children ? <div className={cn(title || subtitle || actions ? "mt-4" : "")}>{children}</div> : null}
    </section>
  );
}
