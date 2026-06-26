import { NextResponse } from "next/server"

import { listAdminTasks } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listAdminTasks()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
