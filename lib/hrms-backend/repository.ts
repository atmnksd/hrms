import { randomUUID } from "node:crypto"

import type {
  AdminTask as PrismaAdminTask,
  AttendanceEntry as PrismaAttendanceEntry,
  AttendanceSignal as PrismaAttendanceSignal,
  DashboardTask as PrismaDashboardTask,
  Department as PrismaDepartment,
  DocumentEvent as PrismaDocumentEvent,
  Employee as PrismaEmployee,
  LeaveRequest as PrismaLeaveRequest,
  NotificationEvent as PrismaNotificationEvent,
  PayrollIssue as PrismaPayrollIssue,
  Prisma,
  ReviewCycle as PrismaReviewCycle,
  SettingsGroup as PrismaSettingsGroup,
} from "@prisma/client"
import { compare } from "bcryptjs"

import { prisma } from "@/lib/prisma"
import type {
  AdminTask,
  AttendanceEntry,
  AttendanceSignal,
  DashboardSummary,
  DashboardTask,
  Department,
  DepartmentOrgNode,
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

const DEFAULT_EMPLOYEE_PASSWORD_HASH =
  "$2b$10$rR3wCFZBchGJ.b/mF1JHquHPAUX6M.8nrnHHjKsGDAlf8Ddq4qM3m"

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

function mapAttendanceEntry(record: PrismaAttendanceEntry): AttendanceEntry {
  return {
    id: record.id,
    employeeName: record.employeeName,
    workDate: toIsoDate(record.workDate),
    status: record.status,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    workMode: record.workMode,
    notes: record.notes,
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

async function syncDepartmentEmployeeCounts(departmentIds?: string[]) {
  const departments = departmentIds?.length
    ? await prisma.department.findMany({
        where: {
          id: {
            in: departmentIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      })
    : await prisma.department.findMany({
        select: {
          id: true,
          name: true,
        },
      })

  await Promise.all(
    departments.map(async (department) => {
      const employeeCount = await prisma.employee.count({
        where: {
          OR: [
            { departmentId: department.id },
            { departmentName: department.name },
          ],
        },
      })

      await prisma.department.update({
        where: {
          id: department.id,
        },
        data: {
          employeeCount,
        },
      })
    }),
  )
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
  const data: Prisma.EmployeeUncheckedCreateInput = {
    fullName: input.fullName,
    email: input.email.toLowerCase(),
    passwordHash: DEFAULT_EMPLOYEE_PASSWORD_HASH,
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
  }

  const record = await prisma.employee.create({
    data,
  })

  await syncDepartmentEmployeeCounts([record.departmentId])

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

  await syncDepartmentEmployeeCounts([
    existing.departmentId,
    record.departmentId,
  ])

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

export async function createDepartment(
  input: Omit<Department, "employeeCount">,
): Promise<RepositoryResult<Department>> {
  const record = await prisma.department.create({
    data: {
      id: input.id,
      name: input.name,
      lead: input.lead,
      budgetStatus: input.budgetStatus,
      employeeCount: 0,
      openRoles: input.openRoles,
    },
  })

  await syncDepartmentEmployeeCounts([record.id])

  const refreshed = await prisma.department.findUniqueOrThrow({
    where: { id: record.id },
  })

  return wrapResult(mapDepartment(refreshed))
}

export async function updateDepartment(
  departmentId: string,
  patch: Partial<Omit<Department, "id" | "employeeCount">> & {
    employeeCount?: number
  },
): Promise<RepositoryResult<Department | null>> {
  const existing = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  })

  if (!existing) {
    return wrapResult(null)
  }

  const record = await prisma.department.update({
    where: {
      id: departmentId,
    },
    data: {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.lead !== undefined ? { lead: patch.lead } : {}),
      ...(patch.budgetStatus !== undefined
        ? { budgetStatus: patch.budgetStatus }
        : {}),
      ...(patch.openRoles !== undefined ? { openRoles: patch.openRoles } : {}),
      ...(patch.employeeCount !== undefined
        ? { employeeCount: patch.employeeCount }
        : {}),
    },
  })

  await syncDepartmentEmployeeCounts([record.id])

  return wrapResult(mapDepartment(record))
}

export async function listDepartmentOrgNodes(): Promise<
  RepositoryResult<DepartmentOrgNode[]>
> {
  const [departments, employees] = await Promise.all([
    prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.employee.findMany({
      orderBy: {
        fullName: "asc",
      },
    }),
  ])

  const nodes = departments.map((department) => {
    const departmentEmployees = employees.filter(
      (employee) =>
        employee.departmentId === department.id ||
        employee.departmentName === department.name,
    )

    const leadRecord =
      departmentEmployees.find((employee) => employee.fullName === department.lead) ?? null

    const directReports = leadRecord
      ? departmentEmployees
          .filter((employee) => employee.manager === leadRecord.fullName)
          .map((employee) => employee.fullName)
      : departmentEmployees
          .filter((employee) => employee.fullName !== department.lead)
          .slice(0, 6)
          .map((employee) => employee.fullName)

    return {
      id: department.id,
      name: department.name,
      lead: department.lead,
      employeeCount: departmentEmployees.length,
      directReports,
    }
  })

  return wrapResult(nodes)
}

export async function listLeaveRequests() {
  const records = await prisma.leaveRequest.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapLeaveRequest))
}

export async function createLeaveRequest(
  input: Omit<LeaveRequest, "id">,
): Promise<RepositoryResult<LeaveRequest>> {
  const record = await prisma.leaveRequest.create({
    data: {
      id: `leave-${randomUUID().slice(0, 8)}`,
      employeeName: input.employeeName,
      leaveType: input.leaveType,
      dateRange: input.dateRange,
      status: input.status,
    },
  })

  return wrapResult(mapLeaveRequest(record))
}

export async function updateLeaveRequest(
  requestId: string,
  patch: Partial<Omit<LeaveRequest, "id">>,
): Promise<RepositoryResult<LeaveRequest | null>> {
  const existing = await prisma.leaveRequest.findUnique({
    where: {
      id: requestId,
    },
  })

  if (!existing) {
    return wrapResult(null)
  }

  const record = await prisma.leaveRequest.update({
    where: {
      id: requestId,
    },
    data: {
      ...(patch.employeeName !== undefined
        ? { employeeName: patch.employeeName }
        : {}),
      ...(patch.leaveType !== undefined ? { leaveType: patch.leaveType } : {}),
      ...(patch.dateRange !== undefined ? { dateRange: patch.dateRange } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
    },
  })

  return wrapResult(mapLeaveRequest(record))
}

export async function listAttendanceSignals() {
  const records = await prisma.attendanceSignal.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return wrapResult(records.map(mapAttendanceSignal))
}

export async function listAttendanceEntries() {
  const records = await prisma.attendanceEntry.findMany({
    orderBy: [
      {
        workDate: "desc",
      },
      {
        employeeName: "asc",
      },
    ],
  })

  return wrapResult(records.map(mapAttendanceEntry))
}

export async function createAttendanceEntry(
  input: Omit<AttendanceEntry, "id">,
): Promise<RepositoryResult<AttendanceEntry>> {
  const record = await prisma.attendanceEntry.create({
    data: {
      id: `att-entry-${randomUUID().slice(0, 8)}`,
      employeeName: input.employeeName,
      workDate: new Date(input.workDate),
      status: input.status,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      workMode: input.workMode,
      notes: input.notes,
    },
  })

  return wrapResult(mapAttendanceEntry(record))
}

export async function updateAttendanceEntry(
  entryId: string,
  patch: Partial<Omit<AttendanceEntry, "id">>,
): Promise<RepositoryResult<AttendanceEntry | null>> {
  const existing = await prisma.attendanceEntry.findUnique({
    where: {
      id: entryId,
    },
  })

  if (!existing) {
    return wrapResult(null)
  }

  const record = await prisma.attendanceEntry.update({
    where: {
      id: entryId,
    },
    data: {
      ...(patch.employeeName !== undefined
        ? { employeeName: patch.employeeName }
        : {}),
      ...(patch.workDate !== undefined ? { workDate: new Date(patch.workDate) } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.checkIn !== undefined ? { checkIn: patch.checkIn } : {}),
      ...(patch.checkOut !== undefined ? { checkOut: patch.checkOut } : {}),
      ...(patch.workMode !== undefined ? { workMode: patch.workMode } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    },
  })

  return wrapResult(mapAttendanceEntry(record))
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
      select: {
        id: true,
        fullName: true,
        email: true,
        passwordHash: true,
        role: true,
        departmentId: true,
        departmentName: true,
        manager: true,
        employmentType: true,
        location: true,
        phoneNumber: true,
        emergencyContact: true,
        compensationBand: true,
        payrollBankStatus: true,
        status: true,
        joiningDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ])

  const user = record ? mapEmployee(record) : null
  const passwordMatches =
    record !== null &&
    payload.password.length >= 8 &&
    (await compare(payload.password, record.passwordHash))

  if (employeeCount === 0) {
    return wrapResult({
      ok: false,
      message: "HRMS database has no users yet. Run the seed step for this environment.",
    })
  }

  if (!passwordMatches || !user) {
    return wrapResult({
      ok: false,
      message: "Invalid email or password.",
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
