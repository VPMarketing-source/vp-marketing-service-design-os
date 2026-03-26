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
    <div className="mb-8 flex flex-col gap-6 overflow-hidden rounded-[28px] border border-[rgba(102,126,234,0.16)] bg-[var(--gradient-hero)] p-7 text-white shadow-[0_24px_60px_rgba(102,126,234,0.22)] md:flex-row md:items-end md:justify-between md:p-8">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">{eyebrow}</p> : null}
        <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight tracking-[-0.05em] text-white md:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-8 text-white/84">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref}>
          <Button className="gap-2 border border-white/18 bg-white text-[#493d82] shadow-[0_12px_30px_rgba(18,24,44,0.2)] hover:bg-[rgba(255,255,255,0.92)]">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
