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
    <div className="rounded-xl border border-[var(--line)] bg-white px-3 py-3" id={`task-${itemId}`}>
      <div className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 rounded border-[var(--line)] text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
          onChange={(event) => onToggle(itemId, event.target.checked)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--heading)]">{title}</p>
              {description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
            </div>
            <span className="text-xs text-[var(--muted)]">{checked ? "Done" : "Open"}</span>
          </div>

          {subtasks.length > 0 ? (
            <div className="mt-3 space-y-2 border-l border-[var(--line)] pl-4">
              {subtasks.map((subtask) => (
                <label key={subtask.id} className="flex items-center gap-2 text-sm text-[var(--panel-text)]">
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
          ) : null}

          <Textarea
            className="mt-3 min-h-[78px] rounded-xl"
            onChange={(event) => onNoteChange(itemId, event.target.value)}
            placeholder="Notes"
            value={note}
          />
        </div>
      </div>
    </div>
  );
}

