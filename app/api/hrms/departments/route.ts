import { NextResponse } from "next/server"

import {
  createDepartment,
  listDepartments,
} from "@/lib/hrms-backend/repository"
import type { Department } from "@/lib/hrms-backend/types"

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

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Department>

  const requiredFields = ["id", "name", "lead", "budgetStatus", "openRoles"] as const
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === "")

  if (missing.length) {
    return NextResponse.json(
      {
        error: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    )
  }

  const created = await createDepartment({
    id: payload.id as string,
    name: payload.name as string,
    lead: payload.lead as string,
    budgetStatus: payload.budgetStatus as string,
    openRoles: Number(payload.openRoles),
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
