import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Boxes, ClipboardList, FileText, LayoutDashboard, Settings2 } from "lucide-react";
import { Inter, Poppins } from "next/font/google";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, poppins.variable)}>
        <div className="grain" />
        <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
          <header className="sticky top-4 z-20 mx-auto max-w-[1480px]">
            <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.88)] px-4 py-4 shadow-[var(--shadow)] backdrop-blur-xl md:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary-dark)]/70">VP Marketing</p>
                  <Link href="/" className="mt-2 block font-heading text-2xl font-bold tracking-[-0.04em] text-[var(--heading)]">
                    Service Design OS
                  </Link>
                  <p className="mt-2 text-sm leading-7 text-[var(--panel-text)]">
                    Package definitions, delivery standards, checklists, SOPs, and tier-specific scope in one place.
                  </p>
                </div>

                <div className="rounded-[20px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(102,126,234,0.14),rgba(118,75,162,0.18))] px-4 py-3 text-sm text-[var(--heading)] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-dark)]/75">Core Logic</p>
                  <p className="mt-2 max-w-md leading-6">
                    Package to category to deliverable to tier scope to internal tasks to SOPs to QA.
                  </p>
                </div>
              </div>

              <nav className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-2.5 text-sm font-medium text-[var(--panel-text)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-blue)]/35 hover:bg-white hover:text-[var(--heading)]"
                      )}
                      href={item.href}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-[1480px] py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
