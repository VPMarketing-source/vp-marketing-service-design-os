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
        description="Each tier groups deliverables by category so the team can see what is actually included, how deep it goes, and what workflow supports it."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {data.packages.map((pkg) => {
          const deliverables = data.deliverables.filter((item) => item.includedTierIds.includes(pkg.id));
          const categories = data.categories.map((category) => ({
            ...category,
            count: deliverables.filter((item) => item.categoryId === category.id).length
          }));

          return (
            <Link key={pkg.id} href={`/packages/${pkg.id}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.95)]">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{pkg.name}</CardTitle>
                  <Badge tone="brand">{deliverables.length} deliverables</Badge>
                </div>
                <CardDescription className="mt-3 leading-6">{pkg.description}</CardDescription>
                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category.id} tone={category.count > 0 ? "accent" : "neutral"}>
                      {category.name}: {category.count}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

