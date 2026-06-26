import { renderHrmsPage } from "@/lib/hrms-page-renderer"

export const dynamic = "force-dynamic"

export default function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ version: string; employeeId: string }>
}) {
  return renderHrmsPage(params, "employeeDetails")
}
