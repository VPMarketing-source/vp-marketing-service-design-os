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
        actionHref="/deliverables"
        actionLabel="Back to library"
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <Card className="bg-[rgba(20,26,25,0.92)] text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Overview</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">{deliverable.internalDefinition}</p>
        </Card>
        <Card className="bg-white/75">
          <CardTitle className="text-base">At a glance</CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3">
              <span>Included tiers</span>
              <span className="font-semibold">{tiers.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3">
              <span>Checklist items</span>
              <span className="font-semibold">{checklistItems.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3">
              <span>SOPs</span>
              <span className="font-semibold">{sops.length}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Tier comparison</CardTitle>
            <CardDescription className="mt-2">A lighter side-by-side view focused on the main differences.</CardDescription>
          </div>
          <Badge tone="brand">Hero view</Badge>
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
                output={detail.clientOutput}
                scope={detail.scope}
              />
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle>Supporting assets</CardTitle>
            <CardDescription className="mt-2">Open the detailed workflow only when you need it.</CardDescription>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] border border-[var(--line)] bg-white/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">Checklist items</p>
                  <Badge tone="brand">{checklistItems.length}</Badge>
                </div>
                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  {checklistItems.slice(0, 3).map((item) => (
                    <p key={item.id}>{item.title}</p>
                  ))}
                  {checklistItems.length === 0 ? <p>No linked checklist items.</p> : null}
                </div>
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-white/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">SOPs</p>
                  <Badge tone="accent">{sops.length}</Badge>
                </div>
                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  {sops.slice(0, 3).map((item) => (
                    <p key={item.id}>{item.title}</p>
                  ))}
                  {sops.length === 0 ? <p>No linked SOPs.</p> : null}
                </div>
              </div>
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

          <Card>
            <CardTitle>Exclusions</CardTitle>
            <CardDescription className="mt-2">Shared boundaries for this deliverable.</CardDescription>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {deliverable.exclusions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <CardTitle>Detailed operational notes</CardTitle>
          <CardDescription className="mt-2">Collapsed by default so the page stays easier to scan.</CardDescription>
          <div className="mt-5 space-y-4">
            {tiers.map((tier) => {
              const detail = deliverable.tierDetails.find((item) => item.tierId === tier.id);
              if (!detail) return null;

              return (
                <details key={tier.id} className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4">
                  <summary className="cursor-pointer list-none font-semibold">{tier.name}</summary>
                  <div className="mt-4 grid gap-5 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Internal tasks</p>
                      <ul className="mt-2 space-y-2 leading-6 text-[var(--foreground)]/85">
                        {detail.internalTasks.map((task) => (
                          <li key={task}>- {task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">QA checklist</p>
                      <ul className="mt-2 space-y-2 leading-6 text-[var(--foreground)]/85">
                        {detail.qaChecklist.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Inputs</p>
                      <ul className="mt-2 space-y-2 leading-6 text-[var(--foreground)]/85">
                        {detail.inputs.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Tools</p>
                      <ul className="mt-2 space-y-2 leading-6 text-[var(--foreground)]/85">
                        {detail.tools.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Success metric</p>
                      <p className="mt-2 leading-6 text-[var(--foreground)]/85">{detail.successMetric}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Notes</p>
                      <p className="mt-2 leading-6 text-[var(--foreground)]/85">{detail.notes || "No notes added."}</p>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
