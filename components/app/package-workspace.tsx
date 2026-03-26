"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Sparkles } from "lucide-react";

import { SopCard, type WorkflowSop, type WorkflowTask } from "@/components/app/sop-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PackageTier, ServiceDesignData } from "@/lib/types";
import { cn } from "@/lib/utils";

type PersistedTaskState = {
  checked?: boolean;
  note?: string;
  subtasks?: Record<string, boolean>;
};

type DeliverableGroup = {
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
  deliverables: DeliverableGroup[];
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

function getProgressFromCounts(completedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return clampProgress((completedCount / totalCount) * 100);
}

export function PackageWorkspace({ data, pkg }: { data: ServiceDesignData; pkg: PackageTier }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [taskState, setTaskState] = useState<Record<string, PersistedTaskState>>({});
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(getStorageKey(pkg.id));
      if (!raw) {
        return;
      }

      setTaskState(JSON.parse(raw) as Record<string, PersistedTaskState>);
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
      const deliverable = packageDeliverables.find((item) => item.id === sop.relatedDeliverableId);
      if (deliverable) {
        roles.add(sop.ownerDepartment);
      }
    }

    return Array.from(roles).sort((left, right) => left.localeCompare(right));
  }, [data.sops, packageDeliverables]);

  const allSections = useMemo<SectionGroup[]>(() => {
    return data.categories
      .filter((category) => pkg.categoryIds.includes(category.id))
      .map((category) => {
        const deliverables = packageDeliverables
          .filter((deliverable) => deliverable.categoryId === category.id)
          .map((deliverable) => {
            const sops = data.sops
              .filter((sop) => sop.relatedDeliverableId === deliverable.id)
              .map((sop) => {
                const checkpoints = data.checklistItems
                  .filter((item) => sop.relatedChecklistItemIds.includes(item.id))
                  .map<WorkflowTask>((item) => ({
                    id: `${sop.id}::checkpoint::${item.id}`,
                    title: item.title,
                    description: item.description,
                    subtasks: buildCheckpointSubtasks(item.qaRequired, item.dependency, item.cadence)
                  }));

                const steps = sop.steps.map<WorkflowTask>((step, index) => ({
                  id: `${sop.id}::step::${index}`,
                  title: `Step ${index + 1}`,
                  description: step
                }));

                const stepCounts = getTaskCounts(steps, taskState);
                const checkpointCounts = getTaskCounts(checkpoints, taskState);
                const completedCount = stepCounts.completed + checkpointCounts.completed;
                const totalCount = stepCounts.total + checkpointCounts.total;

                return {
                  id: sop.id,
                  title: sop.title,
                  role: sop.ownerDepartment,
                  estimatedMinutes: Math.max(15, sop.steps.length * 12 + checkpoints.length * 8),
                  purpose: sop.purpose,
                  whenToUse: sop.whenToUse,
                  deliverableTitle: deliverable.title,
                  categoryName: category.name,
                  progress: getProgressFromCounts(completedCount, totalCount),
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
              progress: getProgressFromCounts(completedCount, totalCount),
              completedCount,
              totalCount,
              sops
            } satisfies DeliverableGroup;
          });

        const completedCount = deliverables.reduce((sum, deliverable) => sum + deliverable.completedCount, 0);
        const totalCount = deliverables.reduce((sum, deliverable) => sum + deliverable.totalCount, 0);

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          progress: getProgressFromCounts(completedCount, totalCount),
          completedCount,
          totalCount,
          deliverables
        } satisfies SectionGroup;
      })
      .filter((section) => section.deliverables.length > 0);
  }, [data.categories, data.checklistItems, data.sops, packageDeliverables, pkg.categoryIds, taskState]);

  const visibleSections = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return allSections
      .map((section) => {
        const deliverables = section.deliverables
          .map((deliverable) => {
            const sops = deliverable.sops.filter((sop) => {
              const roleMatches = roleFilter === "all" || sop.role === roleFilter;
              const queryMatches =
                query.length === 0 ||
                [sop.title, sop.purpose, sop.whenToUse, sop.deliverableTitle, sop.categoryName]
                  .join(" ")
                  .toLowerCase()
                  .includes(query);

              return roleMatches && queryMatches;
            });

            if (query.length > 0 && sops.length === 0) {
              return null;
            }

            if (roleFilter !== "all" && sops.length === 0) {
              return null;
            }

            return {
              ...deliverable,
              sops
            };
          })
          .filter((deliverable): deliverable is DeliverableGroup => Boolean(deliverable));

        if (deliverables.length === 0) {
          return null;
        }

        return {
          ...section,
          deliverables
        };
      })
      .filter((section): section is SectionGroup => Boolean(section));
  }, [allSections, deferredSearch, roleFilter]);

  const packageCompletedCount = allSections.reduce((sum, section) => sum + section.completedCount, 0);
  const packageTotalCount = allSections.reduce((sum, section) => sum + section.totalCount, 0);
  const packageProgress = getProgressFromCounts(packageCompletedCount, packageTotalCount);
  const sopCount = allSections.reduce((sum, section) => sum + section.deliverables.reduce((subtotal, deliverable) => subtotal + deliverable.sops.length, 0), 0);

  function toggleExpanded(sopId: string) {
    setExpanded((current) => ({
      ...current,
      [sopId]: !current[sopId]
    }));
  }

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-white">
          <CardDescription className="uppercase tracking-[0.18em]">Package progress</CardDescription>
          <CardTitle className="mt-3 text-3xl">{packageProgress}%</CardTitle>
          <div className="mt-4 h-2 rounded-full bg-[var(--soft-surface-deep)]">
            <div className="h-2 rounded-full bg-[var(--primary-blue)]" style={{ width: `${packageProgress}%` }} />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">{packageCompletedCount} of {packageTotalCount} tasks complete across this package.</p>
        </Card>
        <Card className="bg-white">
          <CardDescription className="uppercase tracking-[0.18em]">Deliverables</CardDescription>
          <CardTitle className="mt-3 text-3xl">{packageDeliverables.length}</CardTitle>
          <p className="mt-3 text-sm text-[var(--muted)]">Grouped across {allSections.length} operational sections.</p>
        </Card>
        <Card className="bg-white">
          <CardDescription className="uppercase tracking-[0.18em]">SOP coverage</CardDescription>
          <CardTitle className="mt-3 text-3xl">{sopCount}</CardTitle>
          <p className="mt-3 text-sm text-[var(--muted)]">Each SOP tracks per-user progress locally for execution and notes.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-28 xl:self-start">
          <Card className="bg-white">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Workflow sections</CardTitle>
              <Badge tone="brand">Always visible</Badge>
            </div>
            <CardDescription className="mt-2">Navigate the package by team function and jump to active SOP groups.</CardDescription>
            <div className="mt-5 space-y-2">
              {visibleSections.map((section) => (
                <a
                  key={section.id}
                  className="block rounded-[16px] border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 transition hover:-translate-y-0.5 hover:border-[var(--primary-blue)]/30 hover:bg-white"
                  href={`#section-${section.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-[var(--heading)]">{section.name}</span>
                    <span className="text-sm text-[var(--muted)]">{section.progress}%</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{section.deliverables.length} deliverables</p>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-[18px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(102,126,234,0.14),rgba(118,75,162,0.14))] p-4">
              <div className="flex items-center gap-2 text-[var(--heading)]">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm font-semibold">Admin mode available</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--panel-text)]">The content structure is editable from the local admin console whenever SOPs or checklists need to change.</p>
              <Link className="mt-3 inline-flex text-sm font-semibold text-[var(--primary-blue)]" href="/manage">
                Open admin mode
              </Link>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card className="bg-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Main workflow experience</CardTitle>
                <CardDescription className="mt-2">Search SOPs, filter by role, expand the operating procedure, and track progress as work gets completed.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/deliverables">
                  <Button variant="secondary">Open deliverables</Button>
                </Link>
                <Link href="/checklists">
                  <Button variant="secondary">View all checklists</Button>
                </Link>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr),220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Search SOP title, deliverable, category, or purpose" value={search} />
              </div>
              <Select onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
                <option value="all">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>
          </Card>

          {visibleSections.map((section) => (
            <section className="space-y-4" id={`section-${section.id}`} key={section.id}>
              <Card className="bg-white">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{section.name}</CardTitle>
                      <Badge tone="brand">{section.progress}% complete</Badge>
                    </div>
                    <CardDescription className="mt-2 max-w-3xl">{section.description}</CardDescription>
                  </div>
                  <div className="rounded-[18px] border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-sm text-[var(--panel-text)]">
                    <p className="font-semibold">{section.completedCount} of {section.totalCount} tasks complete</p>
                    <p className="mt-1 text-[var(--muted)]">Grouped by deliverable, then SOP, then step.</p>
                  </div>
                </div>
              </Card>

              {section.deliverables.map((deliverable) => (
                <div className="space-y-4" key={deliverable.id}>
                  <Card className="bg-white">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-2xl font-bold text-[var(--heading)]">{deliverable.title}</h3>
                          <Badge tone="neutral">{deliverable.progress}% complete</Badge>
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">{deliverable.description}</p>
                      </div>
                      <div className="min-w-[180px] rounded-[18px] border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          <span>Progress</span>
                          <span>{deliverable.progress}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-[var(--soft-surface-deep)]">
                          <div className="h-2 rounded-full bg-[var(--primary-blue)]" style={{ width: `${deliverable.progress}%` }} />
                        </div>
                        <p className="mt-2 text-sm text-[var(--panel-text)]">{deliverable.completedCount} of {deliverable.totalCount} complete</p>
                      </div>
                    </div>
                  </Card>

                  {deliverable.sops.length > 0 ? (
                    <div className="space-y-3">
                      {deliverable.sops.map((sop) => (
                        <SopCard
                          expanded={Boolean(expanded[sop.id])}
                          key={sop.id}
                          onSubtaskToggle={handleSubtaskToggle}
                          onTaskNoteChange={handleTaskNoteChange}
                          onTaskToggle={handleTaskToggle}
                          onToggleExpanded={toggleExpanded}
                          sop={sop}
                          state={taskState}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-[var(--soft-surface)]">
                      <CardTitle>No SOPs mapped yet</CardTitle>
                      <CardDescription className="mt-2">This deliverable exists in the package, but no SOP has been attached yet. You can add one from admin mode.</CardDescription>
                    </Card>
                  )}
                </div>
              ))}
            </section>
          ))}

          {visibleSections.length === 0 ? (
            <Card className="bg-white">
              <div className="flex items-center gap-3 text-[var(--heading)]">
                <ShieldCheck className="h-5 w-5 text-[var(--primary-blue)]" />
                <CardTitle>No SOPs match the current filters</CardTitle>
              </div>
              <CardDescription className="mt-2">Try clearing the search, switching role filters, or add more SOPs in admin mode.</CardDescription>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
