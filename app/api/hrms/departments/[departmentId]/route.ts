import { NextResponse } from "next/server"

import { updateDepartment } from "@/lib/hrms-backend/repository"
import type { Department } from "@/lib/hrms-backend/types"

type RouteParams = {
  departmentId: string
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  const { departmentId } = await params
  const payload = (await request.json()) as Partial<Department>
  const result = await updateDepartment(departmentId, payload)

  if (!result.data) {
    return NextResponse.json({ error: "Department not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })
}
