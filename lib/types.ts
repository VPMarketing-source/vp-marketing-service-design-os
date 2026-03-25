export type PackageTier = {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  accent: string;
  categoryIds: string[];
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
};

export type DeliverableTierDetail = {
  tierId: string;
  meaning: string;
  scope: string[];
  internalTasks: string[];
  owner: string;
  cadence: string;
  inputs: string[];
  tools: string[];
  clientOutput: string;
  successMetric: string;
  qaChecklist: string[];
  notes: string;
  notIncluded: string[];
};

export type Deliverable = {
  id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  clientPromise: string;
  internalDefinition: string;
  includedTierIds: string[];
  exclusions: string[];
  sopIds: string[];
  checklistItemIds: string[];
  tierDetails: DeliverableTierDetail[];
  updatedAt: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  packageId: string;
  deliverableId: string;
  categoryId: string;
  owner: string;
  cadence: "one-time" | "weekly" | "bi-weekly" | "monthly" | "quarterly";
  priority: "low" | "medium" | "high" | "critical";
  status: "planned" | "active" | "qa" | "done";
  dependency: string;
  qaRequired: boolean;
  updatedAt: string;
};

export type Sop = {
  id: string;
  title: string;
  categoryId: string;
  relatedDeliverableId: string;
  ownerDepartment: string;
  purpose: string;
  whenToUse: string;
  steps: string[];
  toolsNeeded: string[];
  qaStandard: string;
  commonMistakes: string[];
  notes: string;
  relatedChecklistItemIds: string[];
  updatedAt: string;
};

export type ServiceDesignData = {
  packages: PackageTier[];
  categories: Category[];
  deliverables: Deliverable[];
  checklistItems: ChecklistItem[];
  sops: Sop[];
};

