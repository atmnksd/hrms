import { NextResponse } from "next/server"

import {
  createLeaveRequest,
  listLeaveRequests,
} from "@/lib/hrms-backend/repository"
import type { LeaveRequest } from "@/lib/hrms-backend/types"

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

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeaveRequest>

  const requiredFields = ["employeeName", "leaveType", "dateRange", "status"] as const
  const missing = requiredFields.filter((field) => !payload[field])

  if (missing.length) {
    return NextResponse.json(
      {
        error: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    )
  }

  const created = await createLeaveRequest(payload as Omit<LeaveRequest, "id">)

  return NextResponse.json(
    {
      data: created.data,
      meta: {
        source: created.source,
      },
    },
    { status: 201 },
  )
}
