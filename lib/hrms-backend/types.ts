export type EmployeeStatus = "Active" | "Probation" | "Remote" | "On Leave"

export type Employee = {
  id: string
  fullName: string
  email: string
  role: string
  departmentId: string
  departmentName: string
  manager: string
  employmentType: string
  location: string
  phoneNumber: string
  emergencyContact: string
  compensationBand: string
  payrollBankStatus: string
  status: EmployeeStatus
  joiningDate: string
}

export type Department = {
  id: string
  name: string
  lead: string
  budgetStatus: string
  employeeCount: number
  openRoles: number
}

export type LeaveRequest = {
  id: string
  employeeName: string
  leaveType: string
  dateRange: string
  status: string
}

export type AttendanceSignal = {
  id: string
  title: string
  summary: string
}

export type PayrollIssue = {
  id: string
  employeeName: string
  issue: string
  owner: string
  priority: string
}

export type ReviewCycle = {
  id: string
  title: string
  meta: string
  status: string
}

export type DocumentEvent = {
  id: string
  title: string
  meta: string
  status: string
}

export type NotificationEvent = {
  id: string
  title: string
  meta: string
  status: string
}

export type SettingsGroup = {
  id: string
  name: string
  description: string
}

export type AdminTask = {
  id: string
  title: string
  description: string
}

export type DashboardTask = {
  id: string
  employeeName: string
  task: string
  owner: string
  status: string
}

export type DashboardSummary = {
  headcount: number
  openRequests: number
  payrollReadyPercent: number
  attendanceRate: number
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResult = {
  ok: boolean
  user?: {
    employeeId: string
    fullName: string
    role: string
  }
  message: string
}

export type RepositorySource = "seed" | "postgres"

export type RepositoryResult<T> = {
  data: T
  source: RepositorySource
}
