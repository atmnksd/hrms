import { renderHrmsPage } from "@/lib/hrms-page-renderer"

export const dynamic = "force-dynamic"

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ version: string; employeeId: string }>
}) {
  return renderHrmsPage(params, "employeeEdit")
}
