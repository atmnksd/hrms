import { NextResponse } from "next/server"

import { listNotificationEvents } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listNotificationEvents()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
