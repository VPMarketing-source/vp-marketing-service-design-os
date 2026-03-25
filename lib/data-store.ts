import { promises as fs } from "fs";
import path from "path";

import { seedData } from "@/lib/seed-data";
import { ServiceDesignData } from "@/lib/types";
import { slugify } from "@/lib/utils";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "service-design.json");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seedData, null, 2), "utf8");
  }
}

export async function getData(): Promise<ServiceDesignData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw) as Partial<ServiceDesignData>;

  if (!parsed.packages || !parsed.categories || !parsed.deliverables || !parsed.checklistItems || !parsed.sops) {
    await fs.writeFile(dataFile, JSON.stringify(seedData, null, 2), "utf8");
    return seedData;
  }

  return parsed as ServiceDesignData;
}

export async function saveData(data: ServiceDesignData) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

type EntityMap = {
  packages: ServiceDesignData["packages"][number];
  categories: ServiceDesignData["categories"][number];
  deliverables: ServiceDesignData["deliverables"][number];
  checklistItems: ServiceDesignData["checklistItems"][number];
  sops: ServiceDesignData["sops"][number];
};

export async function createRecord<K extends keyof EntityMap>(
  entity: K,
  input: Omit<EntityMap[K], "id" | "updatedAt"> & Partial<Pick<EntityMap[K], "id">>
) {
  const data = await getData();
  const id =
    input.id ??
    slugify(
      (input as { title?: string; name?: string }).title ??
        (input as { name?: string }).name ??
        `${entity}-${Date.now()}`
    );

  const record = {
    ...input,
    id,
    updatedAt: new Date().toISOString()
  } as EntityMap[K];

  data[entity].unshift(record as never);
  await saveData(data);
  return record;
}

export async function updateRecord<K extends keyof EntityMap>(
  entity: K,
  id: string,
  patch: Partial<Omit<EntityMap[K], "id">>
) {
  const data = await getData();
  const index = data[entity].findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Record not found for ${entity}:${id}`);
  }

  data[entity][index] = {
    ...data[entity][index],
    ...patch,
    updatedAt: new Date().toISOString()
  } as never;

  await saveData(data);
  return data[entity][index];
}

export async function deleteRecord<K extends keyof EntityMap>(entity: K, id: string) {
  const data = await getData();
  data[entity] = data[entity].filter((item) => item.id !== id) as never;
  await saveData(data);
}

