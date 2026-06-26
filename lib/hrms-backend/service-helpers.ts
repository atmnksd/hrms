import {
  getDashboardSummary as loadDashboardSummary,
  getEmployeeById as loadEmployeeById,
  listAdminTasks as loadAdminTasks,
  listAttendanceSignals as loadAttendanceSignals,
  listDashboardTasks as loadDashboardTasks,
  listDepartments as loadDepartments,
  listDocumentEvents as loadDocumentEvents,
  listEmployees as loadEmployees,
  listLeaveRequests as loadLeaveRequests,
  listNotificationEvents as loadNotificationEvents,
  listPayrollIssues as loadPayrollIssues,
  listReviewCycles as loadReviewCycles,
  listSettingsGroups as loadSettingsGroups,
} from "@/lib/hrms-backend/repository"
import type { ScreenRuntimeContext } from "@/lib/hrms-backend/service"
import type { RepositorySource } from "@/lib/hrms-backend/types"
import type { ScreenDefinition } from "@/lib/hrms-data"

type ScreenRuntimePayload = {
  screen: ScreenDefinition
  backend: {
    source: RepositorySource
    label: string
  }
}

function backendLabel(source: RepositorySource) {
  void source
  return "PostgreSQL data"
}

export async function buildDashboardScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const [summary, tasks] = await Promise.all([
    loadDashboardSummary(),
    loadDashboardTasks(),
  ])

  return {
    screen: {
      ...screen,
      kpis: [
        {
          label: "Headcount",
          value: String(summary.data.headcount),
          delta: "Live workforce count",
        },
        {
          label: "Open Requests",
          value: String(summary.data.openRequests),
          delta: "Pulled from active HR queues",
        },
        {
          label: "Payroll Ready",
          value: `${summary.data.payrollReadyPercent}%`,
          delta: "Derived from bank verification status",
        },
        {
          label: "Attendance Rate",
          value: `${summary.data.attendanceRate}%`,
          delta: "Calculated from current attendance signals",
        },
      ],
      table: {
        title: "Live operations queue",
        columns: ["Employee", "Task", "Owner", "Status"],
        rows: tasks.data.map((task) => [
          task.employeeName,
          task.task,
          task.owner,
          task.status,
        ]),
      },
    },
    backend: {
      source: summary.source,
      label: backendLabel(summary.source),
    },
  }
}

export async function buildEmployeeDirectoryScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const employees = await loadEmployees()

  return {
    screen: {
      ...screen,
      kpis: [
        {
          label: "Active employees",
          value: String(
            employees.data.filter((employee) => employee.status === "Active").length,
          ),
          delta: "Status = Active",
        },
        {
          label: "Remote",
          value: String(
            employees.data.filter((employee) => employee.status === "Remote").length,
          ),
          delta: "Status = Remote",
        },
        {
          label: "Probation",
          value: String(
            employees.data.filter((employee) => employee.status === "Probation").length,
          ),
          delta: "New joiners under review",
        },
        {
          label: "Bank mismatches",
          value: String(
            employees.data.filter(
              (employee) => employee.payrollBankStatus !== "Verified",
            ).length,
          ),
          delta: "Potential payroll blockers",
        },
      ],
      table: {
        title: "Employee directory API result",
        columns: ["Employee", "Role", "Department", "Status"],
        rows: employees.data.map((employee) => [
          employee.fullName,
          employee.role,
          employee.departmentName,
          employee.status,
        ]),
      },
    },
    backend: {
      source: employees.source,
      label: backendLabel(employees.source),
    },
  }
}

export async function buildEmployeeProfileScreen(
  screen: ScreenDefinition,
  context: ScreenRuntimeContext,
): Promise<ScreenRuntimePayload> {
  const fallbackEmployees = await loadEmployees()
  const employeeId = context.employeeId ?? fallbackEmployees.data[0]?.id
  const employee = employeeId ? await loadEmployeeById(employeeId) : null

  if (!employee?.data) {
    return {
      screen,
      backend: {
        source: "postgres",
        label: "No employee selected",
      },
    }
  }

  return {
    screen: {
      ...screen,
      fields: [
        { label: "Employee", placeholder: employee.data.fullName },
        { label: "Department", placeholder: employee.data.departmentName },
        { label: "Manager", placeholder: employee.data.manager },
        { label: "Employment type", placeholder: employee.data.employmentType },
        { label: "Location", placeholder: employee.data.location },
        { label: "Compensation band", placeholder: employee.data.compensationBand },
      ],
      cards: [
        {
          title: "Contact",
          description: `${employee.data.email} • ${employee.data.phoneNumber}`,
        },
        {
          title: "Payroll status",
          description: `Bank verification: ${employee.data.payrollBankStatus}`,
        },
      ],
    },
    backend: {
      source: employee.source,
      label: backendLabel(employee.source),
    },
  }
}

export async function buildEmployeeEditScreen(
  screen: ScreenDefinition,
  context: ScreenRuntimeContext,
): Promise<ScreenRuntimePayload> {
  const fallbackEmployees = await loadEmployees()
  const employeeId = context.employeeId ?? fallbackEmployees.data[0]?.id
  const employee = employeeId ? await loadEmployeeById(employeeId) : null

  if (!employee?.data) {
    return {
      screen,
      backend: {
        source: "postgres",
        label: "No employee selected",
      },
    }
  }

  return {
    screen: {
      ...screen,
      fields: [
        { label: "Full name", placeholder: employee.data.fullName },
        { label: "Work email", placeholder: employee.data.email },
        { label: "Role", placeholder: employee.data.role },
        { label: "Department", placeholder: employee.data.departmentName },
        { label: "Manager", placeholder: employee.data.manager },
        {
          label: "Employment type",
          placeholder: employee.data.employmentType,
        },
        { label: "Location", placeholder: employee.data.location },
        { label: "Phone number", placeholder: employee.data.phoneNumber },
        {
          label: "Emergency contact",
          placeholder: employee.data.emergencyContact,
        },
        {
          label: "Compensation band",
          placeholder: employee.data.compensationBand,
        },
        {
          label: "Bank status",
          placeholder: employee.data.payrollBankStatus,
        },
        {
          label: "Joining date",
          placeholder: employee.data.joiningDate,
        },
        { label: "Status", placeholder: employee.data.status },
      ],
    },
    backend: {
      source: employee.source,
      label: backendLabel(employee.source),
    },
  }
}

export async function buildDepartmentOverviewScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const departments = await loadDepartments()

  return {
    screen: {
      ...screen,
      cards: departments.data.map((department) => ({
        title: department.name,
        description: `${department.employeeCount} employees • Lead: ${department.lead} • ${department.budgetStatus}`,
      })),
    },
    backend: {
      source: departments.source,
      label: backendLabel(departments.source),
    },
  }
}

export async function buildLeaveManagementScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const leaveRequests = await loadLeaveRequests()

  return {
    screen: {
      ...screen,
      table: {
        title: "Leave request API queue",
        columns: ["Employee", "Leave type", "Dates", "Status"],
        rows: leaveRequests.data.map((request) => [
          request.employeeName,
          request.leaveType,
          request.dateRange,
          request.status,
        ]),
      },
    },
    backend: {
      source: leaveRequests.source,
      label: backendLabel(leaveRequests.source),
    },
  }
}

export async function buildAttendanceScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const attendance = await loadAttendanceSignals()

  return {
    screen: {
      ...screen,
      cards: attendance.data.map((signal) => ({
        title: signal.title,
        description: signal.summary,
      })),
    },
    backend: {
      source: attendance.source,
      label: backendLabel(attendance.source),
    },
  }
}

export async function buildPayrollScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const payroll = await loadPayrollIssues()

  return {
    screen: {
      ...screen,
      table: {
        title: "Payroll exception API queue",
        columns: ["Employee", "Issue", "Owner", "Priority"],
        rows: payroll.data.map((issue) => [
          issue.employeeName,
          issue.issue,
          issue.owner,
          issue.priority,
        ]),
      },
    },
    backend: {
      source: payroll.source,
      label: backendLabel(payroll.source),
    },
  }
}

export async function buildPerformanceReviewsScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const reviews = await loadReviewCycles()

  return {
    screen: {
      ...screen,
      feed: reviews.data.map((review) => ({
        title: review.title,
        meta: review.meta,
        status: review.status,
      })),
    },
    backend: {
      source: reviews.source,
      label: backendLabel(reviews.source),
    },
  }
}

export async function buildDocumentsScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const documents = await loadDocumentEvents()

  return {
    screen: {
      ...screen,
      feed: documents.data.map((item) => ({
        title: item.title,
        meta: item.meta,
        status: item.status,
      })),
    },
    backend: {
      source: documents.source,
      label: backendLabel(documents.source),
    },
  }
}

export async function buildNotificationsScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const notifications = await loadNotificationEvents()

  return {
    screen: {
      ...screen,
      feed: notifications.data.map((item) => ({
        title: item.title,
        meta: item.meta,
        status: item.status,
      })),
    },
    backend: {
      source: notifications.source,
      label: backendLabel(notifications.source),
    },
  }
}

export async function buildSettingsScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const settings = await loadSettingsGroups()

  return {
    screen: {
      ...screen,
      cards: settings.data.map((group) => ({
        title: group.name,
        description: group.description,
      })),
    },
    backend: {
      source: settings.source,
      label: backendLabel(settings.source),
    },
  }
}

export async function buildAdminConsoleScreen(
  screen: ScreenDefinition,
): Promise<ScreenRuntimePayload> {
  const admin = await loadAdminTasks()

  return {
    screen: {
      ...screen,
      cards: admin.data.map((task) => ({
        title: task.title,
        description: task.description,
      })),
    },
    backend: {
      source: admin.source,
      label: backendLabel(admin.source),
    },
  }
}
