import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getData } from "@/lib/data-store";

export default async function SopsPage() {
  const data = await getData();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="SOP Library"
        title="Standard operating procedures"
        description="Operational playbooks that support service delivery, QA, and handoff consistency across the agency."
        actionHref="/manage"
        actionLabel="Edit SOPs"
      />

      <div className="space-y-5">
        {data.sops.map((sop) => {
          const deliverable = data.deliverables.find((item) => item.id === sop.relatedDeliverableId);
          const category = data.categories.find((item) => item.id === sop.categoryId);
          return (
            <Card id={sop.id} key={sop.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{sop.title}</CardTitle>
                    <Badge tone="brand">{category?.name ?? "Uncategorised"}</Badge>
                    <Badge tone="accent">{sop.ownerDepartment}</Badge>
                  </div>
                  <CardDescription className="mt-3 leading-6">{sop.purpose}</CardDescription>
                  <p className="mt-4 text-sm leading-6 text-[var(--foreground)]/85"><span className="font-semibold">When to use:</span> {sop.whenToUse}</p>
                </div>
                <div className="max-w-md rounded-[24px] border border-[var(--line)] bg-white/60 p-4 text-sm leading-6">
                  <p className="font-semibold">Linked deliverable</p>
                  <p className="mt-2">{deliverable?.title ?? "None"}</p>
                  <p className="mt-4 font-semibold">QA standard</p>
                  <p className="mt-2 text-[var(--muted)]">{sop.qaStandard}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-5 xl:grid-cols-3">
                <div className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Steps</p>
                  <ol className="mt-3 space-y-2 text-sm leading-6">
                    {sop.steps.map((step, index) => (
                      <li key={step}>{index + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Tools needed</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {sop.toolsNeeded.map((tool) => (
                      <li key={tool}>• {tool}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Common mistakes</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {sop.commonMistakes.map((mistake) => (
                      <li key={mistake}>• {mistake}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

