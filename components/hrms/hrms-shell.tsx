import Link from "next/link"
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  ClipboardList,
  CreditCard,
  Command,
  FileText,
  Home,
  LogIn,
  PencilLine,
  Settings2,
  Shield,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  EmployeeEditorForm,
  LoginForm,
} from "@/components/hrms/hrms-forms"
import {
  AttendanceWorkspace,
  DepartmentsWorkspace,
  LeaveManagementWorkspace,
} from "@/components/hrms/hrms-module-workspaces"
import { HrmsSignOutButton } from "@/components/hrms/hrms-session-actions"
import {
  type Kpi,
  type ScreenDefinition,
  type ScreenField,
  type ScreenKey,
  type VersionDefinition,
  getPathForScreen,
} from "@/lib/hrms-data"
import { cn } from "@/lib/utils"

const navIcons = {
  dashboard: Home,
  login: LogIn,
  employeesList: Users,
  employeeDetails: BriefcaseBusiness,
  employeeAdd: UserPlus,
  employeeEdit: PencilLine,
  departments: Building2,
  leaveManagement: CalendarCheck2,
  attendance: ClipboardList,
  payroll: CreditCard,
  performanceReviews: Sparkles,
  documents: FileText,
  notifications: Bell,
  settings: Settings2,
  admin: Shield,
} satisfies Record<ScreenKey, React.ComponentType<{ className?: string }>>

type HrmsShellProps = {
  currentVersion: VersionDefinition
  currentScreen: ScreenDefinition
  currentScreenKey: ScreenKey
  routeContext?: {
    employeeId?: string
  }
  session?: {
    employeeId: string
    fullName: string
    role: string
  } | null
}

const employeeDirectoryMap = {
  "Ava Patel": "emp-001",
  "Noah Silva": "emp-002",
  "Mia Shah": "emp-003",
  "Liam Wong": "emp-004",
} as const

export function HrmsShell({
  currentVersion,
  currentScreen,
  currentScreenKey,
  routeContext,
  session,
}: HrmsShellProps) {
  if (!session && currentScreenKey === "login") {
    return <LoginWorkspace currentScreen={currentScreen} version={currentVersion} />
  }

  const breadcrumbs = getBreadcrumbs(currentScreenKey, currentScreen, currentVersion.id)
  const primaryHref = getPrimaryActionHref(currentScreenKey, currentVersion.id, routeContext)
  const secondaryHref = getSecondaryActionHref(currentScreenKey, currentVersion.id)
  const initials = getInitials(session?.fullName ?? "Guest User")

  return (
    <main className={cn("min-h-svh bg-slate-100", currentVersion.theme.page)}>
      <TooltipProvider>
        <SidebarProvider defaultOpen>
          <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="px-3 py-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Command className="size-4" />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    PeopleGrid HRMS
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="truncate">Acme Workforce</span>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span>Production</span>
                  </div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarMenu>
                  {currentVersion.navigation.map((itemKey) => {
                    const screen = currentVersion.screens[itemKey]

                    if (!screen) {
                      return null
                    }

                    const Icon = navIcons[itemKey]
                    const isCurrent = itemKey === currentScreenKey

                    return (
                      <SidebarMenuItem key={itemKey}>
                        <SidebarMenuButton
                          asChild
                          isActive={isCurrent}
                          className={cn(
                            "h-auto rounded-2xl px-3 py-3 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
                            isCurrent
                              ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] hover:bg-slate-950 hover:text-white"
                              : "text-slate-700 hover:bg-slate-100",
                          )}
                          tooltip={screen.navLabel}
                        >
                          <Link
                            href={`/${currentVersion.id}/${getPathForScreen(itemKey)}`}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={cn(
                                "flex size-9 items-center justify-center rounded-xl",
                                isCurrent ? "bg-white/10" : "bg-slate-100",
                              )}
                            >
                              <Icon className="size-4 shrink-0" />
                            </div>
                            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                              <p className="truncate text-sm font-medium">{screen.navLabel}</p>
                              <p
                                className={cn(
                                  "truncate text-xs",
                                  isCurrent ? "text-white/65" : "text-slate-500",
                                )}
                              >
                                {screen.navHint}
                              </p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <Separator className="mb-3" />
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {session?.fullName ?? "Guest User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {session?.role ?? "Unauthenticated"}
                  </p>
                </div>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <HrmsSignOutButton versionId={currentVersion.id} />
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent md:shadow-none">
            <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
              <Card className="rounded-[30px] border-slate-200 bg-white">
                <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-100" />
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        People Operations
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-slate-950">
                          Workgrid HRMS
                        </h1>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          Production
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 justify-end">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <Avatar className="size-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {session?.fullName ?? "Guest User"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {session?.role ?? "Unauthenticated"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <section className="flex min-w-0 flex-col gap-5">
                <Card className="rounded-[30px] border-slate-200 bg-white">
                  <CardContent className="flex flex-col gap-5 p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          {breadcrumbs.map((item, index) => (
                            <div key={item.label} className="flex items-center gap-2">
                              {index > 0 ? <ArrowRight className="size-3.5" /> : null}
                              {item.href ? (
                                <Link href={item.href} className="hover:text-slate-900">
                                  {item.label}
                                </Link>
                              ) : (
                                <span className="text-slate-900">{item.label}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {currentScreen.eyebrow}
                          </p>
                          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                            {currentScreen.title}
                          </h2>
                          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                            {currentScreen.description}
                          </p>
                        </div>
                      </div>

                      <Card className="min-w-[280px] rounded-3xl border-slate-200 bg-slate-50 shadow-none">
                        <CardContent className="grid gap-3 p-4">
                          <div className="rounded-2xl bg-white px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              Signed in as
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {session?.fullName ?? "Guest User"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {session?.role ?? "Unauthenticated"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[30px] border-slate-200 bg-white">
                  <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {primaryHref ? (
                        <Button className="rounded-full px-4" variant="secondary" asChild>
                          <Link href={primaryHref}>{currentScreen.primaryAction}</Link>
                        </Button>
                      ) : null}
                      {currentScreen.secondaryAction ? (
                        secondaryHref ? (
                          <Button className="rounded-full px-4" variant="outline" asChild>
                            <Link href={secondaryHref}>{currentScreen.secondaryAction}</Link>
                          </Button>
                        ) : null
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                {currentScreen.kpis?.length ? (
                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {currentScreen.kpis.map((kpi) => (
                      <KpiCard
                        key={kpi.label}
                        kpi={kpi}
                        className={currentVersion.theme.card}
                      />
                    ))}
                  </section>
                ) : null}

                <section className="flex min-w-0 flex-col gap-5">
                  <PrimaryContent
                    screenKey={currentScreenKey}
                    screen={currentScreen}
                    version={currentVersion}
                    routeContext={routeContext}
                  />
                </section>
              </section>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </main>
  )
}

function LoginWorkspace({
  currentScreen,
  version,
}: {
  currentScreen: ScreenDefinition
  version: VersionDefinition
}) {
  return (
    <main className={cn("min-h-svh px-4 py-4 sm:px-6 sm:py-6", version.theme.page)}>
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section
          className={cn(
            "relative overflow-hidden rounded-[2.4rem] border p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]",
            version.theme.hero,
          )}
        >
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-[1.15rem] bg-white/15 backdrop-blur">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                    HRMS workspace
                  </p>
                  <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">
                    Workgrid People Platform
                  </h1>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  Secure sign-in
                </p>
                <h2 className="max-w-xl font-[family-name:var(--font-heading)] text-4xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
                  People operations, payroll, and workforce actions in one system.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                  Access employee records, approval queues, attendance signals, compensation workflows, and policy operations from a single workspace.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Employee records",
                  value: "Profiles",
                  meta: "Access workforce profiles, reporting lines, and core employment data.",
                },
                {
                  label: "Approvals",
                  value: "Workflows",
                  meta: "Complete leave, onboarding, and payroll actions from the same workspace.",
                },
                {
                  label: "Payroll",
                  value: "Controls",
                  meta: "Review compensation records, bank details, and monthly processing tasks.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {item.label}
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-white/70">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className={cn(
            "flex items-center rounded-[2.4rem] border p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8",
            version.theme.panel,
          )}
        >
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/55">
                {currentScreen.eyebrow}
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] text-current sm:text-4xl">
                {currentScreen.title}
              </h2>
              <p className="text-sm leading-7 text-current/72 sm:text-base">
                {currentScreen.description}
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-current/10 bg-black/5 p-5">
              <LoginForm
                primaryAction={currentScreen.primaryAction}
                secondaryAction={currentScreen.secondaryAction}
                versionId={version.id}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Role-based access for People Ops, managers, payroll, and administrators.",
                "Single entry point into dashboard, employee records, and operational workflows.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-current/10 bg-black/5 px-4 py-3 text-sm leading-6 text-current/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function KpiCard({ kpi, className }: { kpi: Kpi; className: string }) {
  return (
    <article className={cn("rounded-[1.75rem] border p-5", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/55">
        {kpi.label}
      </p>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">
        {kpi.value}
      </p>
      <p className="mt-2 text-sm text-current/70">{kpi.delta}</p>
    </article>
  )
}

function PrimaryContent({
  screenKey,
  screen,
  version,
  routeContext,
}: {
  screenKey: ScreenKey
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  switch (screenKey) {
    case "dashboard":
      return <DashboardScreen screen={screen} version={version} routeContext={routeContext} />
    case "login":
      return <LoginPanel screen={screen} version={version} />
    case "employeesList":
      return <EmployeeDirectoryScreen screen={screen} version={version} routeContext={routeContext} />
    case "employeeDetails":
      return <EmployeeProfileScreen screen={screen} version={version} routeContext={routeContext} />
    case "employeeAdd":
      return <EmployeeCreateScreen screen={screen} version={version} />
    case "employeeEdit":
      return <EmployeeEditScreen screen={screen} version={version} routeContext={routeContext} />
    case "departments":
      return <DepartmentsScreen screen={screen} version={version} />
    case "leaveManagement":
      return <LeaveManagementScreen screen={screen} version={version} />
    case "attendance":
      return <AttendanceScreen screen={screen} version={version} />
    case "payroll":
      return <PayrollScreen screen={screen} version={version} />
    case "performanceReviews":
      return <PerformanceReviewsScreen screen={screen} version={version} />
    case "documents":
      return <DocumentsScreen screen={screen} version={version} />
    case "notifications":
      return <NotificationsScreen screen={screen} version={version} />
    case "settings":
      return <SettingsScreen screen={screen} version={version} />
    case "admin":
      return <AdminConsoleScreen screen={screen} version={version} />
    default:
      return <ProductScreenFallback screen={screen} version={version} />
  }
}

function DashboardScreen({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  return (
    <>
      <EmployeeOperationsTable screen={screen} version={version} routeContext={routeContext} />
    </>
  )
}

function EmployeeOperationsTable({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  const table = screen.table

  if (!table) {
    return null
  }

  return (
    <SurfaceCard title={table.title} version={version}>
      <div className="overflow-hidden rounded-[1.35rem] border border-current/10">
        <div className="grid grid-cols-[1.1fr_repeat(3,minmax(0,1fr))] bg-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-current/55">
          {table.columns.map((column) => (
            <div key={column}>{column}</div>
          ))}
        </div>
        <div className="divide-y divide-current/10">
          {table.rows.map((row, rowIndex) => (
            <div
              key={`${row[0]}-${rowIndex}`}
              className="grid grid-cols-[1.1fr_repeat(3,minmax(0,1fr))] gap-3 px-4 py-4 text-sm text-current/80 transition hover:bg-black/5"
            >
              {row.map((cell, cellIndex) => {
                if (cellIndex === 0 && screen.navLabel.toLowerCase().includes("employee")) {
                  const employeeId =
                    employeeDirectoryMap[cell as keyof typeof employeeDirectoryMap] ??
                    routeContext?.employeeId ??
                    "emp-001"

                  return (
                    <div key={`${cell}-${cellIndex}`}>
                      <Link
                        href={`/${version.id}/${getPathForScreen("employeeDetails", { employeeId })}`}
                        className="font-medium text-current hover:underline"
                      >
                        {cell}
                      </Link>
                    </div>
                  )
                }

                return <div key={`${cell}-${cellIndex}`}>{cell}</div>
              })}
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  )
}

function ProfilePanel({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  const employeeId = routeContext?.employeeId ?? "emp-001"

  return (
    <>
      <SurfaceCard title="Employee dossier" version={version}>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button className="rounded-full px-4" variant="secondary" asChild>
            <Link
              href={`/${version.id}/${getPathForScreen("employeeEdit", {
                employeeId,
              })}`}
            >
              Open profile edit
            </Link>
          </Button>
          <Button className="rounded-full px-4" variant="outline" asChild>
            <Link href={`/${version.id}/${getPathForScreen("employeesList")}`}>
              Back to directory
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {(screen.fields ?? []).map((field) => (
            <FieldBlock key={field.label} field={field} />
          ))}
        </div>
      </SurfaceCard>
    </>
  )
}

function EmployeeDirectoryScreen({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  return <EmployeeOperationsTable screen={screen} version={version} routeContext={routeContext} />
}

function EmployeeProfileScreen({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  return <ProfilePanel screen={screen} version={version} routeContext={routeContext} />
}

function EmployeeCreateScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <FormPanel screen={screen} version={version} />
}

function EmployeeEditScreen({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  return <FormPanel screen={screen} version={version} routeContext={routeContext} />
}

function DepartmentsScreen({
  screen: _screen,
  version: _version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  void _screen
  void _version
  return <DepartmentsWorkspace />
}

function LeaveManagementScreen({
  screen: _screen,
  version: _version,
  routeContext: _routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  void _screen
  void _version
  void _routeContext
  return <LeaveManagementWorkspace />
}

function AttendanceScreen({
  screen: _screen,
  version: _version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  void _screen
  void _version
  return <AttendanceWorkspace />
}

function PayrollScreen({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  return <EmployeeOperationsTable screen={screen} version={version} routeContext={routeContext} />
}

function PerformanceReviewsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <OverviewPanel screen={screen} version={version} />
}

function DocumentsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <OverviewPanel screen={screen} version={version} />
}

function NotificationsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <OverviewPanel screen={screen} version={version} />
}

function SettingsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <OverviewPanel screen={screen} version={version} />
}

function AdminConsoleScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <OverviewPanel screen={screen} version={version} />
}

function ProductScreenFallback({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  switch (screen.kind) {
    case "login":
      return <LoginPanel screen={screen} version={version} />
    case "profile":
      return <ProfilePanel screen={screen} version={version} />
    case "form":
      return <FormPanel screen={screen} version={version} />
    case "cards":
      return <OverviewPanel screen={screen} version={version} />
    case "feed":
      return <OverviewPanel screen={screen} version={version} />
    case "table":
      return <EmployeeOperationsTable screen={screen} version={version} />
    default:
      return <DashboardScreen screen={screen} version={version} />
  }
}

function FormPanel({
  screen,
  version,
  routeContext,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
  routeContext?: { employeeId?: string }
}) {
  const returnHref =
    routeContext?.employeeId && screen.navLabel.toLowerCase().includes("edit")
      ? `/${version.id}/${getPathForScreen("employeeDetails", {
          employeeId: routeContext.employeeId,
        })}`
      : `/${version.id}/${getPathForScreen("employeesList")}`

  return (
    <SurfaceCard title={screen.formTitle ?? "Form workspace"} version={version}>
      <EmployeeEditorForm
        employeeId={routeContext?.employeeId}
        initialValues={buildEmployeeFormInitialValues(screen, routeContext)}
        mode={routeContext?.employeeId ? "edit" : "create"}
        primaryAction={screen.primaryAction}
        secondaryAction={screen.secondaryAction}
        versionId={version.id}
      />
      <div className="mt-4">
        <Button className="rounded-full px-4" variant="ghost" asChild>
          <Link href={returnHref}>Return to directory</Link>
        </Button>
      </div>
    </SurfaceCard>
  )
}

function OverviewPanel({
  screen: _screen,
  version: _version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  void _screen
  void _version
  return null
}

function LoginPanel({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return (
    <SurfaceCard title="Access portal" version={version}>
      <LoginForm
        primaryAction={screen.primaryAction}
        secondaryAction={screen.secondaryAction}
        versionId={version.id}
      />
    </SurfaceCard>
  )
}

function getBreadcrumbs(
  screenKey: ScreenKey,
  screen: ScreenDefinition,
  versionId: VersionDefinition["id"],
) {
  const items: Array<{ label: string; href?: string }> = [
    { label: "Home", href: `/${versionId}/dashboard` },
  ]

  if (
    screenKey === "employeeDetails" ||
    screenKey === "employeeAdd" ||
    screenKey === "employeeEdit"
  ) {
    items.push({ label: "Employees", href: `/${versionId}/${getPathForScreen("employeesList")}` })
  }

  items.push({ label: screen.navLabel })

  return items
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function getPrimaryActionHref(
  screenKey: ScreenKey,
  versionId: VersionDefinition["id"],
  routeContext?: { employeeId?: string },
) {
  const employeeId = routeContext?.employeeId ?? "emp-001"
  switch (screenKey) {
    case "employeesList":
      return `/${versionId}/${getPathForScreen("employeeAdd")}`
    case "employeeDetails":
      return `/${versionId}/${getPathForScreen("employeeEdit", { employeeId })}`
    case "employeeEdit":
      return `/${versionId}/${getPathForScreen("employeeDetails", { employeeId })}`
    default:
      return null
  }
}

function getSecondaryActionHref(
  screenKey: ScreenKey,
  versionId: VersionDefinition["id"],
) {
  switch (screenKey) {
    case "employeeDetails":
    case "employeeAdd":
    case "employeeEdit":
      return `/${versionId}/${getPathForScreen("employeesList")}`
    default:
      return null
  }
}

function SurfaceCard({
  title,
  version,
  children,
}: {
  title: string
  version: VersionDefinition
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
        version.theme.panel,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-current">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function FieldBlock({ field }: { field: ScreenField }) {
  return (
    <div className="rounded-[1.25rem] border border-current/10 bg-black/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-current/55">
        {field.label}
      </p>
      <p className="mt-2 text-sm text-current/80">{field.placeholder}</p>
      {field.helper ? (
        <p className="mt-1 text-xs text-current/55">{field.helper}</p>
      ) : null}
    </div>
  )
}

function buildEmployeeFormInitialValues(
  screen: ScreenDefinition,
  routeContext?: { employeeId?: string },
) {
  const values = Object.fromEntries(
    (screen.fields ?? []).map((field) => [field.label, field.placeholder]),
  ) as Record<string, string>

  const isEdit = Boolean(routeContext?.employeeId)

  return {
    fullName: values["Full name"] ?? values["Employee"] ?? "",
    email: values["Work email"] ?? "new.employee@workgrid.example",
    role: values["Role"] ?? "People Operations Specialist",
    departmentName: values["Department"] ?? "People Operations",
    manager: values["Manager"] ?? "Grace Chen",
    employmentType: values["Employment type"] ?? "Full-time",
    location: values["Location"] ?? "Bengaluru",
    phoneNumber: values["Phone number"] ?? "+91 90000 00000",
    emergencyContact: values["Emergency contact"] ?? "Primary Contact",
    compensationBand: values["Compensation band"] ?? "P2",
    payrollBankStatus: values["Bank status"] ?? "Verified",
    joiningDate: isEdit ? "2024-03-11" : "2026-07-01",
    status: "Active",
  }
}
