import { NextResponse } from "next/server"

import { listDepartmentOrgNodes } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listDepartmentOrgNodes()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
