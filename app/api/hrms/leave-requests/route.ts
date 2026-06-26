import { NextResponse } from "next/server"

import { listLeaveRequests } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listLeaveRequests()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
