import { cookies } from "next/headers"

import { getEmployeeById } from "@/lib/hrms-backend/repository"

export const HRMS_SESSION_COOKIE = "hrms_session"

export type HrmsSession = {
  employeeId: string
  fullName: string
  role: string
}

export async function getHrmsSession(): Promise<HrmsSession | null> {
  const cookieStore = await cookies()
  const employeeId = cookieStore.get(HRMS_SESSION_COOKIE)?.value

  if (!employeeId) {
    return null
  }

  const employee = await getEmployeeById(employeeId)

  if (!employee.data) {
    return null
  }

  return {
    employeeId: employee.data.id,
    fullName: employee.data.fullName,
    role: employee.data.role,
  }
}
