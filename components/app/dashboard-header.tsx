import Link from "next/link";
import { BookOpenText, Boxes, ClipboardList, FileText, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/packages", label: "Packages", icon: Boxes },
  { href: "/deliverables", label: "Deliverables", icon: BookOpenText },
  { href: "/checklists", label: "Checklists", icon: ClipboardList },
  { href: "/sops", label: "SOPs", icon: FileText }
];

export function DashboardHeader({
  title,
  subtitle,
  activeHref = "/",
  actions
}: {
  title: string;
  subtitle: string;
  activeHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold tracking-[-0.04em] text-[var(--heading)]">{title}</h1>
          <p className="mt-2 text-[13px] text-[var(--muted)]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.href === activeHref;
              return (
                <Link
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-[var(--line)] bg-white text-[var(--panel-text)] hover:border-slate-300 hover:bg-slate-50"
                  )}
                  href={tab.href}
                  key={tab.href}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          {actions}
        </div>
      </div>
    </header>
  );
}
