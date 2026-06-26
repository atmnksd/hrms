import { NextResponse } from "next/server"

import { updateLeaveRequest } from "@/lib/hrms-backend/repository"
import type { LeaveRequest } from "@/lib/hrms-backend/types"

type RouteParams = {
  requestId: string
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  const { requestId } = await params
  const payload = (await request.json()) as Partial<LeaveRequest>
  const result = await updateLeaveRequest(requestId, payload)

  if (!result.data) {
    return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })
}
