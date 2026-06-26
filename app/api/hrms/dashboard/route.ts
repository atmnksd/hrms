import { NextResponse } from "next/server"

import {
  getDashboardSummary,
  listDashboardTasks,
} from "@/lib/hrms-backend/repository"

export async function GET() {
  const [summary, tasks] = await Promise.all([
    getDashboardSummary(),
    listDashboardTasks(),
  ])

  return NextResponse.json({
    data: {
      summary: summary.data,
      tasks: tasks.data,
    },
    meta: {
      source: summary.source,
    },
  })
}
