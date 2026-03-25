import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Boxes, ClipboardList, FileText, LayoutDashboard, Settings2 } from "lucide-react";

import "./globals.css";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/packages", label: "Packages", icon: Boxes },
  { href: "/deliverables", label: "Deliverables", icon: BookOpenText },
  { href: "/checklists", label: "Checklists", icon: ClipboardList },
  { href: "/sops", label: "SOPs", icon: FileText },
  { href: "/manage", label: "Manage", icon: Settings2 }
];

export const metadata: Metadata = {
  title: "VP Marketing Service Design OS",
  description: "Internal operating system for package design, SOPs, checklists, and tier-specific delivery."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="grain" />
        <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[290px] shrink-0 rounded-[32px] border border-[var(--line)] bg-[rgba(20,26,25,0.92)] p-6 text-white shadow-[var(--shadow)] lg:flex lg:flex-col">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">VP Marketing</p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight">Service Design OS</h1>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Package definitions, delivery standards, checklists, SOPs, and tier-specific scope in one place.
              </p>
            </div>

            <nav className="mt-8 flex flex-1 flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/72 transition hover:bg-white/10 hover:text-white"
                    )}
                    href={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Core Logic</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Package to category to deliverable to tier scope to internal tasks to SOPs to QA.
              </p>
            </div>
          </aside>

          <main className="min-w-0 flex-1 py-2">{children}</main>
        </div>
      </body>
    </html>
  );
}

