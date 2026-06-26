import { NextResponse } from "next/server"

import { listAttendanceSignals } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listAttendanceSignals()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
