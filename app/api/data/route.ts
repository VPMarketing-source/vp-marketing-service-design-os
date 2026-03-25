import { NextResponse } from "next/server";

import { getData, saveData } from "@/lib/data-store";
import { ServiceDesignData } from "@/lib/types";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as ServiceDesignData;
  await saveData(payload);
  return NextResponse.json({ ok: true });
}

