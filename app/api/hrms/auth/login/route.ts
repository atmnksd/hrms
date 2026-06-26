import { NextResponse } from "next/server"

import {
  createHrmsSessionToken,
  getHrmsSessionCookieOptions,
  HRMS_SESSION_COOKIE,
} from "@/lib/hrms-auth"
import { attemptLogin } from "@/lib/hrms-backend/repository"
import type { LoginPayload } from "@/lib/hrms-backend/types"

export async function POST(request: Request) {
  try {
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
      const token = await createHrmsSessionToken(result.data.user)

      response.cookies.set(HRMS_SESSION_COOKIE, token, getHrmsSessionCookieOptions())
    }

    return response
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected authentication error."

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    )
  }
}
