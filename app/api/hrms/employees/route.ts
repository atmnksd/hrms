import { NextResponse } from "next/server"

import { createEmployee, listEmployees } from "@/lib/hrms-backend/repository"
import type { Employee } from "@/lib/hrms-backend/types"

export async function GET() {
  const result = await listEmployees()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Omit<Employee, "id">>

  const requiredFields = [
    "fullName",
    "email",
    "role",
    "departmentId",
    "departmentName",
    "manager",
    "employmentType",
    "location",
    "phoneNumber",
    "emergencyContact",
    "compensationBand",
    "payrollBankStatus",
    "status",
    "joiningDate",
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

  const created = await createEmployee(payload as Omit<Employee, "id">)

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
