import { NextResponse } from "next/server"

import { listDocumentEvents } from "@/lib/hrms-backend/repository"

export async function GET() {
  const result = await listDocumentEvents()

  return NextResponse.json({
    data: result.data,
    meta: {
      source: result.source,
      count: result.data.length,
    },
  })
}
