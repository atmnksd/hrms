import { Pool } from "pg"

import {
  seedAdminTasks,
  seedAttendanceSignals,
  seedDashboardTasks,
  seedDepartments,
  seedDocumentEvents,
  seedEmployees,
  seedLeaveRequests,
  seedNotificationEvents,
  seedPayrollIssues,
  seedReviewCycles,
  seedSettingsGroups,
} from "@/lib/hrms-backend/seed"
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
  RepositorySource,
  ReviewCycle,
  SettingsGroup,
} from "@/lib/hrms-backend/types"

type SeedStore = {
  employees: Employee[]
  departments: Department[]
  leaveRequests: LeaveRequest[]
  attendanceSignals: AttendanceSignal[]
  payrollIssues: PayrollIssue[]
  reviewCycles: ReviewCycle[]
  documentEvents: DocumentEvent[]
  notificationEvents: NotificationEvent[]
  settingsGroups: SettingsGroup[]
  adminTasks: AdminTask[]
  dashboardTasks: DashboardTask[]
}

declare global {
  var __hrmsSeedStore__: SeedStore | undefined
  var __hrmsPgPool__: Pool | undefined
}

function cloneStore(): SeedStore {
  return {
    employees: structuredClone(seedEmployees),
    departments: structuredClone(seedDepartments),
    leaveRequests: structuredClone(seedLeaveRequests),
    attendanceSignals: structuredClone(seedAttendanceSignals),
    payrollIssues: structuredClone(seedPayrollIssues),
    reviewCycles: structuredClone(seedReviewCycles),
    documentEvents: structuredClone(seedDocumentEvents),
    notificationEvents: structuredClone(seedNotificationEvents),
    settingsGroups: structuredClone(seedSettingsGroups),
    adminTasks: structuredClone(seedAdminTasks),
    dashboardTasks: structuredClone(seedDashboardTasks),
  }
}

function getSeedStore() {
  globalThis.__hrmsSeedStore__ ??= cloneStore()
  return globalThis.__hrmsSeedStore__
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null
  }

  globalThis.__hrmsPgPool__ ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  })

  return globalThis.__hrmsPgPool__
}

async function withPostgresFallback<T>(
  run: (pool: Pool) => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<RepositoryResult<T>> {
  const pool = getPool()

  if (!pool) {
    return { data: await fallback(), source: "seed" }
  }

  try {
    const data = await run(pool)
    return { data, source: "postgres" }
  } catch {
    return { data: await fallback(), source: "seed" }
  }
}

function computeDashboardSummary(store: SeedStore): DashboardSummary {
  const headcount = store.employees.length
  const openRequests = store.leaveRequests.filter(
    (request) => request.status !== "Approved",
  ).length
  const verifiedPayroll = store.employees.filter(
    (employee) => employee.payrollBankStatus === "Verified",
  ).length
  const payrollReadyPercent = Math.round((verifiedPayroll / headcount) * 100)
  const remoteCount = store.employees.filter(
    (employee) => employee.status === "Remote",
  ).length
  const attendanceRate = Number(
    ((headcount - remoteCount * 0.2) / headcount * 100).toFixed(1),
  )

  return {
    headcount,
    openRequests,
    payrollReadyPercent,
    attendanceRate,
  }
}

export async function listEmployees() {
  return withPostgresFallback(
    async (pool) => {
      const result = await pool.query<Employee>(
        `
          select
            id,
            full_name as "fullName",
            email,
            role,
            department_id as "departmentId",
            department_name as "departmentName",
            manager,
            employment_type as "employmentType",
            location,
            phone_number as "phoneNumber",
            emergency_contact as "emergencyContact",
            compensation_band as "compensationBand",
            payroll_bank_status as "payrollBankStatus",
            status,
            joining_date as "joiningDate"
          from employees
          order by full_name asc
        `,
      )

      return result.rows
    },
    () => getSeedStore().employees,
  )
}

export async function getEmployeeById(employeeId: string) {
  return withPostgresFallback(
    async (pool) => {
      const result = await pool.query<Employee>(
        `
          select
            id,
            full_name as "fullName",
            email,
            role,
            department_id as "departmentId",
            department_name as "departmentName",
            manager,
            employment_type as "employmentType",
            location,
            phone_number as "phoneNumber",
            emergency_contact as "emergencyContact",
            compensation_band as "compensationBand",
            payroll_bank_status as "payrollBankStatus",
            status,
            joining_date as "joiningDate"
          from employees
          where id = $1
          limit 1
        `,
        [employeeId],
      )

      return result.rows[0] ?? null
    },
    () => getSeedStore().employees.find((employee) => employee.id === employeeId) ?? null,
  )
}

export async function createEmployee(
  input: Omit<Employee, "id">,
): Promise<RepositoryResult<Employee>> {
  return withPostgresFallback(
    async (pool) => {
      const result = await pool.query<Employee>(
        `
          insert into employees (
            full_name,
            email,
            role,
            department_id,
            department_name,
            manager,
            employment_type,
            location,
            phone_number,
            emergency_contact,
            compensation_band,
            payroll_bank_status,
            status,
            joining_date
          )
          values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
          returning
            id,
            full_name as "fullName",
            email,
            role,
            department_id as "departmentId",
            department_name as "departmentName",
            manager,
            employment_type as "employmentType",
            location,
            phone_number as "phoneNumber",
            emergency_contact as "emergencyContact",
            compensation_band as "compensationBand",
            payroll_bank_status as "payrollBankStatus",
            status,
            joining_date as "joiningDate"
        `,
        [
          input.fullName,
          input.email,
          input.role,
          input.departmentId,
          input.departmentName,
          input.manager,
          input.employmentType,
          input.location,
          input.phoneNumber,
          input.emergencyContact,
          input.compensationBand,
          input.payrollBankStatus,
          input.status,
          input.joiningDate,
        ],
      )

      return result.rows[0]
    },
    () => {
      const store = getSeedStore()
      const employee: Employee = {
        ...input,
        id: `emp-${String(store.employees.length + 1).padStart(3, "0")}`,
      }
      store.employees.unshift(employee)
      return employee
    },
  )
}

export async function updateEmployee(
  employeeId: string,
  patch: Partial<Omit<Employee, "id">>,
): Promise<RepositoryResult<Employee | null>> {
  return withPostgresFallback(
    async (pool) => {
      const existing = await getEmployeeById(employeeId)

      if (!existing.data) {
        return null
      }

      const next = { ...existing.data, ...patch }
      const result = await pool.query<Employee>(
        `
          update employees
          set
            full_name = $2,
            email = $3,
            role = $4,
            department_id = $5,
            department_name = $6,
            manager = $7,
            employment_type = $8,
            location = $9,
            phone_number = $10,
            emergency_contact = $11,
            compensation_band = $12,
            payroll_bank_status = $13,
            status = $14,
            joining_date = $15
          where id = $1
          returning
            id,
            full_name as "fullName",
            email,
            role,
            department_id as "departmentId",
            department_name as "departmentName",
            manager,
            employment_type as "employmentType",
            location,
            phone_number as "phoneNumber",
            emergency_contact as "emergencyContact",
            compensation_band as "compensationBand",
            payroll_bank_status as "payrollBankStatus",
            status,
            joining_date as "joiningDate"
        `,
        [
          employeeId,
          next.fullName,
          next.email,
          next.role,
          next.departmentId,
          next.departmentName,
          next.manager,
          next.employmentType,
          next.location,
          next.phoneNumber,
          next.emergencyContact,
          next.compensationBand,
          next.payrollBankStatus,
          next.status,
          next.joiningDate,
        ],
      )

      return result.rows[0] ?? null
    },
    () => {
      const store = getSeedStore()
      const index = store.employees.findIndex((employee) => employee.id === employeeId)

      if (index === -1) {
        return null
      }

      store.employees[index] = {
        ...store.employees[index],
        ...patch,
      }

      return store.employees[index]
    },
  )
}

export async function listDepartments() {
  return withPostgresFallback(
    async (pool) => {
      const result = await pool.query<Department>(
        `
          select
            id,
            name,
            lead,
            budget_status as "budgetStatus",
            employee_count as "employeeCount",
            open_roles as "openRoles"
          from departments
          order by name asc
        `,
      )

      return result.rows
    },
    () => getSeedStore().departments,
  )
}

export async function listLeaveRequests() {
  return withPostgresFallback(
    async () => getSeedStore().leaveRequests,
    () => getSeedStore().leaveRequests,
  )
}

export async function listAttendanceSignals() {
  return withPostgresFallback(
    async () => getSeedStore().attendanceSignals,
    () => getSeedStore().attendanceSignals,
  )
}

export async function listPayrollIssues() {
  return withPostgresFallback(
    async () => getSeedStore().payrollIssues,
    () => getSeedStore().payrollIssues,
  )
}

export async function listReviewCycles() {
  return withPostgresFallback(
    async () => getSeedStore().reviewCycles,
    () => getSeedStore().reviewCycles,
  )
}

export async function listDocumentEvents() {
  return withPostgresFallback(
    async () => getSeedStore().documentEvents,
    () => getSeedStore().documentEvents,
  )
}

export async function listNotificationEvents() {
  return withPostgresFallback(
    async () => getSeedStore().notificationEvents,
    () => getSeedStore().notificationEvents,
  )
}

export async function listSettingsGroups() {
  return withPostgresFallback(
    async () => getSeedStore().settingsGroups,
    () => getSeedStore().settingsGroups,
  )
}

export async function listAdminTasks() {
  return withPostgresFallback(
    async () => getSeedStore().adminTasks,
    () => getSeedStore().adminTasks,
  )
}

export async function listDashboardTasks() {
  return withPostgresFallback(
    async () => getSeedStore().dashboardTasks,
    () => getSeedStore().dashboardTasks,
  )
}

export async function getDashboardSummary() {
  return withPostgresFallback(
    async () => computeDashboardSummary(getSeedStore()),
    () => computeDashboardSummary(getSeedStore()),
  )
}

export async function attemptLogin(payload: LoginPayload): Promise<RepositoryResult<LoginResult>> {
  const employees = await listEmployees()
  const user = employees.data.find(
    (employee) => employee.email.toLowerCase() === payload.email.toLowerCase(),
  )

  const ok = Boolean(user) && payload.password.length >= 8

  if (!ok || !user) {
    return {
      source: employees.source as RepositorySource,
      data: {
        ok: false,
        message: "Invalid credentials for the sample HRMS workspace",
      },
    }
  }

  return {
    source: employees.source as RepositorySource,
    data: {
      ok: true,
      user: {
        employeeId: user.id,
        fullName: user.fullName,
        role: user.role,
      },
      message: "Login successful",
    },
  }
}
