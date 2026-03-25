export const entityConfig = {
  packages: "packages",
  categories: "categories",
  deliverables: "deliverables",
  "checklist-items": "checklistItems",
  sops: "sops"
} as const;

export type ApiEntity = keyof typeof entityConfig;

export function resolveEntityKey(entity: string) {
  return entityConfig[entity as ApiEntity];
}

