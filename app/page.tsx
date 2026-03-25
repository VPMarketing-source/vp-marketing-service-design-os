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
    .slice(0, 5);

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Internal Operating System"
        title="A simpler view of service delivery"
        description="Start with the package, compare the scope by tier, then open the supporting SOPs and checklists only when you need them."
        actionHref="/deliverables/campaign-structure-ongoing-optimization"
        actionLabel="Compare one deliverable"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Packages" value={data.packages.length} hint="Three core tiers" />
        <StatCard label="Deliverables" value={data.deliverables.length} hint="Service definitions by category" />
        <StatCard label="Workflows" value={data.sops.length + data.checklistItems.length} hint="SOPs and checklist items combined" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Choose a tier</CardTitle>
              <CardDescription className="mt-2">Open a package first if you want the cleanest entry point.</CardDescription>
            </div>
            <Badge tone="brand">Best starting point</Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.packages.map((pkg) => {
              const deliverableCount = data.deliverables.filter((item) => item.includedTierIds.includes(pkg.id)).length;
              return (
                <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/70 p-5 transition hover:-translate-y-0.5 hover:bg-white">
                    <div className="h-2 w-16 rounded-full" style={{ backgroundColor: pkg.accent }} />
                    <h3 className="mt-4 text-lg font-semibold">{pkg.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{deliverableCount} mapped deliverables</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle>Recent updates</CardTitle>
          <CardDescription className="mt-2">Latest changes in the system.</CardDescription>
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
            <h2 className="text-2xl font-semibold">Start here</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">A few key deliverables to compare first.</p>
          </div>
          <Link className="text-sm font-semibold text-[var(--brand)]" href="/deliverables">
            Open full library
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.deliverables.slice(0, 3).map((item) => (
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
