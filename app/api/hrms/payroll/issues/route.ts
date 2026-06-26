import { NextResponse } from "next/server"

import { listPayrollIssues } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listPayrollIssues()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
