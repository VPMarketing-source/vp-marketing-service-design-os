"use client";

import { Textarea } from "@/components/ui/textarea";

type WorkflowSubtask = {
  id: string;
  title: string;
};

export type WorkflowChecklistItemProps = {
  itemId: string;
  title: string;
  description?: string;
  checked: boolean;
  note: string;
  subtasks?: WorkflowSubtask[];
  subtaskState?: Record<string, boolean>;
  onToggle: (itemId: string, checked: boolean) => void;
  onNoteChange: (itemId: string, note: string) => void;
  onSubtaskToggle?: (itemId: string, subtaskId: string, checked: boolean) => void;
};

export function WorkflowChecklistItem({
  itemId,
  title,
  description,
  checked,
  note,
  subtasks = [],
  subtaskState = {},
  onToggle,
  onNoteChange,
  onSubtaskToggle
}: WorkflowChecklistItemProps) {
  return (
    <div className="rounded-[18px] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow)]">
      <label className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 rounded border-[var(--line)] text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
          onChange={(event) => onToggle(itemId, event.target.checked)}
          type="checkbox"
        />
        <div className="flex-1">
          <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold text-[var(--heading)]">{title}</p>
              {description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
            </div>
            <span className="rounded-full bg-[var(--soft-surface)] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--panel-text)]">
              {checked ? "Done" : "Open"}
            </span>
          </div>

          {subtasks.length > 0 ? (
            <div className="mt-4 rounded-[16px] border border-[var(--line)] bg-[var(--soft-surface)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Nested subtasks</p>
              <div className="mt-3 space-y-2">
                {subtasks.map((subtask) => (
                  <label key={subtask.id} className="flex items-center gap-3 text-sm text-[var(--panel-text)]">
                    <input
                      checked={Boolean(subtaskState[subtask.id])}
                      className="h-4 w-4 rounded border-[var(--line)] text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
                      onChange={(event) => onSubtaskToggle?.(itemId, subtask.id, event.target.checked)}
                      type="checkbox"
                    />
                    <span>{subtask.title}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <Textarea
              className="min-h-[96px]"
              onChange={(event) => onNoteChange(itemId, event.target.value)}
              placeholder="Add notes, blockers, or handoff context"
              value={note}
            />
          </div>
        </div>
      </label>
    </div>
  );
}
