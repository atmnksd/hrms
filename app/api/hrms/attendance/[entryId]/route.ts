import { NextResponse } from "next/server"

import { updateAttendanceEntry } from "@/lib/hrms-backend/repository"
import type { AttendanceEntry } from "@/lib/hrms-backend/types"

type RouteParams = {
  entryId: string
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  const { entryId } = await params
  const payload = (await request.json()) as Partial<AttendanceEntry>
  const result = await updateAttendanceEntry(entryId, payload)

  if (!result.data) {
    return NextResponse.json({ error: "Attendance entry not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })
}
