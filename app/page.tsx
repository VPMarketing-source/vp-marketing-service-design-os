import Link from "next/link";

import { DeliverableCard } from "@/components/app/deliverable-card";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const data = await getData();
  const recentItems = [
    ...data.deliverables.map((item) => ({ type: "Deliverable", id: item.id, title: item.title, updatedAt: item.updatedAt, href: `/deliverables/${item.id}` })),
    ...data.sops.map((item) => ({ type: "SOP", id: item.id, title: item.title, updatedAt: item.updatedAt, href: `/sops#${item.id}` })),
    ...data.checklistItems.map((item) => ({ type: "Checklist", id: item.id, title: item.title, updatedAt: item.updatedAt, href: `/checklists#${item.id}` }))
  ]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Internal Operating System"
        title="Agency service delivery, defined by package"
        description="Design and manage what each tier actually includes, how it is delivered, who owns it, what QA looks like, and which SOPs and checklists support it."
        actionHref="/deliverables/campaign-structure-ongoing-optimization"
        actionLabel="Open hero comparison"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Packages" value={data.packages.length} hint="Foundation, Profit Optimization, Revenue Engine" />
        <StatCard label="Deliverables" value={data.deliverables.length} hint="Library of service definitions and scope boundaries" />
        <StatCard label="SOPs" value={data.sops.length} hint="Operational standards linked back to delivery" />
        <StatCard label="Checklist Items" value={data.checklistItems.length} hint="Recurring and one-time execution tasks" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Package tiers</CardTitle>
            <Badge tone="brand">Core structure</Badge>
          </div>
          <CardDescription className="mt-2">Jump into each tier and inspect deliverables by category.</CardDescription>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.packages.map((pkg) => {
              const deliverableCount = data.deliverables.filter((item) => item.includedTierIds.includes(pkg.id)).length;
              return (
                <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/70 p-5 transition hover:-translate-y-0.5">
                    <div className="h-2 w-20 rounded-full" style={{ backgroundColor: pkg.accent }} />
                    <h3 className="mt-4 text-lg font-semibold">{pkg.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pkg.description}</p>
                    <p className="mt-4 text-sm font-medium">{deliverableCount} deliverables mapped</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle>Recently edited</CardTitle>
          <CardDescription className="mt-2">The latest records changed in local storage.</CardDescription>
          <div className="mt-5 space-y-3">
            {recentItems.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={item.href}>
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-3 transition hover:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.type}</p>
                    </div>
                    <p className="text-xs text-[var(--muted)]">{formatDate(item.updatedAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Key deliverables</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Start with the master library and compare how scope changes across tiers.</p>
          </div>
          <Link className="text-sm font-semibold text-[var(--brand)]" href="/deliverables">
            View full library
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.deliverables.slice(0, 6).map((item) => (
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
      </div>
    </div>
  );
}

