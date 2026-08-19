"use client"

import { useRouter } from "next/navigation"
import { startTransition, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { ScreenField } from "@/lib/hrms-data"

type LoginFormProps = {
  primaryAction: string
  secondaryAction?: string
  versionId: string
  fieldDefinitions?: ScreenField[]
}

const demoLoginUsers = [
  "ava.patel@workgrid.example",
  "noah.silva@workgrid.example",
  "arjun.rao@workgrid.example",
] as const

const demoLoginPassword = "Workgrid123!"

type EmployeeOption = {
  id: string
  fullName: string
}

type DepartmentOption = {
  id: string
  name: string
}

type EmployeeEditorFormProps = {
  employeeId?: string
  mode: "create" | "edit"
  primaryAction: string
  secondaryAction?: string
  versionId: string
  fieldDefinitions?: ScreenField[]
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
  fieldDefinitions,
}: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailField = fieldDefinitions?.[0] ?? {
    label: "Work email",
    placeholder: "name@company.com",
  }
  const passwordField = fieldDefinitions?.[1] ?? {
    label: "Password",
    placeholder: "Enter your password",
  }

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
        <span className="font-medium text-slate-700">{emailField.label}</span>
        <input
          className={inputClassName()}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={emailField.placeholder}
          autoComplete="email"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-slate-700">{passwordField.label}</span>
        <input
          className={inputClassName()}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={passwordField.placeholder}
          autoComplete="current-password"
        />
      </label>
      {error ? (
        <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Demo sign-in</p>
        <p className="mt-1">
          Try any seeded user below with password <code>{demoLoginPassword}</code>.
        </p>
        <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
          {demoLoginUsers.map((user) => (
            <code key={user}>{user}</code>
          ))}
        </div>
      </div>
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
  fieldDefinitions,
  initialValues,
}: EmployeeEditorFormProps) {
  const router = useRouter()
  const isCreate = mode === "create"
  const [values, setValues] = useState(
    isCreate
      ? {
          fullName: "",
          email: "",
          role: "",
          departmentName: "",
          manager: "",
          employmentType: "",
          location: "",
          phoneNumber: "",
          emergencyContact: "",
          compensationBand: "",
          payrollBankStatus: "",
          joiningDate: "",
          status: "",
        }
      : initialValues,
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>([])

  useEffect(() => {
    let isActive = true

    async function loadReferences() {
      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          fetch("/api/hrms/employees", { cache: "no-store" }),
          fetch("/api/hrms/departments", { cache: "no-store" }),
        ])

        if (!employeesResponse.ok || !departmentsResponse.ok) {
          throw new Error("Unable to load reference data.")
        }

        const employeesPayload = (await employeesResponse.json()) as {
          data: EmployeeOption[]
        }
        const departmentsPayload = (await departmentsResponse.json()) as {
          data: DepartmentOption[]
        }

        if (!isActive) {
          return
        }

        setEmployeeOptions(employeesPayload.data)
        setDepartmentOptions(departmentsPayload.data)
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load employee references.",
          )
        }
      }
    }

    void loadReferences()

    return () => {
      isActive = false
    }
  }, [])

  function updateField<Key extends keyof typeof initialValues>(
    key: Key,
    value: (typeof initialValues)[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const fieldOrder = isCreate
    ? ([
        "fullName",
        "email",
        "departmentName",
        "role",
        "joiningDate",
        "employmentType",
        "manager",
        "location",
        "phoneNumber",
        "emergencyContact",
        "compensationBand",
        "payrollBankStatus",
        "status",
      ] as const)
    : ([
        "fullName",
        "email",
        "role",
        "departmentName",
        "manager",
        "employmentType",
        "location",
        "phoneNumber",
        "emergencyContact",
        "compensationBand",
        "payrollBankStatus",
        "joiningDate",
        "status",
      ] as const)

  const fallbackFieldMeta = {
    fullName: { label: "Full name", placeholder: "Enter full legal name" },
    email: { label: "Work email", placeholder: "Enter corporate email" },
    role: { label: "Role", placeholder: "Enter role" },
    departmentName: { label: "Department", placeholder: "Select department" },
    manager: { label: "Manager", placeholder: "Select manager" },
    employmentType: {
      label: "Employment type",
      placeholder: "Select employment type",
    },
    location: { label: "Location", placeholder: "Enter location" },
    phoneNumber: { label: "Phone number", placeholder: "Enter phone number" },
    emergencyContact: {
      label: "Emergency contact",
      placeholder: "Enter emergency contact",
    },
    compensationBand: {
      label: "Compensation band",
      placeholder: "Enter compensation band",
    },
    payrollBankStatus: {
      label: "Payroll bank status",
      placeholder: "Select payroll bank status",
    },
    joiningDate: { label: "Joining date", placeholder: "Select joining date" },
    status: { label: "Status", placeholder: "Select status" },
  } satisfies Record<
    keyof typeof initialValues,
    { label: string; placeholder: string }
  >

  const fieldMeta = Object.fromEntries(
    fieldOrder.map((key, index) => [
      key,
      {
        label: fieldDefinitions?.[index]?.label ?? fallbackFieldMeta[key].label,
        placeholder:
          fieldDefinitions?.[index]?.placeholder ?? fallbackFieldMeta[key].placeholder,
      },
    ]),
  ) as Record<keyof typeof initialValues, { label: string; placeholder: string }>

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
          <span className="font-medium text-slate-700">{fieldMeta.fullName.label}</span>
          <input
            className={inputClassName()}
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder={isCreate ? fieldMeta.fullName.placeholder : initialValues.fullName}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.email.label}</span>
          <input
            className={inputClassName()}
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={isCreate ? fieldMeta.email.placeholder : initialValues.email}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.role.label}</span>
          <input
            className={inputClassName()}
            value={values.role}
            onChange={(event) => updateField("role", event.target.value)}
            placeholder={isCreate ? fieldMeta.role.placeholder : initialValues.role}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.departmentName.label}</span>
          <select
            className={inputClassName()}
            value={values.departmentName}
            onChange={(event) => updateField("departmentName", event.target.value)}
          >
            <option value="" disabled>
              {isCreate ? fieldMeta.departmentName.placeholder : initialValues.departmentName}
            </option>
            {departmentOptions.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.manager.label}</span>
          <select
            className={inputClassName()}
            value={values.manager}
            onChange={(event) => updateField("manager", event.target.value)}
          >
            <option value="" disabled>
              {isCreate ? fieldMeta.manager.placeholder : initialValues.manager}
            </option>
            {employeeOptions
              .filter((employee) => employee.fullName !== values.fullName)
              .map((employee) => (
                <option key={employee.id} value={employee.fullName}>
                  {employee.fullName}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.employmentType.label}</span>
          <select
            className={inputClassName()}
            value={values.employmentType}
            onChange={(event) => updateField("employmentType", event.target.value)}
          >
            <option value="" disabled>
              {fieldMeta.employmentType.placeholder}
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.location.label}</span>
          <input
            className={inputClassName()}
            value={values.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder={isCreate ? fieldMeta.location.placeholder : initialValues.location}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.phoneNumber.label}</span>
          <input
            className={inputClassName()}
            value={values.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            placeholder={
              isCreate ? fieldMeta.phoneNumber.placeholder : initialValues.phoneNumber
            }
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">
            {fieldMeta.emergencyContact.label}
          </span>
          <input
            className={inputClassName()}
            value={values.emergencyContact}
            onChange={(event) => updateField("emergencyContact", event.target.value)}
            placeholder={
              isCreate
                ? fieldMeta.emergencyContact.placeholder
                : initialValues.emergencyContact
            }
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">
            {fieldMeta.compensationBand.label}
          </span>
          <input
            className={inputClassName()}
            value={values.compensationBand}
            onChange={(event) => updateField("compensationBand", event.target.value)}
            placeholder={
              isCreate
                ? fieldMeta.compensationBand.placeholder
                : initialValues.compensationBand
            }
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">
            {fieldMeta.payrollBankStatus.label}
          </span>
          <select
            className={inputClassName()}
            value={values.payrollBankStatus}
            onChange={(event) => updateField("payrollBankStatus", event.target.value)}
          >
            <option value="" disabled>
              {fieldMeta.payrollBankStatus.placeholder}
            </option>
            <option value="Verified">Verified</option>
            <option value="Mismatch">Mismatch</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.joiningDate.label}</span>
          <input
            className={inputClassName()}
            type="date"
            value={values.joiningDate}
            onChange={(event) => updateField("joiningDate", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{fieldMeta.status.label}</span>
          <select
            className={inputClassName()}
            value={values.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="" disabled>
              {fieldMeta.status.placeholder}
            </option>
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
