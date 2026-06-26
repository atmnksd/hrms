import { NextResponse } from "next/server"

import { HRMS_SESSION_COOKIE } from "@/lib/hrms-auth"
import { attemptLogin } from "@/lib/hrms-backend/repository"
import type { LoginPayload } from "@/lib/hrms-backend/types"

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LoginPayload>

  if (!payload.email || !payload.password) {
    return NextResponse.json(
      {
        error: "Email and password are required",
      },
      { status: 400 },
    )
  }

  const result = await attemptLogin({
    email: payload.email,
    password: payload.password,
  })

  const response = NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
    },
  })

  if (result.data.ok && result.data.user) {
    response.cookies.set(HRMS_SESSION_COOKIE, result.data.user.employeeId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    })
  }

  return response
}
