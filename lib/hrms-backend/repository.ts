import type {
  AdminTask as PrismaAdminTask,
  AttendanceSignal as PrismaAttendanceSignal,
  DashboardTask as PrismaDashboardTask,
  Department as PrismaDepartment,
  DocumentEvent as PrismaDocumentEvent,
  Employee as PrismaEmployee,
  LeaveRequest as PrismaLeaveRequest,
  NotificationEvent as PrismaNotificationEvent,
  PayrollIssue as PrismaPayrollIssue,
  ReviewCycle as PrismaReviewCycle,
  SettingsGroup as PrismaSettingsGroup,
} from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type {
  AdminTask,
  AttendanceSignal,
  DashboardSummary,
  DashboardTask,
  Department,
  DocumentEvent,
  Employee,
  LeaveRequest,
  LoginPayload,
  LoginResult,
  NotificationEvent,
  PayrollIssue,
  RepositoryResult,
  ReviewCycle,
  SettingsGroup,
} from "@/lib/hrms-backend/types"

function wrapResult<T>(data: T): RepositoryResult<T> {
  return {
    data,
    source: "postgres",
  }
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

function mapEmployee(record: PrismaEmployee): Employee {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    role: record.role,
    departmentId: record.departmentId,
    departmentName: record.departmentName,
    manager: record.manager,
    employmentType: record.employmentType,
    location: record.location,
    phoneNumber: record.phoneNumber,
    emergencyContact: record.emergencyContact,
    compensationBand: record.compensationBand,
    payrollBankStatus: record.payrollBankStatus,
    status: record.status as Employee["status"],
    joiningDate: toIsoDate(record.joiningDate),
  }
}

function mapDepartment(record: PrismaDepartment): Department {
  return {
    id: record.id,
    name: record.name,
    lead: record.lead,
    budgetStatus: record.budgetStatus,
    employeeCount: record.employeeCount,
    openRoles: record.openRoles,
  }
}

function mapLeaveRequest(record: PrismaLeaveRequest): LeaveRequest {
  return {
    id: record.id,
    employeeName: record.employeeName,
    leaveType: record.leaveType,
    dateRange: record.dateRange,
    status: record.status,
  }
}

function mapAttendanceSignal(record: PrismaAttendanceSignal): AttendanceSignal {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
  }
}

function mapPayrollIssue(record: PrismaPayrollIssue): PayrollIssue {
  return {
    id: record.id,
    employeeName: record.employeeName,
    issue: record.issue,
    owner: record.owner,
    priority: record.priority,
  }
}

function mapReviewCycle(record: PrismaReviewCycle): ReviewCycle {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapDocumentEvent(record: PrismaDocumentEvent): DocumentEvent {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapNotificationEvent(record: PrismaNotificationEvent): NotificationEvent {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapSettingsGroup(record: PrismaSettingsGroup): SettingsGroup {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
  }
}

function mapAdminTask(record: PrismaAdminTask): AdminTask {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
  }
}

function mapDashboardTask(record: PrismaDashboardTask): DashboardTask {
  return {
    id: record.id,
    employeeName: record.employeeName,
    task: record.task,
    owner: record.owner,
    status: record.status,
  }
}

export async function listEmployees() {
  const records = await prisma.employee.findMany({
    orderBy: {
      fullName: "asc",
    },
  })

  return wrapResult(records.map(mapEmployee))
}

export async function getEmployeeById(employeeId: string) {
  const record = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  })

  return wrapResult(record ? mapEmployee(record) : null)
}

export async function createEmployee(
  input: Omit<Employee, "id">,
): Promise<RepositoryResult<Employee>> {
  const record = await prisma.employee.create({
    data: {
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      role: input.role,
      departmentId: input.departmentId,
      departmentName: input.departmentName,
      manager: input.manager,
      employmentType: input.employmentType,
      location: input.location,
      phoneNumber: input.phoneNumber,
      emergencyContact: input.emergencyContact,
      compensationBand: input.compensationBand,
      payrollBankStatus: input.payrollBankStatus,
      status: input.status,
      joiningDate: new Date(input.joiningDate),
    },
  })

  return wrapResult(mapEmployee(record))
}

export async function updateEmployee(
  employeeId: string,
  patch: Partial<Omit<Employee, "id">>,
): Promise<RepositoryResult<Employee | null>> {
  const existing = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  })

  if (!existing) {
    return wrapResult(null)
  }

  const record = await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      ...(patch.fullName !== undefined ? { fullName: patch.fullName } : {}),
      ...(patch.email !== undefined ? { email: patch.email.toLowerCase() } : {}),
      ...(patch.role !== undefined ? { role: patch.role } : {}),
      ...(patch.departmentId !== undefined
        ? { departmentId: patch.departmentId }
        : {}),
      ...(patch.departmentName !== undefined
        ? { departmentName: patch.departmentName }
        : {}),
      ...(patch.manager !== undefined ? { manager: patch.manager } : {}),
      ...(patch.employmentType !== undefined
        ? { employmentType: patch.employmentType }
        : {}),
      ...(patch.location !== undefined ? { location: patch.location } : {}),
      ...(patch.phoneNumber !== undefined
        ? { phoneNumber: patch.phoneNumber }
        : {}),
      ...(patch.emergencyContact !== undefined
        ? { emergencyContact: patch.emergencyContact }
        : {}),
      ...(patch.compensationBand !== undefined
        ? { compensationBand: patch.compensationBand }
        : {}),
      ...(patch.payrollBankStatus !== undefined
        ? { payrollBankStatus: patch.payrollBankStatus }
        : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.joiningDate !== undefined
        ? { joiningDate: new Date(patch.joiningDate) }
        : {}),
    },
  })

  return wrapResult(mapEmployee(record))
}

export async function listDepartments() {
  const records = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return wrapResult(records.map(mapDepartment))
}

export async function listLeaveRequests() {
  const records = await prisma.leaveRequest.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapLeaveRequest))
}

export async function listAttendanceSignals() {
  const records = await prisma.attendanceSignal.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapAttendanceSignal))
}

export async function listPayrollIssues() {
  const records = await prisma.payrollIssue.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapPayrollIssue))
}

export async function listReviewCycles() {
  const records = await prisma.reviewCycle.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapReviewCycle))
}

export async function listDocumentEvents() {
  const records = await prisma.documentEvent.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapDocumentEvent))
}

export async function listNotificationEvents() {
  const records = await prisma.notificationEvent.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapNotificationEvent))
}

export async function listSettingsGroups() {
  const records = await prisma.settingsGroup.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return wrapResult(records.map(mapSettingsGroup))
}

export async function listAdminTasks() {
  const records = await prisma.adminTask.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapAdminTask))
}

export async function listDashboardTasks() {
  const records = await prisma.dashboardTask.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapDashboardTask))
}

export async function getDashboardSummary() {
  const [headcount, openRequests, verifiedPayroll, remoteCount] = await Promise.all([
    prisma.employee.count(),
    prisma.leaveRequest.count({
      where: {
        status: {
          not: "Approved",
        },
      },
    }),
    prisma.employee.count({
      where: {
        payrollBankStatus: "Verified",
      },
    }),
    prisma.employee.count({
      where: {
        status: "Remote",
      },
    }),
  ])

  const summary: DashboardSummary = {
    headcount,
    openRequests,
    payrollReadyPercent:
      headcount === 0 ? 0 : Math.round((verifiedPayroll / headcount) * 100),
    attendanceRate:
      headcount === 0
        ? 0
        : Number(
            ((((headcount - remoteCount * 0.2) / headcount) * 100).toFixed(1)),
          ),
  }

  return wrapResult(summary)
}

export async function attemptLogin(
  payload: LoginPayload,
): Promise<RepositoryResult<LoginResult>> {
  const normalizedEmail = payload.email.toLowerCase()

  const [employeeCount, record] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.findUnique({
      where: {
        email: normalizedEmail,
      },
    }),
  ])

  const user = record ? mapEmployee(record) : null
  const ok = Boolean(user) && payload.password.length >= 8

  if (employeeCount === 0) {
    return wrapResult({
      ok: false,
      message: "HRMS database has no users yet. Run the seed step for this environment.",
    })
  }

  if (!ok || !user) {
    return wrapResult({
      ok: false,
      message: "Invalid credentials for the sample HRMS workspace",
    })
  }

  return wrapResult({
    ok: true,
    user: {
      employeeId: user.id,
      fullName: user.fullName,
      role: user.role,
    },
    message: "Login successful",
  })
}
