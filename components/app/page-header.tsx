import Link from "next/link";

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
    <div className="mb-5 flex flex-col gap-3 rounded-[16px] border border-[var(--line)] bg-white px-4 py-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{eyebrow}</p> : null}
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-[-0.04em] text-[var(--heading)] md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref}>
          <Button variant="secondary">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}
