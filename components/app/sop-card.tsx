"use client";

import { ChevronDown, Clock3, FolderKanban, UserRound } from "lucide-react";

import { WorkflowChecklistItem } from "@/components/app/checklist-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type WorkflowSubtask = {
  id: string;
  title: string;
};

export type WorkflowTask = {
  id: string;
  title: string;
  description?: string;
  subtasks?: WorkflowSubtask[];
};

export type WorkflowAttachment = {
  label: string;
  href?: string;
};

export type WorkflowSop = {
  id: string;
  title: string;
  role: string;
  estimatedMinutes: number;
  purpose: string;
  whenToUse: string;
  deliverableTitle: string;
  categoryName: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  steps: WorkflowTask[];
  checkpoints: WorkflowTask[];
  tools: string[];
  attachments: WorkflowAttachment[];
};

type PersistedTaskState = {
  checked?: boolean;
  note?: string;
  subtasks?: Record<string, boolean>;
};

export function SopCard({
  sop,
  expanded,
  state,
  onToggleExpanded,
  onTaskToggle,
  onTaskNoteChange,
  onSubtaskToggle
}: {
  sop: WorkflowSop;
  expanded: boolean;
  state: Record<string, PersistedTaskState>;
  onToggleExpanded: (sopId: string) => void;
  onTaskToggle: (taskId: string, checked: boolean) => void;
  onTaskNoteChange: (taskId: string, note: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string, checked: boolean) => void;
}) {
  return (
    <Card className="overflow-hidden bg-white p-0">
      <button
        className="flex w-full flex-col gap-4 px-5 py-5 text-left transition duration-200 hover:bg-[var(--soft-surface)] sm:px-6"
        onClick={() => onToggleExpanded(sop.id)}
        type="button"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{sop.categoryName}</Badge>
              <Badge tone="neutral">{sop.deliverableTitle}</Badge>
            </div>
            <CardTitle className="mt-3 text-xl">{sop.title}</CardTitle>
            <CardDescription className="mt-2 max-w-3xl">{sop.purpose}</CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="min-w-[180px] rounded-[18px] border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                <span>Progress</span>
                <span>{sop.progress}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--soft-surface-deep)]">
                <div className="h-2 rounded-full bg-[var(--primary-blue)] transition-all duration-300" style={{ width: `${sop.progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-[var(--panel-text)]">{sop.completedCount} of {sop.totalCount} complete</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--panel-text)]">
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-[var(--panel-text)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--soft-surface)] px-3 py-1.5">
            <UserRound className="h-4 w-4" />
            {sop.role}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--soft-surface)] px-3 py-1.5">
            <Clock3 className="h-4 w-4" />
            {sop.estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--soft-surface)] px-3 py-1.5">
            <FolderKanban className="h-4 w-4" />
            {sop.steps.length} steps
          </span>
        </div>
      </button>

      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]") }>
        <div className="overflow-hidden border-t border-[var(--line)]">
          <div className="space-y-6 px-5 py-5 sm:px-6">
            <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-[18px] border border-[var(--line)] bg-[var(--soft-surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">When to use</p>
                <p className="mt-2 text-sm leading-7 text-[var(--panel-text)]">{sop.whenToUse}</p>
              </div>
              <div className="rounded-[18px] border border-[var(--line)] bg-[var(--soft-surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Resources</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sop.attachments.length > 0 ? sop.attachments.map((attachment) => (
                    attachment.href ? (
                      <a
                        key={attachment.label}
                        className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-blue)]"
                        href={attachment.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {attachment.label}
                      </a>
                    ) : (
                      <span key={attachment.label} className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--panel-text)]">
                        {attachment.label}
                      </span>
                    )
                  )) : <p className="text-sm text-[var(--muted)]">No attachments added yet.</p>}
                </div>
                {sop.tools.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Tools</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sop.tools.map((tool) => (
                        <span key={tool} className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--panel-text)]">{tool}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-bold">Procedure steps</h3>
                <Badge tone="neutral">Execution checklist</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {sop.steps.map((step) => (
                  <WorkflowChecklistItem
                    checked={Boolean(state[step.id]?.checked)}
                    description={step.description}
                    itemId={step.id}
                    key={step.id}
                    note={state[step.id]?.note ?? ""}
                    onNoteChange={onTaskNoteChange}
                    onToggle={onTaskToggle}
                    onSubtaskToggle={onSubtaskToggle}
                    subtaskState={state[step.id]?.subtasks}
                    subtasks={step.subtasks}
                    title={step.title}
                  />
                ))}
              </div>
            </div>

            {sop.checkpoints.length > 0 ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-bold">Execution checkpoints</h3>
                  <Badge tone="accent">Role-based tasks</Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {sop.checkpoints.map((step) => (
                    <WorkflowChecklistItem
                      checked={Boolean(state[step.id]?.checked)}
                      description={step.description}
                      itemId={step.id}
                      key={step.id}
                      note={state[step.id]?.note ?? ""}
                      onNoteChange={onTaskNoteChange}
                      onToggle={onTaskToggle}
                      onSubtaskToggle={onSubtaskToggle}
                      subtaskState={state[step.id]?.subtasks}
                      subtasks={step.subtasks}
                      title={step.title}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button onClick={() => onToggleExpanded(sop.id)} variant="ghost">
                {expanded ? "Collapse SOP" : "Expand SOP"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
