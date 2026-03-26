"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ServiceDesignData } from "@/lib/types";
import { slugify } from "@/lib/utils";

const tabs = ["packages", "categories", "deliverables", "checklistItems", "sops"] as const;
type TabKey = (typeof tabs)[number];

function linesToArray(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export function ManageConsole({ initialData }: { initialData: ServiceDesignData }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<TabKey>("deliverables");
  const [selectedPackageId, setSelectedPackageId] = useState(data.packages[0]?.id ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(data.categories[0]?.id ?? "");
  const [selectedDeliverableId, setSelectedDeliverableId] = useState(data.deliverables[0]?.id ?? "");
  const [selectedChecklistId, setSelectedChecklistId] = useState(data.checklistItems[0]?.id ?? "");
  const [selectedSopId, setSelectedSopId] = useState(data.sops[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const selectedPackage = data.packages.find((item) => item.id === selectedPackageId);
  const selectedCategory = data.categories.find((item) => item.id === selectedCategoryId);
  const selectedDeliverable = data.deliverables.find((item) => item.id === selectedDeliverableId);
  const selectedChecklist = data.checklistItems.find((item) => item.id === selectedChecklistId);
  const selectedSop = data.sops.find((item) => item.id === selectedSopId);

  const packageOptions = useMemo(() => data.packages.map((item) => ({ value: item.id, label: item.name })), [data.packages]);
  const categoryOptions = useMemo(() => data.categories.map((item) => ({ value: item.id, label: item.name })), [data.categories]);
  const deliverableOptions = useMemo(() => data.deliverables.map((item) => ({ value: item.id, label: item.title })), [data.deliverables]);

  function updateData(next: ServiceDesignData) {
    setData(next);
    setMessage("Unsaved local changes");
  }

  async function saveAll() {
    setMessage("Saving...");
    startTransition(async () => {
      const response = await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      setMessage(response.ok ? "Saved to local JSON" : "Save failed");
    });
  }

  function addPackage() {
    const id = `package-${Date.now()}`;
    const next: ServiceDesignData = {
      ...data,
      packages: [
        {
          id,
          name: "New Package",
          shortLabel: "New Tier",
          description: "Describe the package purpose.",
          accent: "linear-gradient(135deg, #dbeafe 0%, #e0ecff 100%)",
          categoryIds: data.categories.map((item) => item.id),
          updatedAt: new Date().toISOString()
        },
        ...data.packages
      ]
    };
    updateData(next);
    setSelectedPackageId(id);
  }

  function addCategory() {
    const id = `category-${Date.now()}`;
    const next: ServiceDesignData = {
      ...data,
      categories: [
        {
          id,
          name: "New Category",
          description: "Describe the operating area.",
          updatedAt: new Date().toISOString()
        },
        ...data.categories
      ]
    };
    updateData(next);
    setSelectedCategoryId(id);
  }

  function addDeliverable() {
    const id = `deliverable-${Date.now()}`;
    const next: ServiceDesignData = {
      ...data,
      deliverables: [
        {
          id,
          title: "New Deliverable",
          categoryId: data.categories[0]?.id ?? "",
          shortDescription: "Short description",
          clientPromise: "Client-facing promise",
          internalDefinition: "Internal definition",
          includedTierIds: [],
          exclusions: [],
          sopIds: [],
          checklistItemIds: [],
          tierDetails: [],
          updatedAt: new Date().toISOString()
        },
        ...data.deliverables
      ]
    };
    updateData(next);
    setSelectedDeliverableId(id);
  }

  function addChecklist() {
    const id = `checklist-${Date.now()}`;
    const next: ServiceDesignData = {
      ...data,
      checklistItems: [
        {
          id,
          title: "New checklist item",
          description: "Task description",
          packageId: data.packages[0]?.id ?? "",
          deliverableId: data.deliverables[0]?.id ?? "",
          categoryId: data.categories[0]?.id ?? "",
          owner: "Owner",
          cadence: "weekly",
          priority: "medium",
          status: "planned",
          dependency: "",
          qaRequired: false,
          updatedAt: new Date().toISOString()
        },
        ...data.checklistItems
      ]
    };
    updateData(next);
    setSelectedChecklistId(id);
  }

  function addSop() {
    const id = `sop-${Date.now()}`;
    const next: ServiceDesignData = {
      ...data,
      sops: [
        {
          id,
          title: "New SOP",
          categoryId: data.categories[0]?.id ?? "",
          relatedDeliverableId: data.deliverables[0]?.id ?? "",
          ownerDepartment: "Department",
          purpose: "Purpose",
          whenToUse: "When to use it",
          steps: [],
          toolsNeeded: [],
          qaStandard: "QA standard",
          commonMistakes: [],
          notes: "",
          relatedChecklistItemIds: [],
          updatedAt: new Date().toISOString()
        },
        ...data.sops
      ]
    };
    updateData(next);
    setSelectedSopId(id);
  }

  function deleteCurrent() {
    if (tab === "packages" && selectedPackage) {
      updateData({ ...data, packages: data.packages.filter((item) => item.id !== selectedPackage.id) });
      setSelectedPackageId(data.packages.find((item) => item.id !== selectedPackage.id)?.id ?? "");
    }
    if (tab === "categories" && selectedCategory) {
      updateData({ ...data, categories: data.categories.filter((item) => item.id !== selectedCategory.id) });
      setSelectedCategoryId(data.categories.find((item) => item.id !== selectedCategory.id)?.id ?? "");
    }
    if (tab === "deliverables" && selectedDeliverable) {
      updateData({ ...data, deliverables: data.deliverables.filter((item) => item.id !== selectedDeliverable.id) });
      setSelectedDeliverableId(data.deliverables.find((item) => item.id !== selectedDeliverable.id)?.id ?? "");
    }
    if (tab === "checklistItems" && selectedChecklist) {
      updateData({ ...data, checklistItems: data.checklistItems.filter((item) => item.id !== selectedChecklist.id) });
      setSelectedChecklistId(data.checklistItems.find((item) => item.id !== selectedChecklist.id)?.id ?? "");
    }
    if (tab === "sops" && selectedSop) {
      updateData({ ...data, sops: data.sops.filter((item) => item.id !== selectedSop.id) });
      setSelectedSopId(data.sops.find((item) => item.id !== selectedSop.id)?.id ?? "");
    }
  }

  function updatePackageField(field: string, value: string | string[]) {
    if (!selectedPackage) return;
    updateData({
      ...data,
      packages: data.packages.map((item) => item.id === selectedPackage.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)
    });
  }

  function updateCategoryField(field: string, value: string) {
    if (!selectedCategory) return;
    updateData({
      ...data,
      categories: data.categories.map((item) => item.id === selectedCategory.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)
    });
  }

  function updateDeliverableField(field: string, value: unknown) {
    if (!selectedDeliverable) return;
    updateData({
      ...data,
      deliverables: data.deliverables.map((item) => item.id === selectedDeliverable.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)
    });
  }

  function updateTierDetail(tierId: string, field: string, value: string | string[]) {
    if (!selectedDeliverable) return;
    const current = selectedDeliverable.tierDetails.find((item) => item.tierId === tierId) ?? {
      tierId,
      meaning: "",
      scope: [],
      internalTasks: [],
      owner: "",
      cadence: "",
      inputs: [],
      tools: [],
      clientOutput: "",
      successMetric: "",
      qaChecklist: [],
      notes: "",
      notIncluded: []
    };

    const tierDetails = data.packages.map((pkg) => {
      const existing = selectedDeliverable.tierDetails.find((item) => item.tierId === pkg.id) ?? (pkg.id === tierId ? current : {
        tierId: pkg.id,
        meaning: "",
        scope: [],
        internalTasks: [],
        owner: "",
        cadence: "",
        inputs: [],
        tools: [],
        clientOutput: "",
        successMetric: "",
        qaChecklist: [],
        notes: "",
        notIncluded: []
      });

      return pkg.id === tierId ? { ...existing, [field]: value } : existing;
    });

    updateDeliverableField("tierDetails", tierDetails);
  }

  function updateChecklistField(field: string, value: string | boolean) {
    if (!selectedChecklist) return;
    updateData({
      ...data,
      checklistItems: data.checklistItems.map((item) => item.id === selectedChecklist.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)
    });
  }

  function updateSopField(field: string, value: unknown) {
    if (!selectedSop) return;
    updateData({
      ...data,
      sops: data.sops.map((item) => item.id === selectedSop.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-[rgba(102,126,234,0.16)] bg-[var(--gradient-hero)] text-white shadow-[0_24px_60px_rgba(102,126,234,0.18)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle>Content editing studio</CardTitle>
            <CardDescription className="mt-2 text-white/78">Edit the local JSON-backed operating system without auth or external services.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/18" onClick={deleteCurrent}>Delete selected</Button>
            <Button onClick={saveAll} disabled={isPending}>Save all changes</Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/78">{message || "Choose a section, edit records, then save to write into data/service-design.json."}</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "packages" && (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <Card>
            <div className="flex items-center justify-between"><CardTitle>Packages</CardTitle><Button onClick={addPackage}>Add</Button></div>
            <div className="mt-4 space-y-2">
              {data.packages.map((item) => (
                <button key={item.id} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-left" onClick={() => setSelectedPackageId(item.id)}>{item.name}</button>
              ))}
            </div>
          </Card>
          {selectedPackage && (
            <Card>
              <CardTitle>Edit package</CardTitle>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input value={selectedPackage.name} onChange={(e) => updatePackageField("name", e.target.value)} placeholder="Package name" />
                <Input value={selectedPackage.shortLabel} onChange={(e) => updatePackageField("shortLabel", e.target.value)} placeholder="Short label" />
                <Input value={selectedPackage.id} onChange={(e) => updatePackageField("id", slugify(e.target.value))} placeholder="ID" />
                <Input value={selectedPackage.accent} onChange={(e) => updatePackageField("accent", e.target.value)} placeholder="Accent color" />
              </div>
              <div className="mt-4">
                <Textarea value={selectedPackage.description} onChange={(e) => updatePackageField("description", e.target.value)} placeholder="Description" />
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold">Included categories</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {data.categories.map((category) => {
                    const checked = selectedPackage.categoryIds.includes(category.id);
                    return (
                      <label key={category.id} className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            updatePackageField(
                              "categoryIds",
                              e.target.checked
                                ? [...selectedPackage.categoryIds, category.id]
                                : selectedPackage.categoryIds.filter((item) => item !== category.id)
                            )
                          }
                        />
                        {category.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "categories" && (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <Card>
            <div className="flex items-center justify-between"><CardTitle>Categories</CardTitle><Button onClick={addCategory}>Add</Button></div>
            <div className="mt-4 space-y-2">
              {data.categories.map((item) => (
                <button key={item.id} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-left" onClick={() => setSelectedCategoryId(item.id)}>{item.name}</button>
              ))}
            </div>
          </Card>
          {selectedCategory && (
            <Card>
              <CardTitle>Edit category</CardTitle>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input value={selectedCategory.name} onChange={(e) => updateCategoryField("name", e.target.value)} placeholder="Category name" />
                <Input value={selectedCategory.id} onChange={(e) => updateCategoryField("id", slugify(e.target.value))} placeholder="ID" />
              </div>
              <div className="mt-4">
                <Textarea value={selectedCategory.description} onChange={(e) => updateCategoryField("description", e.target.value)} placeholder="Description" />
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "deliverables" && selectedDeliverable && (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <Card>
            <div className="flex items-center justify-between"><CardTitle>Deliverables</CardTitle><Button onClick={addDeliverable}>Add</Button></div>
            <div className="mt-4 space-y-2 max-h-[70vh] overflow-auto pr-1">
              {data.deliverables.map((item) => (
                <button key={item.id} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-left" onClick={() => setSelectedDeliverableId(item.id)}>{item.title}</button>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Edit deliverable</CardTitle>
            <CardDescription className="mt-2">Tier comparison fields are editable below for each package.</CardDescription>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input value={selectedDeliverable.title} onChange={(e) => updateDeliverableField("title", e.target.value)} placeholder="Title" />
              <Input value={selectedDeliverable.id} onChange={(e) => updateDeliverableField("id", slugify(e.target.value))} placeholder="ID" />
              <Select value={selectedDeliverable.categoryId} onChange={(e) => updateDeliverableField("categoryId", e.target.value)}>
                {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
              <Input value={selectedDeliverable.shortDescription} onChange={(e) => updateDeliverableField("shortDescription", e.target.value)} placeholder="Short description" />
            </div>
            <div className="mt-4 space-y-4">
              <Textarea value={selectedDeliverable.clientPromise} onChange={(e) => updateDeliverableField("clientPromise", e.target.value)} placeholder="Client-facing promise" />
              <Textarea value={selectedDeliverable.internalDefinition} onChange={(e) => updateDeliverableField("internalDefinition", e.target.value)} placeholder="Internal definition" />
              <Textarea value={arrayToLines(selectedDeliverable.exclusions)} onChange={(e) => updateDeliverableField("exclusions", linesToArray(e.target.value))} placeholder="Exclusions, one per line" />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Included tiers</p>
              <div className="grid gap-2 md:grid-cols-3">
                {data.packages.map((pkg) => {
                  const checked = selectedDeliverable.includedTierIds.includes(pkg.id);
                  return (
                    <label key={pkg.id} className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          updateDeliverableField(
                            "includedTierIds",
                            e.target.checked
                              ? [...selectedDeliverable.includedTierIds, pkg.id]
                              : selectedDeliverable.includedTierIds.filter((item) => item !== pkg.id)
                          )
                        }
                      />
                      {pkg.name}
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 space-y-6">
              {data.packages.map((pkg) => {
                const detail = selectedDeliverable.tierDetails.find((item) => item.tierId === pkg.id) ?? {
                  tierId: pkg.id,
                  meaning: "",
                  scope: [],
                  internalTasks: [],
                  owner: "",
                  cadence: "",
                  inputs: [],
                  tools: [],
                  clientOutput: "",
                  successMetric: "",
                  qaChecklist: [],
                  notes: "",
                  notIncluded: []
                };
                return (
                  <div key={pkg.id} className="rounded-[28px] border border-[var(--line)] bg-[var(--soft-surface)] p-5">
                    <p className="text-lg font-semibold">{pkg.name}</p>
                    <div className="mt-4 space-y-4">
                      <Textarea value={detail.meaning} onChange={(e) => updateTierDetail(pkg.id, "meaning", e.target.value)} placeholder="What this deliverable means at this tier" />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input value={detail.owner} onChange={(e) => updateTierDetail(pkg.id, "owner", e.target.value)} placeholder="Owner / role" />
                        <Input value={detail.cadence} onChange={(e) => updateTierDetail(pkg.id, "cadence", e.target.value)} placeholder="Cadence" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Textarea value={arrayToLines(detail.scope)} onChange={(e) => updateTierDetail(pkg.id, "scope", linesToArray(e.target.value))} placeholder="Scope, one per line" />
                        <Textarea value={arrayToLines(detail.internalTasks)} onChange={(e) => updateTierDetail(pkg.id, "internalTasks", linesToArray(e.target.value))} placeholder="Internal tasks, one per line" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Textarea value={arrayToLines(detail.inputs)} onChange={(e) => updateTierDetail(pkg.id, "inputs", linesToArray(e.target.value))} placeholder="Inputs required, one per line" />
                        <Textarea value={arrayToLines(detail.tools)} onChange={(e) => updateTierDetail(pkg.id, "tools", linesToArray(e.target.value))} placeholder="Tools used, one per line" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Textarea value={detail.clientOutput} onChange={(e) => updateTierDetail(pkg.id, "clientOutput", e.target.value)} placeholder="Client-visible output" />
                        <Textarea value={detail.successMetric} onChange={(e) => updateTierDetail(pkg.id, "successMetric", e.target.value)} placeholder="Success metric / KPI" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Textarea value={arrayToLines(detail.qaChecklist)} onChange={(e) => updateTierDetail(pkg.id, "qaChecklist", linesToArray(e.target.value))} placeholder="QA checklist, one per line" />
                        <Textarea value={arrayToLines(detail.notIncluded)} onChange={(e) => updateTierDetail(pkg.id, "notIncluded", linesToArray(e.target.value))} placeholder="Not included, one per line" />
                      </div>
                      <Textarea value={detail.notes} onChange={(e) => updateTierDetail(pkg.id, "notes", e.target.value)} placeholder="Notes / caveats" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === "checklistItems" && selectedChecklist && (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <Card>
            <div className="flex items-center justify-between"><CardTitle>Checklist items</CardTitle><Button onClick={addChecklist}>Add</Button></div>
            <div className="mt-4 space-y-2 max-h-[70vh] overflow-auto pr-1">
              {data.checklistItems.map((item) => (
                <button key={item.id} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-left" onClick={() => setSelectedChecklistId(item.id)}>{item.title}</button>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Edit checklist item</CardTitle>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input value={selectedChecklist.title} onChange={(e) => updateChecklistField("title", e.target.value)} placeholder="Task title" />
              <Input value={selectedChecklist.id} onChange={(e) => updateChecklistField("id", slugify(e.target.value))} placeholder="ID" />
              <Select value={selectedChecklist.packageId} onChange={(e) => updateChecklistField("packageId", e.target.value)}>{packageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              <Select value={selectedChecklist.categoryId} onChange={(e) => updateChecklistField("categoryId", e.target.value)}>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              <Select value={selectedChecklist.deliverableId} onChange={(e) => updateChecklistField("deliverableId", e.target.value)}>{deliverableOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              <Input value={selectedChecklist.owner} onChange={(e) => updateChecklistField("owner", e.target.value)} placeholder="Owner" />
              <Select value={selectedChecklist.cadence} onChange={(e) => updateChecklistField("cadence", e.target.value)}>
                <option value="one-time">one-time</option><option value="weekly">weekly</option><option value="bi-weekly">bi-weekly</option><option value="monthly">monthly</option><option value="quarterly">quarterly</option>
              </Select>
              <Select value={selectedChecklist.priority} onChange={(e) => updateChecklistField("priority", e.target.value)}>
                <option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option>
              </Select>
              <Select value={selectedChecklist.status} onChange={(e) => updateChecklistField("status", e.target.value)}>
                <option value="planned">planned</option><option value="active">active</option><option value="qa">qa</option><option value="done">done</option>
              </Select>
              <Input value={selectedChecklist.dependency} onChange={(e) => updateChecklistField("dependency", e.target.value)} placeholder="Dependency" />
            </div>
            <div className="mt-4 space-y-4">
              <Textarea value={selectedChecklist.description} onChange={(e) => updateChecklistField("description", e.target.value)} placeholder="Task description" />
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={selectedChecklist.qaRequired} onChange={(e) => updateChecklistField("qaRequired", e.target.checked)} />
                QA required
              </label>
            </div>
          </Card>
        </div>
      )}

      {tab === "sops" && selectedSop && (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <Card>
            <div className="flex items-center justify-between"><CardTitle>SOPs</CardTitle><Button onClick={addSop}>Add</Button></div>
            <div className="mt-4 space-y-2 max-h-[70vh] overflow-auto pr-1">
              {data.sops.map((item) => (
                <button key={item.id} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft-surface)] px-4 py-3 text-left" onClick={() => setSelectedSopId(item.id)}>{item.title}</button>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Edit SOP</CardTitle>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input value={selectedSop.title} onChange={(e) => updateSopField("title", e.target.value)} placeholder="SOP title" />
              <Input value={selectedSop.id} onChange={(e) => updateSopField("id", slugify(e.target.value))} placeholder="ID" />
              <Select value={selectedSop.categoryId} onChange={(e) => updateSopField("categoryId", e.target.value)}>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              <Select value={selectedSop.relatedDeliverableId} onChange={(e) => updateSopField("relatedDeliverableId", e.target.value)}>{deliverableOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              <Input value={selectedSop.ownerDepartment} onChange={(e) => updateSopField("ownerDepartment", e.target.value)} placeholder="Owner / department" />
              <Textarea value={selectedSop.notes} onChange={(e) => updateSopField("notes", e.target.value)} placeholder="Notes" className="min-h-[48px]" />
            </div>
            <div className="mt-4 space-y-4">
              <Textarea value={selectedSop.purpose} onChange={(e) => updateSopField("purpose", e.target.value)} placeholder="Purpose" />
              <Textarea value={selectedSop.whenToUse} onChange={(e) => updateSopField("whenToUse", e.target.value)} placeholder="When to use it" />
              <Textarea value={selectedSop.qaStandard} onChange={(e) => updateSopField("qaStandard", e.target.value)} placeholder="QA standard" />
              <div className="grid gap-4 md:grid-cols-3">
                <Textarea value={arrayToLines(selectedSop.steps)} onChange={(e) => updateSopField("steps", linesToArray(e.target.value))} placeholder="Steps, one per line" />
                <Textarea value={arrayToLines(selectedSop.toolsNeeded)} onChange={(e) => updateSopField("toolsNeeded", linesToArray(e.target.value))} placeholder="Tools, one per line" />
                <Textarea value={arrayToLines(selectedSop.commonMistakes)} onChange={(e) => updateSopField("commonMistakes", linesToArray(e.target.value))} placeholder="Common mistakes, one per line" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}




