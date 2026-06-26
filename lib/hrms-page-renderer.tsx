import { notFound } from "next/navigation"
import { redirect } from "next/navigation"

import { HrmsShell } from "@/components/hrms/hrms-shell"
import { getHrmsSession } from "@/lib/hrms-auth"
import { buildScreenRuntimePayload } from "@/lib/hrms-backend/service"
import {
  type ScreenKey,
  getVersionDefinition,
  isVersionId,
} from "@/lib/hrms-data"

type HrmsRouteParams = {
  version: string
  employeeId?: string
}

export async function renderHrmsPage(
  paramsPromise: Promise<HrmsRouteParams>,
  screenKey: ScreenKey,
) {
  const params = await paramsPromise

  if (!isVersionId(params.version)) {
    notFound()
  }

  const session = await getHrmsSession()

  if (screenKey === "login") {
    if (session) {
      redirect(`/${params.version}/dashboard`)
    }
  } else if (!session) {
    redirect(`/${params.version}/login`)
  }

  const definition = getVersionDefinition(params.version)
  const payload = await buildScreenRuntimePayload(screenKey, definition, {
    employeeId: params.employeeId,
  })

  return (
    <HrmsShell
      currentVersion={definition}
      currentScreen={payload.screen}
      currentScreenKey={screenKey}
      routeContext={{
        employeeId: params.employeeId,
      }}
      session={session}
    />
  )
}
