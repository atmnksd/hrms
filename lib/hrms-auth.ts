import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

import { getEmployeeById } from "@/lib/hrms-backend/repository"

export const HRMS_SESSION_COOKIE = "hrms_session"

const SESSION_DURATION_SECONDS = 60 * 60 * 8

export type HrmsSession = {
  employeeId: string
  fullName: string
  role: string
}

type SessionPayload = {
  employeeId: string
}

function getJwtSecret() {
  const secret = process.env.HRMS_JWT_SECRET

  if (!secret) {
    throw new Error("HRMS_JWT_SECRET is required for secure HRMS sessions.")
  }

  return new TextEncoder().encode(secret)
}

export async function createHrmsSessionToken(session: HrmsSession) {
  return new SignJWT({ employeeId: session.employeeId } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.employeeId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret())
}

async function readSessionPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get(HRMS_SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, getJwtSecret())
    const payload = verified.payload as SessionPayload & { sub?: string }

    return payload
  } catch {
    return null
  }
}

export async function getHrmsSession(): Promise<HrmsSession | null> {
  const payload = await readSessionPayload()
  const employeeId = payload?.employeeId ?? payload?.sub

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

export function getHrmsSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  }
}
