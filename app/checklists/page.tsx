import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getData } from "@/lib/data-store";

export default async function ChecklistsPage() {
  const data = await getData();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Execution System"
        title="Checklist items"
        description="This is the operational task layer attached to deliverables and tiers. Use the management page to add and edit items locally."
        actionHref="/manage"
        actionLabel="Edit checklists"
      />

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Card className="bg-white/65"><CardTitle>{data.checklistItems.length}</CardTitle><CardDescription>Total items</CardDescription></Card>
        <Card className="bg-white/65"><CardTitle>{new Set(data.checklistItems.map((item) => item.owner)).size}</CardTitle><CardDescription>Owners</CardDescription></Card>
        <Card className="bg-white/65"><CardTitle>{data.checklistItems.filter((item) => item.qaRequired).length}</CardTitle><CardDescription>QA required</CardDescription></Card>
        <Card className="bg-white/65"><CardTitle>{data.checklistItems.filter((item) => item.status === "active").length}</CardTitle><CardDescription>Active</CardDescription></Card>
        <Card className="bg-white/65"><CardTitle>{data.checklistItems.filter((item) => item.status === "planned").length}</CardTitle><CardDescription>Planned</CardDescription></Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Checklist table</CardTitle>
            <CardDescription className="mt-2">Filter-ready structure by package, category, owner, cadence, and linked deliverable.</CardDescription>
          </div>
          <Badge tone="brand">Desktop-first view</Badge>
        </div>
        <div className="mt-5 overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>Task</Th>
                <Th>Package</Th>
                <Th>Deliverable</Th>
                <Th>Owner</Th>
                <Th>Cadence</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>QA</Th>
              </tr>
            </thead>
            <tbody>
              {data.checklistItems.map((item) => {
                const pkg = data.packages.find((pkgItem) => pkgItem.id === item.packageId);
                const deliverable = data.deliverables.find((deliverableItem) => deliverableItem.id === item.deliverableId);
                return (
                  <tr id={item.id} key={item.id}>
                    <Td>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.description}</p>
                    </Td>
                    <Td>{pkg?.shortLabel ?? "Unknown"}</Td>
                    <Td>{deliverable?.title ?? "Unknown"}</Td>
                    <Td>{item.owner}</Td>
                    <Td>{item.cadence}</Td>
                    <Td>{item.priority}</Td>
                    <Td>{item.status}</Td>
                    <Td>{item.qaRequired ? "Yes" : "No"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

