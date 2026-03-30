import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "VP Marketing Service Design OS",
  description: "Internal operating system for package design, SOPs, checklists, and tier-specific delivery."
};

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, poppins.variable)}>
        <div className="grain" />
        <div className="flex min-h-screen w-full">
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
