import { renderHrmsPage } from "@/lib/hrms-page-renderer"

export const dynamic = "force-dynamic"

export default function DepartmentsPage({
  params,
}: {
  params: Promise<{ version: string }>
}) {
  return renderHrmsPage(params, "departments")
}
