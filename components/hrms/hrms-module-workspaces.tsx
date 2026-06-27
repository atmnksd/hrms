"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { ScreenDefinition } from "@/lib/hrms-data"

type EmployeeOption = {
  id: string
  fullName: string
}

type Department = {
  id: string
  name: string
  lead: string
  budgetStatus: string
  employeeCount: number
  openRoles: number
}

type DepartmentOrgNode = {
  id: string
  name: string
  lead: string
  employeeCount: number
  directReports: string[]
}

type LeaveRequest = {
  id: string
  employeeName: string
  leaveType: string
  dateRange: string
  status: string
}

type AttendanceEntry = {
  id: string
  employeeName: string
  workDate: string
  status: string
  checkIn: string
  checkOut: string | null
  workMode: string
  notes: string | null
}

function inputClassName() {
  return "h-11 rounded-[1rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
}

function textAreaClassName() {
  return "min-h-24 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
}

function panelClassName() {
  return "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Request failed for ${url}`)
  }

  const payload = (await response.json()) as { data: T }
  return payload.data
}

export function DepartmentsWorkspace({ screen }: { screen: ScreenDefinition }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [orgChart, setOrgChart] = useState<DepartmentOrgNode[]>([])
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const [form, setForm] = useState({
    id: "",
    name: "",
    lead: "",
    budgetStatus: "On track",
    openRoles: "0",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = screen.fields ?? [
    { label: "Department name", placeholder: "People Operations" },
    { label: "Lead", placeholder: "Select department lead" },
    { label: "Budget status", placeholder: "Select budget status" },
    { label: "Open roles", placeholder: "0" },
  ]

  async function loadData() {
    const [departmentsData, orgChartData, employeesData] = await Promise.all([
      fetchJson<Department[]>("/api/hrms/departments"),
      fetchJson<DepartmentOrgNode[]>("/api/hrms/departments/org-chart"),
      fetchJson<EmployeeOption[]>("/api/hrms/employees"),
    ])

    setDepartments(departmentsData)
    setOrgChart(orgChartData)
    setEmployees(employeesData)
  }

  useEffect(() => {
    let isActive = true

    async function bootstrap() {
      try {
        if (isActive) {
          await loadData()
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load departments.",
          )
        }
      }
    }

    void bootstrap()

    return () => {
      isActive = false
    }
  }, [])

  async function submitDepartment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const departmentId = form.id || slugFromName(form.name)
    const response = await fetch(
      editingId ? `/api/hrms/departments/${editingId}` : "/api/hrms/departments",
      {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: departmentId,
          name: form.name,
          lead: form.lead,
          budgetStatus: form.budgetStatus,
          openRoles: Number(form.openRoles),
        }),
      },
    )

    const payload = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(payload.error ?? "Unable to save department.")
      setIsSubmitting(false)
      return
    }

    setForm({
      id: "",
      name: "",
      lead: "",
      budgetStatus: "On track",
      openRoles: "0",
    })
    setEditingId(null)
    await loadData()
    setIsSubmitting(false)
  }

  return (
    <div className="grid gap-5">
      <section className={panelClassName()}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {screen.primaryAction}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {screen.description}
            </p>
          </div>
        </div>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submitDepartment}>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[0]?.label}</span>
            <input
              className={inputClassName()}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder={formFields[0]?.placeholder}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[1]?.label}</span>
            <select
              className={inputClassName()}
              value={form.lead}
              onChange={(event) =>
                setForm((current) => ({ ...current, lead: event.target.value }))
              }
            >
              <option value="" disabled>
                {formFields[1]?.placeholder}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.fullName}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[2]?.label}</span>
            <select
              className={inputClassName()}
              value={form.budgetStatus}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  budgetStatus: event.target.value,
                }))
              }
            >
              <option value="" disabled>
                {formFields[2]?.placeholder}
              </option>
              <option value="On track">On track</option>
              <option value="Needs approval">Needs approval</option>
              <option value="Watchlist">Watchlist</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[3]?.label}</span>
            <input
              className={inputClassName()}
              min="0"
              type="number"
              value={form.openRoles}
              onChange={(event) =>
                setForm((current) => ({ ...current, openRoles: event.target.value }))
              }
            />
          </label>
          <div className="flex items-end gap-2">
            <Button className="rounded-full px-4" disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Update department"
                  : "Create department"}
            </Button>
            {editingId ? (
              <Button
                className="rounded-full px-4"
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setForm({
                    id: "",
                    name: "",
                    lead: "",
                    budgetStatus: "On track",
                    openRoles: "0",
                  })
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
        {error ? (
          <div className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Department records
        </h2>
        <div className="overflow-hidden rounded-[1.35rem] border border-slate-200">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.8fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            <div>Name</div>
            <div>Lead</div>
            <div>Budget</div>
            <div>Employees</div>
            <div>Open roles</div>
            <div>Actions</div>
          </div>
          <div className="divide-y divide-slate-200">
            {departments.map((department) => (
              <div
                key={department.id}
                className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-3 px-4 py-4 text-sm text-slate-700"
              >
                <div className="font-medium text-slate-900">{department.name}</div>
                <div>{department.lead}</div>
                <div>{department.budgetStatus}</div>
                <div>{department.employeeCount}</div>
                <div>{department.openRoles}</div>
                <div>
                  <Button
                    className="rounded-full px-3"
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(department.id)
                      setForm({
                        id: department.id,
                        name: department.name,
                        lead: department.lead,
                        budgetStatus: department.budgetStatus,
                        openRoles: String(department.openRoles),
                      })
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Organization chart
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orgChart.map((node) => (
            <div
              key={node.id}
              className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {node.name}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{node.lead}</p>
              <p className="mt-1 text-sm text-slate-600">
                {node.employeeCount} employees in department
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Direct reports
                </p>
                {node.directReports.length ? (
                  node.directReports.map((report) => (
                    <div
                      key={report}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {report}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                    No direct reports mapped yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function LeaveManagementWorkspace({ screen }: { screen: ScreenDefinition }) {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const [form, setForm] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formFields = screen.fields ?? [
    { label: "Employee", placeholder: "Select employee" },
    { label: "Leave type", placeholder: "Select leave type" },
    { label: "Start date", placeholder: "Select start date" },
    { label: "End date", placeholder: "Select end date" },
  ]

  async function loadData() {
    const [requestsData, employeesData] = await Promise.all([
      fetchJson<LeaveRequest[]>("/api/hrms/leave-requests"),
      fetchJson<EmployeeOption[]>("/api/hrms/employees"),
    ])

    setRequests(requestsData)
    setEmployees(employeesData)
  }

  useEffect(() => {
    let isActive = true

    async function bootstrap() {
      try {
        if (isActive) {
          await loadData()
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load leave requests.",
          )
        }
      }
    }

    void bootstrap()

    return () => {
      isActive = false
    }
  }, [])

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const dateRange =
      form.startDate && form.endDate && form.startDate !== form.endDate
        ? `${form.startDate} to ${form.endDate}`
        : form.startDate

    const response = await fetch("/api/hrms/leave-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeName: form.employeeName,
        leaveType: form.leaveType,
        dateRange,
        status: "Pending manager",
      }),
    })

    const payload = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(payload.error ?? "Unable to create leave request.")
      setIsSubmitting(false)
      return
    }

    setForm((current) => ({
      ...current,
      employeeName: "",
      startDate: "",
      endDate: "",
      leaveType: "",
    }))
    await loadData()
    setIsSubmitting(false)
  }

  async function updateStatus(requestId: string, status: string) {
    setSavingId(requestId)
    const response = await fetch(`/api/hrms/leave-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    const payload = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(payload.error ?? "Unable to update leave request.")
      setSavingId(null)
      return
    }

    await loadData()
    setSavingId(null)
  }

  return (
    <div className="grid gap-5">
      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          {screen.primaryAction}
        </h2>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submitRequest}>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[0]?.label}</span>
            <select
              className={inputClassName()}
              value={form.employeeName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  employeeName: event.target.value,
                }))
              }
            >
              <option value="" disabled>
                {formFields[0]?.placeholder}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.fullName}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[1]?.label}</span>
            <select
              className={inputClassName()}
              value={form.leaveType}
              onChange={(event) =>
                setForm((current) => ({ ...current, leaveType: event.target.value }))
              }
            >
              <option value="" disabled>
                {formFields[1]?.placeholder}
              </option>
              <option value="Annual leave">Annual leave</option>
              <option value="Sick leave">Sick leave</option>
              <option value="Comp-off">Comp-off</option>
              <option value="Work from home">Work from home</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[2]?.label}</span>
            <input
              className={inputClassName()}
              type="date"
              value={form.startDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, startDate: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[3]?.label}</span>
            <input
              className={inputClassName()}
              type="date"
              value={form.endDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, endDate: event.target.value }))
              }
            />
          </label>
          <div className="flex items-end">
            <Button className="rounded-full px-4" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Create request"}
            </Button>
          </div>
        </form>
        {error ? (
          <div className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Leave requests
        </h2>
        <div className="overflow-hidden rounded-[1.35rem] border border-slate-200">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            <div>Employee</div>
            <div>Leave type</div>
            <div>Dates</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-slate-200">
            {requests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-[1.1fr_1fr_1fr_1fr] items-center gap-3 px-4 py-4 text-sm text-slate-700"
              >
                <div className="font-medium text-slate-900">{request.employeeName}</div>
                <div>{request.leaveType}</div>
                <div>{request.dateRange}</div>
                <div>
                  <select
                    className={`${inputClassName()} h-10`}
                    disabled={savingId === request.id}
                    value={request.status}
                    onChange={(event) => updateStatus(request.id, event.target.value)}
                  >
                    <option value="Pending manager">Pending manager</option>
                    <option value="Pending HR">Pending HR</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Policy review">Policy review</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function AttendanceWorkspace({ screen }: { screen: ScreenDefinition }) {
  const [entries, setEntries] = useState<AttendanceEntry[]>([])
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const [form, setForm] = useState({
    employeeName: "",
    workDate: "",
    status: "",
    checkIn: "",
    checkOut: "",
    workMode: "",
    notes: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formFields = screen.fields ?? [
    { label: "Employee", placeholder: "Select employee" },
    { label: "Work date", placeholder: "Select work date" },
    { label: "Status", placeholder: "Select status" },
    { label: "Work mode", placeholder: "Select work mode" },
    { label: "Check in", placeholder: "Set check in time" },
    { label: "Check out", placeholder: "Set check out time" },
    { label: "Notes", placeholder: "Optional attendance notes" },
  ]

  async function loadData() {
    const [entriesData, employeesData] = await Promise.all([
      fetchJson<AttendanceEntry[]>("/api/hrms/attendance"),
      fetchJson<EmployeeOption[]>("/api/hrms/employees"),
    ])

    setEntries(entriesData)
    setEmployees(employeesData)
  }

  useEffect(() => {
    let isActive = true

    async function bootstrap() {
      try {
        if (isActive) {
          await loadData()
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load attendance entries.",
          )
        }
      }
    }

    void bootstrap()

    return () => {
      isActive = false
    }
  }, [])

  async function submitEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const response = await fetch("/api/hrms/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeName: form.employeeName,
        workDate: form.workDate,
        status: form.status,
        checkIn: form.checkIn,
        checkOut: form.checkOut || null,
        workMode: form.workMode,
        notes: form.notes || null,
      }),
    })

    const payload = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(payload.error ?? "Unable to create attendance entry.")
      setIsSubmitting(false)
      return
    }

    setForm((current) => ({
      ...current,
      employeeName: "",
      workDate: "",
      status: "",
      checkIn: "",
      checkOut: "",
      workMode: "",
      notes: "",
    }))
    await loadData()
    setIsSubmitting(false)
  }

  async function updateEntry(
    entryId: string,
    patch: Partial<AttendanceEntry>,
  ) {
    setSavingId(entryId)
    const response = await fetch(`/api/hrms/attendance/${entryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    })

    const payload = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(payload.error ?? "Unable to update attendance entry.")
      setSavingId(null)
      return
    }

    await loadData()
    setSavingId(null)
  }

  return (
    <div className="grid gap-5">
      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          {screen.primaryAction}
        </h2>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={submitEntry}>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[0]?.label}</span>
            <select
              className={inputClassName()}
              value={form.employeeName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  employeeName: event.target.value,
                }))
              }
            >
              <option value="" disabled>
                {formFields[0]?.placeholder}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.fullName}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[1]?.label}</span>
            <input
              className={inputClassName()}
              type="date"
              value={form.workDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, workDate: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[2]?.label}</span>
            <select
              className={inputClassName()}
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
            >
              <option value="" disabled>
                {formFields[2]?.placeholder}
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="On Leave">On Leave</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[3]?.label}</span>
            <select
              className={inputClassName()}
              value={form.workMode}
              onChange={(event) =>
                setForm((current) => ({ ...current, workMode: event.target.value }))
              }
            >
              <option value="" disabled>
                {formFields[3]?.placeholder}
              </option>
              <option value="Office">Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[4]?.label}</span>
            <input
              className={inputClassName()}
              type="time"
              value={form.checkIn}
              onChange={(event) =>
                setForm((current) => ({ ...current, checkIn: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">{formFields[5]?.label}</span>
            <input
              className={inputClassName()}
              type="time"
              value={form.checkOut}
              onChange={(event) =>
                setForm((current) => ({ ...current, checkOut: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium text-slate-700">{formFields[6]?.label}</span>
            <textarea
              className={textAreaClassName()}
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder={formFields[6]?.placeholder}
            />
          </label>
          <div className="flex items-end">
            <Button className="rounded-full px-4" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Create entry"}
            </Button>
          </div>
        </form>
        {error ? (
          <div className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className={panelClassName()}>
        <h2 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Attendance register
        </h2>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr_0.9fr_1.4fr]"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{entry.employeeName}</p>
                <p className="mt-1 text-xs text-slate-500">{entry.workDate}</p>
              </div>
              <select
                className={`${inputClassName()} h-10`}
                disabled={savingId === entry.id}
                value={entry.status}
                onChange={(event) =>
                  updateEntry(entry.id, { status: event.target.value })
                }
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
              </select>
              <input
                className={`${inputClassName()} h-10`}
                disabled={savingId === entry.id}
                type="time"
                defaultValue={entry.checkIn}
                onBlur={(event) =>
                  updateEntry(entry.id, { checkIn: event.target.value })
                }
              />
              <input
                className={`${inputClassName()} h-10`}
                disabled={savingId === entry.id}
                type="time"
                defaultValue={entry.checkOut ?? ""}
                onBlur={(event) =>
                  updateEntry(entry.id, { checkOut: event.target.value || null })
                }
              />
              <select
                className={`${inputClassName()} h-10`}
                disabled={savingId === entry.id}
                value={entry.workMode}
                onChange={(event) =>
                  updateEntry(entry.id, { workMode: event.target.value })
                }
              >
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <textarea
                className={textAreaClassName()}
                defaultValue={entry.notes ?? ""}
                onBlur={(event) => updateEntry(entry.id, { notes: event.target.value })}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function slugFromName(value: string) {
  return `dept-${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`
}
