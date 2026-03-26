import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function DeliverableCard({
  href,
  title,
  description,
  tierCount
}: {
  href: string;
  title: string;
  description: string;
  promise: string;
  tierCount: number;
}) {
  return (
    <Link href={href}>
      <Card className="h-full bg-white transition duration-200 hover:-translate-y-1 hover:border-[var(--primary-blue)]/30 hover:shadow-[0_18px_36px_rgba(37,99,235,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base leading-6">{title}</CardTitle>
          <Badge tone="brand">{tierCount} tiers</Badge>
        </div>
        <CardDescription className="mt-3 leading-6">{description}</CardDescription>
        <p className="mt-4 text-sm font-semibold text-[var(--primary-blue)]">Open comparison</p>
      </Card>
    </Link>
  );
}
