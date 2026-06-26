import {
  buildAdminConsoleScreen,
  buildAttendanceScreen,
  buildDashboardScreen,
  buildDepartmentOverviewScreen,
  buildDocumentsScreen,
  buildEmployeeDirectoryScreen,
  buildEmployeeEditScreen,
  buildEmployeeProfileScreen,
  buildLeaveManagementScreen,
  buildNotificationsScreen,
  buildPayrollScreen,
  buildPerformanceReviewsScreen,
  buildSettingsScreen,
} from "@/lib/hrms-backend/service-helpers"
import type { RepositorySource } from "@/lib/hrms-backend/types"
import type {
  ScreenDefinition,
  ScreenKey,
  VersionDefinition,
} from "@/lib/hrms-data"

export type ScreenRuntimePayload = {
  screen: ScreenDefinition
  backend: {
    source: RepositorySource
    label: string
  }
}

export type ScreenRuntimeContext = {
  employeeId?: string
}

export async function buildScreenRuntimePayload(
  screenKey: ScreenKey,
  version: VersionDefinition,
  context: ScreenRuntimeContext = {},
): Promise<ScreenRuntimePayload> {
  const baseScreen = version.screens[screenKey]

  switch (screenKey) {
    case "dashboard":
      return buildDashboardScreen(baseScreen)
    case "employeesList":
      return buildEmployeeDirectoryScreen(baseScreen)
    case "employeeDetails":
      return buildEmployeeProfileScreen(baseScreen, context)
    case "employeeEdit":
      return buildEmployeeEditScreen(baseScreen, context)
    case "departments":
      return buildDepartmentOverviewScreen(baseScreen)
    case "leaveManagement":
      return buildLeaveManagementScreen(baseScreen)
    case "attendance":
      return buildAttendanceScreen(baseScreen)
    case "payroll":
      return buildPayrollScreen(baseScreen)
    case "performanceReviews":
      return buildPerformanceReviewsScreen(baseScreen)
    case "documents":
      return buildDocumentsScreen(baseScreen)
    case "notifications":
      return buildNotificationsScreen(baseScreen)
    case "settings":
      return buildSettingsScreen(baseScreen)
    case "admin":
      return buildAdminConsoleScreen(baseScreen)
    default:
      return {
        screen: baseScreen,
        backend: {
          source: "postgres",
          label: "PostgreSQL data",
        },
      }
  }
}
