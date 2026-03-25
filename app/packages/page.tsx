import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";

export default async function PackagesPage() {
  const data = await getData();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Package Design"
        title="Packages and tiers"
        description="Each package view stays focused on what is included. Open a tier to inspect the actual deliverables behind it."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {data.packages.map((pkg) => {
          const deliverables = data.deliverables.filter((item) => item.includedTierIds.includes(pkg.id));
          const activeCategories = data.categories
            .map((category) => ({
              ...category,
              count: deliverables.filter((item) => item.categoryId === category.id).length
            }))
            .filter((category) => category.count > 0);

          return (
            <Link key={pkg.id} href={`/packages/${pkg.id}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.95)]">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{pkg.name}</CardTitle>
                  <Badge tone="brand">{deliverables.length}</Badge>
                </div>
                <CardDescription className="mt-3 leading-6">{pkg.description}</CardDescription>
                <div className="mt-5 space-y-2">
                  {activeCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-2xl bg-white/60 px-3 py-2 text-sm">
                      <span>{category.name}</span>
                      <span className="text-[var(--muted)]">{category.count}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-[var(--brand)]">Open tier view</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
