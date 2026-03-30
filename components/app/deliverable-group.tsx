import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";

import { ProgressBar } from "@/components/app/progress-bar";

export function DeliverableGroup({
  title,
  description,
  progress,
  completedCount,
  totalCount,
  children
}: {
  title: string;
  description: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-[16px] border border-[var(--line)] bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge tone="neutral">{progress}%</Badge>
          </div>
          <CardDescription className="mt-1.5 text-sm leading-6">{description}</CardDescription>
        </div>
        <div className="w-full max-w-[220px]">
          <p className="mb-2 text-xs text-[var(--muted)]">{completedCount} / {totalCount} complete</p>
          <ProgressBar value={progress} />
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

