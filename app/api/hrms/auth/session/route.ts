import { NextResponse } from "next/server"

import { getHrmsSession, HRMS_SESSION_COOKIE } from "@/lib/hrms-auth"

export async function GET() {
  const session = await getHrmsSession()

  return NextResponse.json({
    data: session,
  })
}

export async function DELETE() {
  const response = NextResponse.json({
    ok: true,
  })

  response.cookies.set(HRMS_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
