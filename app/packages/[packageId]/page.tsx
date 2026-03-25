import Link from "next/link";
import { notFound } from "next/navigation";

import { DeliverableCard } from "@/components/app/deliverable-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";

export default async function PackageDetailPage({
  params
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;
  const data = await getData();
  const pkg = data.packages.find((item) => item.id === packageId);

  if (!pkg) {
    notFound();
  }

  const deliverables = data.deliverables.filter((item) => item.includedTierIds.includes(pkg.id));

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Tier view"
        title={pkg.name}
        description={pkg.description}
        actionHref="/deliverables"
        actionLabel="Open library"
      />

      <div className="space-y-6">
        {data.categories.map((category) => {
          const categoryDeliverables = deliverables.filter((item) => item.categoryId === category.id);

          return (
            <Card key={category.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription className="mt-2 max-w-3xl leading-6">{category.description}</CardDescription>
                </div>
                <Badge tone="brand">{categoryDeliverables.length} mapped</Badge>
              </div>
              {categoryDeliverables.length > 0 ? (
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {categoryDeliverables.map((item) => (
                    <DeliverableCard
                      key={item.id}
                      href={`/deliverables/${item.id}`}
                      title={item.title}
                      description={item.shortDescription}
                      promise={item.clientPromise}
                      tierCount={item.includedTierIds.length}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[24px] border border-dashed border-[var(--line)] bg-white/50 p-5 text-sm text-[var(--muted)]">
                  No deliverables mapped to this tier and category yet.
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 rounded-[28px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-6">
        <h2 className="text-xl font-semibold">Delivery chain for this package</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {pkg.name} is built from package scope, category design, deliverable definitions, tier-specific rules, internal task ownership, SOP support, and QA checkpoints.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link className="font-semibold text-[var(--brand)]" href="/checklists">
            View checklists
          </Link>
          <Link className="font-semibold text-[var(--brand)]" href="/sops">
            View SOPs
          </Link>
          <Link className="font-semibold text-[var(--brand)]" href="/manage">
            Edit records
          </Link>
        </div>
      </div>
    </div>
  );
}

