import { NextResponse } from "next/server"

import { listReviewCycles } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listReviewCycles()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
