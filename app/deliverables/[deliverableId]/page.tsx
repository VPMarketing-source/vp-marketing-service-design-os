import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { TierComparisonCard } from "@/components/app/tier-comparison-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";

export default async function DeliverableDetailPage({
  params
}: {
  params: Promise<{ deliverableId: string }>;
}) {
  const { deliverableId } = await params;
  const data = await getData();
  const deliverable = data.deliverables.find((item) => item.id === deliverableId);

  if (!deliverable) {
    notFound();
  }

  const category = data.categories.find((item) => item.id === deliverable.categoryId);
  const tiers = data.packages.filter((pkg) => deliverable.includedTierIds.includes(pkg.id));
  const checklistItems = data.checklistItems.filter((item) => item.deliverableId === deliverable.id);
  const sops = data.sops.filter((item) => item.relatedDeliverableId === deliverable.id);

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow={category?.name ?? "Deliverable"}
        title={deliverable.title}
        description={deliverable.clientPromise}
        actionHref="/manage"
        actionLabel="Edit deliverable"
      />

      <Card className="mb-6 bg-[rgba(20,26,25,0.92)] text-white">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Internal definition</p>
            <p className="mt-3 text-sm leading-7 text-white/80">{deliverable.internalDefinition}</p>
          </div>
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Included tiers</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tiers.map((tier) => (
                <Badge key={tier.id} tone="accent" className="bg-white/10 text-white">
                  {tier.name}
                </Badge>
              ))}
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/50">Exclusions</p>
            <ul className="mt-3 space-y-2 text-sm text-white/78">
              {deliverable.exclusions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Tier comparison</CardTitle>
            <CardDescription className="mt-2">The hero view for comparing how this deliverable changes by package.</CardDescription>
          </div>
          <Badge tone="brand">Side by side</Badge>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {tiers.map((tier) => {
            const detail = deliverable.tierDetails.find((item) => item.tierId === tier.id);
            if (!detail) {
              return (
                <Card key={tier.id} className="bg-white/60">
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription className="mt-3">No tier-specific breakdown added yet.</CardDescription>
                </Card>
              );
            }

            return (
              <TierComparisonCard
                key={tier.id}
                title={tier.name}
                accent={tier.accent}
                meaning={detail.meaning}
                cadence={detail.cadence}
                owner={detail.owner}
                metric={detail.successMetric}
                scope={detail.scope}
                qa={detail.qaChecklist}
              />
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Internal tasks</CardTitle>
          <CardDescription className="mt-2">Cross-tier execution notes grouped by package.</CardDescription>
          <div className="mt-5 space-y-5">
            {tiers.map((tier) => {
              const detail = deliverable.tierDetails.find((item) => item.tierId === tier.id);
              return (
                <div key={tier.id} className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{tier.name}</h3>
                    <Badge tone="accent">{detail?.tools.length ?? 0} tools</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground)]/85">
                    {(detail?.internalTasks ?? []).map((task) => (
                      <li key={task}>• {task}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Inputs</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/85">{(detail?.inputs ?? []).join(", ") || "No inputs added."}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Client-visible output</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/85">{detail?.clientOutput ?? "No output defined."}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Not included</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {(detail?.notIncluded ?? []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardTitle>Checklist items</CardTitle>
            <CardDescription className="mt-2">Execution tasks linked to this deliverable.</CardDescription>
            <div className="mt-4 space-y-3">
              {checklistItems.length > 0 ? (
                checklistItems.map((item) => {
                  const tier = data.packages.find((pkg) => pkg.id === item.packageId);
                  return (
                    <div key={item.id} className="rounded-[22px] border border-[var(--line)] bg-white/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{item.title}</p>
                        <Badge tone={item.qaRequired ? "brand" : "neutral"}>{item.cadence}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{tier?.name} • {item.owner}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[var(--muted)]">No checklist items linked yet.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>SOPs</CardTitle>
            <CardDescription className="mt-2">Operational playbooks attached to this deliverable.</CardDescription>
            <div className="mt-4 space-y-3">
              {sops.length > 0 ? (
                sops.map((sop) => (
                  <div key={sop.id} className="rounded-[22px] border border-[var(--line)] bg-white/60 p-4">
                    <p className="font-semibold">{sop.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{sop.purpose}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{sop.ownerDepartment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No SOPs linked yet.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>Notes and caveats</CardTitle>
            <CardDescription className="mt-2">Quick tier-level notes.</CardDescription>
            <div className="mt-4 space-y-3">
              {tiers.map((tier) => {
                const detail = deliverable.tierDetails.find((item) => item.tierId === tier.id);
                return (
                  <div key={tier.id} className="rounded-[22px] border border-[var(--line)] bg-white/60 p-4">
                    <p className="font-semibold">{tier.name}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{detail?.notes ?? "No notes added."}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link className="font-semibold text-[var(--brand)]" href="/checklists">
                View all checklists
              </Link>
              <Link className="font-semibold text-[var(--brand)]" href="/sops">
                View all SOPs
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

