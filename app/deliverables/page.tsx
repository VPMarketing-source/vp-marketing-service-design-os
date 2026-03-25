import { DeliverableCard } from "@/components/app/deliverable-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";

export default async function DeliverablesPage() {
  const data = await getData();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Master Library"
        title="Deliverables"
        description="A single source of truth for what each deliverable means, what tiers include it, what it excludes, and what SOP and checklist support is attached."
        actionHref="/manage"
        actionLabel="Edit library"
      />

      <div className="space-y-6">
        {data.categories.map((category) => {
          const items = data.deliverables.filter((deliverable) => deliverable.categoryId === category.id);
          return (
            <Card key={category.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription className="mt-2 leading-6">{category.description}</CardDescription>
                </div>
                <Badge tone="brand">{items.length} deliverables</Badge>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                {items.map((item) => (
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}

