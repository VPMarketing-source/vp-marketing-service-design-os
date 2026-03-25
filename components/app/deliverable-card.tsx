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
      <Card className="h-full transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.95)]">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base leading-6">{title}</CardTitle>
          <Badge tone="brand">{tierCount} tiers</Badge>
        </div>
        <CardDescription className="mt-3 leading-6">{description}</CardDescription>
        <p className="mt-4 text-sm font-semibold text-[var(--brand)]">Open comparison</p>
      </Card>
    </Link>
  );
}
