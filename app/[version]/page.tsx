import { notFound, redirect } from "next/navigation"

import { getHrmsSession } from "@/lib/hrms-auth"
import { isVersionId } from "@/lib/hrms-data"

export default async function VersionHomePage({
  params,
}: {
  params: Promise<{ version: string }>
}) {
  const { version } = await params

  if (!isVersionId(version)) {
    notFound()
  }

  const session = await getHrmsSession()

  redirect(`/${version}/${session ? "dashboard" : "login"}`)
}
