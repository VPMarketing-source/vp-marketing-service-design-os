import { notFound } from "next/navigation";

import { PackageWorkspace } from "@/components/app/package-workspace";
import { PageHeader } from "@/components/app/page-header";
import { getData } from "@/lib/data-store";

export default async function PackageDetailPage({
  params
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;
  const data = await getData();
  const pkg = data.packages.find((item) => item.id === packageId);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Package Workspace"
        title={pkg.name}
        description={`${pkg.description} Use the workspace below to move from deliverables into SOPs, check off execution steps, and save progress locally by user.`}
        actionHref="/manage"
        actionLabel="Admin mode"
      />
      <PackageWorkspace data={data} pkg={pkg} />
    </div>
  );
}
