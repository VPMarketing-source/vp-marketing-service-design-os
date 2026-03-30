import { notFound } from "next/navigation";

import { PackageWorkspace } from "@/components/app/package-workspace";
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

  return <PackageWorkspace data={data} pkg={pkg} />;
}
