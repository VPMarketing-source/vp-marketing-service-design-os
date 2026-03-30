"use client";

import { useMemo, useState } from "react";

import { DashboardPanel } from "@/components/app/dashboard-panel";

export type ChecklistTask = {
  id: string;
  label: string;
  detail?: string;
};

export function ChecklistPanel({
  title,
  subtitle,
  tasks
}: {
  title: string;
  subtitle?: string;
  tasks: ChecklistTask[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const completeCount = useMemo(() => tasks.filter((task) => checked[task.id]).length, [checked, tasks]);

  function toggleTask(taskId: string) {
    setChecked((current) => ({
      ...current,
      [taskId]: !current[taskId]
    }));
  }

  return (
    <DashboardPanel
      actions={<span className="rounded-lg bg-[var(--soft-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">{completeCount}/{tasks.length}</span>}
      subtitle={subtitle}
      title={title}
    >
      <div className="space-y-2">
        {tasks.map((task) => (
          <label className="flex items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--soft-surface)]/45 p-3" key={task.id}>
            <input
              checked={Boolean(checked[task.id])}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300"
              onChange={() => toggleTask(task.id)}
              type="checkbox"
            />
            <div className="min-w-0">
              <p className="text-[12px] text-zinc-700">{task.label}</p>
              {task.detail ? <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">{task.detail}</p> : null}
            </div>
          </label>
        ))}
      </div>
    </DashboardPanel>
  );
}
