"use client"

import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"

import { Button } from "@/components/ui/button"

type LoginFormProps = {
  primaryAction: string
  secondaryAction?: string
  versionId: string
}

type EmployeeEditorFormProps = {
  employeeId?: string
  mode: "create" | "edit"
  primaryAction: string
  secondaryAction?: string
  versionId: string
  initialValues: {
    fullName: string
    email: string
    role: string
    departmentName: string
    manager: string
    employmentType: string
    location: string
    phoneNumber: string
    emergencyContact: string
    compensationBand: string
    payrollBankStatus: string
    joiningDate: string
    status: string
  }
}

function inputClassName() {
  return "h-11 rounded-[1rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
}

export function LoginForm({
  primaryAction,
  secondaryAction,
  versionId,
}: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("ava.patel@workgrid.example")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const response = await fetch("/api/hrms/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const raw = await response.text()
    let payload: {
      error?: string
      data?: { ok: boolean; message: string }
    }

    try {
      payload = (raw ? JSON.parse(raw) : {}) as {
        error?: string
        data?: { ok: boolean; message: string }
      }
    } catch {
      payload = {
        error: "The server returned an unreadable response.",
      }
    }

    if (!response.ok || !payload.data?.ok) {
      setError(payload.error ?? payload.data?.message ?? "Login failed")
      setIsSubmitting(false)
      return
    }

    startTransition(() => {
      router.replace(`/${versionId}`)
      router.refresh()
    })
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-slate-700">Work email</span>
        <input
          className={inputClassName()}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
          autoComplete="email"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-slate-700">Password</span>
        <input
          className={inputClassName()}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </label>
      {error ? (
        <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full px-4" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : primaryAction}
        </Button>
        {secondaryAction ? (
          <Button className="rounded-full px-4" type="button" variant="outline">
            {secondaryAction}
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export function EmployeeEditorForm({
  employeeId,
  mode,
  primaryAction,
  secondaryAction,
  versionId,
  initialValues,
}: EmployeeEditorFormProps) {
  const router = useRouter()
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof typeof initialValues>(
    key: Key,
    value: (typeof initialValues)[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...values,
      departmentId: slugFromDepartment(values.departmentName),
    }

    const response = await fetch(
      mode === "create"
        ? "/api/hrms/employees"
        : `/api/hrms/employees/${employeeId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    )

    const result = (await response.json()) as {
      error?: string
      data?: { id: string }
    }

    if (!response.ok || !result.data) {
      setError(result.error ?? "Unable to save employee")
      setIsSubmitting(false)
      return
    }

    const nextEmployeeId = result.data.id

    startTransition(() => {
      router.replace(`/${versionId}/employees/${nextEmployeeId}`)
      router.refresh()
    })
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Full name</span>
          <input
            className={inputClassName()}
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Enter full legal name"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Work email</span>
          <input
            className={inputClassName()}
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter corporate email"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Role</span>
          <input
            className={inputClassName()}
            value={values.role}
            onChange={(event) => updateField("role", event.target.value)}
            placeholder="Enter role"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Department</span>
          <input
            className={inputClassName()}
            value={values.departmentName}
            onChange={(event) => updateField("departmentName", event.target.value)}
            placeholder="Enter department"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Manager</span>
          <input
            className={inputClassName()}
            value={values.manager}
            onChange={(event) => updateField("manager", event.target.value)}
            placeholder="Enter manager"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Employment type</span>
          <select
            className={inputClassName()}
            value={values.employmentType}
            onChange={(event) => updateField("employmentType", event.target.value)}
          >
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Location</span>
          <input
            className={inputClassName()}
            value={values.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Enter location"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Phone number</span>
          <input
            className={inputClassName()}
            value={values.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            placeholder="Enter phone number"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Emergency contact</span>
          <input
            className={inputClassName()}
            value={values.emergencyContact}
            onChange={(event) => updateField("emergencyContact", event.target.value)}
            placeholder="Enter emergency contact"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Compensation band</span>
          <input
            className={inputClassName()}
            value={values.compensationBand}
            onChange={(event) => updateField("compensationBand", event.target.value)}
            placeholder="Enter compensation band"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Payroll bank status</span>
          <select
            className={inputClassName()}
            value={values.payrollBankStatus}
            onChange={(event) => updateField("payrollBankStatus", event.target.value)}
          >
            <option value="Verified">Verified</option>
            <option value="Mismatch">Mismatch</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Joining date</span>
          <input
            className={inputClassName()}
            type="date"
            value={values.joiningDate}
            onChange={(event) => updateField("joiningDate", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Status</span>
          <select
            className={inputClassName()}
            value={values.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="Remote">Remote</option>
            <option value="On Leave">On Leave</option>
          </select>
        </label>
      </div>
      {error ? (
        <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full px-4" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : primaryAction}
        </Button>
        {secondaryAction ? (
          <Button className="rounded-full px-4" type="button" variant="outline">
            {secondaryAction}
          </Button>
        ) : null}
      </div>
    </form>
  )
}

function slugFromDepartment(value: string) {
  return `dept-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}
