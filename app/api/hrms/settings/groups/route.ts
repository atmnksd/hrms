import { NextResponse } from "next/server"

import { listSettingsGroups } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listSettingsGroups()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
