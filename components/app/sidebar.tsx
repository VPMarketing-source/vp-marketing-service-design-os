"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type WorkflowSidebarPackage = {
  id: string;
  label: string;
  href: string;
  active?: boolean;
};

export type WorkflowSidebarSection = {
  id: string;
  label: string;
  progress: number;
};

export function WorkflowSidebar({
  packages,
  sections,
  activeSectionId
}: {
  packages: WorkflowSidebarPackage[];
  sections: WorkflowSidebarSection[];
  activeSectionId?: string;
}) {
  return (
    <div className="rounded-[18px] bg-[var(--heading)] px-3 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
      <div className="border-b border-white/10 px-3 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Service Offerings</p>
        <div className="mt-3 space-y-1.5">
          {packages.map((item) => (
            <Link
              key={item.id}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm transition",
                item.active
                  ? "bg-white/10 font-semibold text-white"
                  : "text-white/65 hover:bg-white/6 hover:text-white"
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Sections</p>
        <nav className="mt-3 space-y-1.5">
          {sections.map((item) => (
            <a
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                activeSectionId === item.id
                  ? "bg-white/10 font-semibold text-white"
                  : "text-white/65 hover:bg-white/6 hover:text-white"
              )}
              href={`#section-${item.id}`}
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-white/45">{item.progress}%</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
