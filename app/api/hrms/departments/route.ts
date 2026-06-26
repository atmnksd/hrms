import { NextResponse } from "next/server"

import { listDepartments } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listDepartments()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
