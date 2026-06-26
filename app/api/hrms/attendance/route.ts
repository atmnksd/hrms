import { NextResponse } from "next/server"

import {
  createAttendanceEntry,
  listAttendanceEntries,
} from "@/lib/hrms-backend/repository"
import type { AttendanceEntry } from "@/lib/hrms-backend/types"

export async function GET() {
  const result = await listAttendanceEntries()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<AttendanceEntry>

  const requiredFields = [
    "employeeName",
    "workDate",
    "status",
    "checkIn",
    "workMode",
  ] as const
  const missing = requiredFields.filter((field) => !payload[field])

  if (missing.length) {
    return NextResponse.json(
      {
        error: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    )
  }

  const created = await createAttendanceEntry({
    employeeName: payload.employeeName as string,
    workDate: payload.workDate as string,
    status: payload.status as string,
    checkIn: payload.checkIn as string,
    checkOut: payload.checkOut ?? null,
    workMode: payload.workMode as string,
    notes: payload.notes ?? null,
  })

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
