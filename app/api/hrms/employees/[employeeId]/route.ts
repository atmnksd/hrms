import { NextResponse } from "next/server"

import { getEmployeeById, updateEmployee } from "@/lib/hrms-backend/repository"
import type { Employee } from "@/lib/hrms-backend/types"

type RouteParams = {
  employeeId: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  const { employeeId } = await params
  const result = await getEmployeeById(employeeId)

  if (!result.data) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  const { employeeId } = await params
  const payload = (await request.json()) as Partial<Omit<Employee, "id">>
  const result = await updateEmployee(employeeId, payload)

  if (!result.data) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })
}
