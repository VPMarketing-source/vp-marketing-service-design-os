import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 rounded-[32px] border border-[var(--line)] bg-[rgba(255,250,241,0.78)] p-6 shadow-[var(--shadow)] md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{eyebrow}</p> : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref}>
          <Button className="gap-2">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

