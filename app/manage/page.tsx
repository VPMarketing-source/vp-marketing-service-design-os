import { ManageConsole } from "@/components/app/manage-console";
import { PageHeader } from "@/components/app/page-header";
import { getData } from "@/lib/data-store";

export default async function ManagePage() {
  const data = await getData();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Content Management"
        title="Manage packages, deliverables, checklists, and SOPs"
        description="This is the local editing area for your internal service design system. Changes are saved back into JSON so the app stays simple and portable."
      />
      <ManageConsole initialData={data} />
    </div>
  );
}

