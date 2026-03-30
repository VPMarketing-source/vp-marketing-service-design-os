"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

import { DeliverableGroup } from "@/components/app/deliverable-group";
import { ProgressBar } from "@/components/app/progress-bar";
import { SectionBlock } from "@/components/app/section-block";
import { WorkflowSidebar } from "@/components/app/sidebar";
import { SopCard, type WorkflowSop, type WorkflowTask } from "@/components/app/sop-card";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PackageTier, ServiceDesignData } from "@/lib/types";

type PersistedTaskState = {
  checked?: boolean;
  note?: string;
  subtasks?: Record<string, boolean>;
};

type DeliverableGroupData = {
  id: string;
  title: string;
  description: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  sops: WorkflowSop[];
};

type SectionGroup = {
  id: string;
  name: string;
  description: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  deliverables: DeliverableGroupData[];
};

function getStorageKey(packageId: string) {
  return `vp-service-os-progress:${packageId}`;
}

function clampProgress(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
}

function buildCheckpointSubtasks(qaRequired: boolean, dependency: string, cadence: string) {
  const subtasks = [];

  if (dependency) {
    subtasks.push({ id: "dependency", title: `Dependency clear: ${dependency}` });
  }

  subtasks.push({ id: "cadence", title: `Cadence confirmed: ${cadence}` });

  if (qaRequired) {
    subtasks.push({ id: "qa", title: "QA review completed" });
  }

  return subtasks;
}

function getTaskCounts(tasks: WorkflowTask[], state: Record<string, PersistedTaskState>) {
  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (state[task.id]?.checked) {
        acc.completed += 1;
      }

      for (const subtask of task.subtasks ?? []) {
        acc.total += 1;
        if (state[task.id]?.subtasks?.[subtask.id]) {
          acc.completed += 1;
        }
      }

      return acc;
    },
    { completed: 0, total: 0 }
  );
}

function getProgress(completedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return clampProgress((completedCount / totalCount) * 100);
}

function getFirstIncompleteTask(sections: SectionGroup[], taskState: Record<string, PersistedTaskState>) {
  for (const section of sections) {
    for (const deliverable of section.deliverables) {
      for (const sop of deliverable.sops) {
        for (const task of [...sop.steps, ...sop.checkpoints]) {
          if (!taskState[task.id]?.checked) {
            return { sopId: sop.id, taskId: task.id, sectionId: section.id };
          }

          for (const subtask of task.subtasks ?? []) {
            if (!taskState[task.id]?.subtasks?.[subtask.id]) {
              return { sopId: sop.id, taskId: task.id, sectionId: section.id };
            }
          }
        }
      }
    }
  }

  return null;
}

export function PackageWorkspace({ data, pkg }: { data: ServiceDesignData; pkg: PackageTier }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeSectionId, setActiveSectionId] = useState<string>();
  const [expandedSopId, setExpandedSopId] = useState<string>();
  const [taskState, setTaskState] = useState<Record<string, PersistedTaskState>>({});
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(getStorageKey(pkg.id));
      if (raw) {
        setTaskState(JSON.parse(raw) as Record<string, PersistedTaskState>);
      }
    } catch {
      setTaskState({});
    }
  }, [pkg.id]);

  useEffect(() => {
    window.localStorage.setItem(getStorageKey(pkg.id), JSON.stringify(taskState));
  }, [pkg.id, taskState]);

  const packageDeliverables = useMemo(
    () => data.deliverables.filter((deliverable) => deliverable.includedTierIds.includes(pkg.id)),
    [data.deliverables, pkg.id]
  );

  const roleOptions = useMemo(() => {
    const roles = new Set<string>();

    for (const sop of data.sops) {
      if (packageDeliverables.some((deliverable) => deliverable.id === sop.relatedDeliverableId)) {
        roles.add(sop.ownerDepartment);
      }
    }

    return Array.from(roles).sort((left, right) => left.localeCompare(right));
  }, [data.sops, packageDeliverables]);

  const sections = useMemo<SectionGroup[]>(() => {
    return data.categories
      .filter((category) => pkg.categoryIds.includes(category.id))
      .map((category) => {
        const deliverables = packageDeliverables
          .filter((deliverable) => deliverable.categoryId === category.id)
          .map((deliverable) => {
            const sops = data.sops
              .filter((sop) => sop.relatedDeliverableId === deliverable.id)
              .map((sop) => {
                const steps = sop.steps.map<WorkflowTask>((step, index) => ({
                  id: `${sop.id}::step::${index}`,
                  title: `Step ${index + 1}`,
                  description: step
                }));

                const checkpoints = data.checklistItems
                  .filter((item) => sop.relatedChecklistItemIds.includes(item.id))
                  .map<WorkflowTask>((item) => ({
                    id: `${sop.id}::checkpoint::${item.id}`,
                    title: item.title,
                    description: item.description,
                    subtasks: buildCheckpointSubtasks(item.qaRequired, item.dependency, item.cadence)
                  }));

                const stepCounts = getTaskCounts(steps, taskState);
                const checkpointCounts = getTaskCounts(checkpoints, taskState);
                const completedCount = stepCounts.completed + checkpointCounts.completed;
                const totalCount = stepCounts.total + checkpointCounts.total;

                return {
                  id: sop.id,
                  title: sop.title,
                  role: sop.ownerDepartment,
                  estimatedMinutes: Math.max(15, sop.steps.length * 10 + checkpoints.length * 8),
                  purpose: sop.purpose,
                  whenToUse: sop.whenToUse,
                  deliverableTitle: deliverable.title,
                  categoryName: category.name,
                  progress: getProgress(completedCount, totalCount),
                  completedCount,
                  totalCount,
                  steps,
                  checkpoints,
                  tools: sop.toolsNeeded,
                  attachments: sop.notes ? [{ label: "Reference notes" }] : []
                } satisfies WorkflowSop;
              });

            const completedCount = sops.reduce((sum, sop) => sum + sop.completedCount, 0);
            const totalCount = sops.reduce((sum, sop) => sum + sop.totalCount, 0);

            return {
              id: deliverable.id,
              title: deliverable.title,
              description: deliverable.shortDescription,
              progress: getProgress(completedCount, totalCount),
              completedCount,
              totalCount,
              sops
            } satisfies DeliverableGroupData;
          });

        const completedCount = deliverables.reduce((sum, deliverable) => sum + deliverable.completedCount, 0);
        const totalCount = deliverables.reduce((sum, deliverable) => sum + deliverable.totalCount, 0);

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          progress: getProgress(completedCount, totalCount),
          completedCount,
          totalCount,
          deliverables
        } satisfies SectionGroup;
      })
      .filter((section) => section.deliverables.length > 0);
  }, [data.categories, data.checklistItems, data.sops, packageDeliverables, pkg.categoryIds, taskState]);

  const visibleSections = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return sections
      .map((section) => {
        const deliverables = section.deliverables
          .map((deliverable) => {
            const sops = deliverable.sops.filter((sop) => {
              const roleMatches = roleFilter === "all" || sop.role === roleFilter;
              const queryMatches =
                query.length === 0 ||
                [sop.title, sop.whenToUse, sop.deliverableTitle, sop.categoryName]
                  .join(" ")
                  .toLowerCase()
                  .includes(query);
              return roleMatches && queryMatches;
            });

            if (sops.length === 0) {
              return null;
            }

            return { ...deliverable, sops };
          })
          .filter((deliverable): deliverable is DeliverableGroupData => Boolean(deliverable));

        if (deliverables.length === 0) {
          return null;
        }

        return { ...section, deliverables };
      })
      .filter((section): section is SectionGroup => Boolean(section));
  }, [deferredSearch, roleFilter, sections]);

  const packageCompletedCount = sections.reduce((sum, section) => sum + section.completedCount, 0);
  const packageTotalCount = sections.reduce((sum, section) => sum + section.totalCount, 0);
  const packageProgress = getProgress(packageCompletedCount, packageTotalCount);

  useEffect(() => {
    if (visibleSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSectionId(visible.target.id.replace("section-", ""));
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    const sectionEls = visibleSections
      .map((section) => document.getElementById(`section-${section.id}`))
      .filter((element): element is HTMLElement => Boolean(element));

    sectionEls.forEach((element) => observer.observe(element));
    setActiveSectionId((current) => current ?? visibleSections[0]?.id);

    return () => observer.disconnect();
  }, [visibleSections]);

  useEffect(() => {
    const firstIncomplete = getFirstIncompleteTask(sections, taskState);
    if (!firstIncomplete || expandedSopId) {
      return;
    }

    startTransition(() => {
      setExpandedSopId(firstIncomplete.sopId);
      setActiveSectionId(firstIncomplete.sectionId);
    });

    const timeout = window.setTimeout(() => {
      document.getElementById(`task-${firstIncomplete.taskId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [expandedSopId, sections, taskState]);

  function updateTask(taskId: string, patch: PersistedTaskState) {
    setTaskState((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        ...patch
      }
    }));
  }

  function handleTaskToggle(taskId: string, checked: boolean) {
    updateTask(taskId, { checked });
  }

  function handleTaskNoteChange(taskId: string, note: string) {
    updateTask(taskId, { note });
  }

  function handleSubtaskToggle(taskId: string, subtaskId: string, checked: boolean) {
    setTaskState((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        subtasks: {
          ...(current[taskId]?.subtasks ?? {}),
          [subtaskId]: checked
        }
      }
    }));
  }

  function toggleExpanded(sopId: string) {
    setExpandedSopId((current) => (current === sopId ? undefined : sopId));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[280px,minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-24 xl:self-start">
        <WorkflowSidebar
          activeSectionId={activeSectionId}
          packages={data.packages.map((item) => ({
            id: item.id,
            label: item.name,
            href: `/packages/${item.id}`,
            active: item.id === pkg.id
          }))}
          sections={visibleSections.map((section) => ({ id: section.id, label: section.name, progress: section.progress }))}
        />
      </aside>

      <div className="space-y-5">
        <div className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="font-heading text-2xl font-bold text-[var(--heading)]">{pkg.name}</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">{packageCompletedCount} / {packageTotalCount} tasks complete</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Input className="w-full md:w-[260px]" onChange={(event) => setSearch(event.target.value)} placeholder="Search SOPs" value={search} />
              <Select className="md:w-[170px]" onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
                <option value="all">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>
          </div>
          <ProgressBar className="mt-4" value={packageProgress} />
        </div>

        {visibleSections.map((section) => (
          <SectionBlock description={section.description} id={section.id} key={section.id} progress={section.progress} title={section.name}>
            {section.deliverables.map((deliverable) => (
              <DeliverableGroup
                completedCount={deliverable.completedCount}
                description={deliverable.description}
                key={deliverable.id}
                progress={deliverable.progress}
                title={deliverable.title}
                totalCount={deliverable.totalCount}
              >
                {deliverable.sops.map((sop) => (
                  <SopCard
                    expanded={expandedSopId === sop.id}
                    key={sop.id}
                    onSubtaskToggle={handleSubtaskToggle}
                    onTaskNoteChange={handleTaskNoteChange}
                    onTaskToggle={handleTaskToggle}
                    onToggleExpanded={toggleExpanded}
                    sop={sop}
                    state={taskState}
                  />
                ))}
              </DeliverableGroup>
            ))}
          </SectionBlock>
        ))}

        {visibleSections.length === 0 ? (
          <Card className="bg-white">
            <CardTitle>No matching SOPs</CardTitle>
            <CardDescription className="mt-2">Clear the search or role filter to get back to the active workflow.</CardDescription>
          </Card>
        ) : null}

        <div className="flex gap-3 text-sm">
          <Link className="font-semibold text-[var(--primary-blue)]" href="/checklists">All checklists</Link>
          <Link className="font-semibold text-[var(--primary-blue)]" href="/manage">Admin mode</Link>
        </div>
      </div>
    </div>
  );
}
