"use client";

import { ChevronDown } from "lucide-react";

import { WorkflowChecklistItem } from "@/components/app/checklist-item";
import { ProgressBar } from "@/components/app/progress-bar";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
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
    <div className="rounded-[14px] border border-[var(--line)] bg-white" id={`sop-${sop.id}`}>
      <button
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition hover:bg-[var(--soft-surface)]"
        onClick={() => onToggleExpanded(sop.id)}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{sop.title}</CardTitle>
            <Badge tone="neutral">{sop.progress}%</Badge>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{sop.role} • {sop.estimatedMinutes} min</p>
          <CardDescription className="mt-2 leading-6">{sop.whenToUse}</CardDescription>
          <div className="mt-3 max-w-[240px]">
            <ProgressBar value={sop.progress} />
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-[var(--muted)] transition-transform", expanded && "rotate-180")} />
      </button>

      <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden border-t border-[var(--line)]">
          <div className="space-y-4 px-4 py-4">
            <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              {sop.tools.map((tool) => (
                <span key={tool} className="rounded-full bg-[var(--soft-surface)] px-2.5 py-1">{tool}</span>
              ))}
              {sop.attachments.map((attachment) => (
                attachment.href ? (
                  <a key={attachment.label} className="rounded-full bg-[var(--soft-surface)] px-2.5 py-1 text-[var(--primary-blue)]" href={attachment.href} rel="noreferrer" target="_blank">{attachment.label}</a>
                ) : (
                  <span key={attachment.label} className="rounded-full bg-[var(--soft-surface)] px-2.5 py-1">{attachment.label}</span>
                )
              ))}
            </div>

            <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}

