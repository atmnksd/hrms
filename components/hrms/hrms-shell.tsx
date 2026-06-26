import Link from "next/link"
import {
  ArrowRight,
  Bell,
  BookMarked,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FolderKanban,
  FileText,
  Filter,
  Home,
  LogIn,
  Menu,
  MoreHorizontal,
  PencilLine,
  Search,
  Settings2,
  Shield,
  Sparkles,
  UserCircle2,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  EmployeeEditorForm,
  LoginForm,
} from "@/components/hrms/hrms-forms"
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

const suiteNav = [
  "Workforce",
  "Talent",
  "Compensation",
  "Operations",
  "Analytics",
] as const

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
  const workflowTabs = getWorkflowTabs(currentScreenKey, currentVersion.id, routeContext)
  const primaryHref = getPrimaryActionHref(currentScreenKey, currentVersion.id, routeContext)
  const secondaryHref = getSecondaryActionHref(currentScreenKey, currentVersion.id)
  const utilityStats = getUtilityStats(currentScreenKey)

  return (
    <main className={cn("min-h-svh px-4 py-4 sm:px-6 sm:py-6", currentVersion.theme.page)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section
          className={cn(
            "rounded-[2rem] border px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
            currentVersion.theme.panel,
          )}
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/55">
                  HRMS workspace
                </p>
                <div className="flex items-center gap-3">
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em]">
                    Workgrid People Platform
                  </h2>
                  <span className="rounded-full border border-current/10 bg-black/5 px-2.5 py-1 text-xs text-current/65">
                    Asia Pacific
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-center xl:justify-end">
              <div className="flex flex-1 items-center gap-3 rounded-[1.1rem] border border-current/10 bg-black/5 px-4 py-3 text-sm text-current/50">
                <Search className="size-4 shrink-0" />
                <span>Search people, approvals, payroll issues, or policies</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-[1rem] border border-current/10 bg-black/5 p-3 text-current/70 transition hover:bg-black/10">
                  <Bell className="size-4" />
                </button>
                <button className="rounded-[1rem] border border-current/10 bg-black/5 p-3 text-current/70 transition hover:bg-black/10">
                  <BookMarked className="size-4" />
                </button>
                <div className="flex items-center gap-3 rounded-[1rem] border border-current/10 bg-black/5 px-3 py-2.5">
                  <UserCircle2 className="size-8 text-current/70" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-current/85">
                      {session?.fullName ?? "Guest user"}
                    </p>
                    <p className="truncate text-xs text-current/55">
                      {session?.role ?? "Unauthenticated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {suiteNav.map((item) => (
              <button
                key={item}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  item === "Workforce"
                    ? "bg-slate-950 text-white"
                    : "border border-current/10 bg-black/5 text-current/70 hover:bg-black/10",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section
          className={cn(
            "overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
            currentVersion.theme.hero,
          )}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-current/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
                  Employee lifecycle
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/70">
                  {currentScreen.eyebrow}
                </p>
                <h1 className="font-[family-name:var(--font-heading)] text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
                  {currentScreen.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-current/80 sm:text-base">
                  {currentScreen.description}
                </p>
              </div>
            </div>

            <div className="max-w-md rounded-[1.5rem] border border-current/10 bg-black/10 p-4 text-sm leading-6 text-current/85 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/70">
                Workspace status
              </p>
              <div className="mt-3 grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.15rem] border border-current/10 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-current/60">
                      Region
                    </p>
                    <p className="mt-1 text-sm font-medium text-current/90">
                      APAC South
                    </p>
                  </div>
                  <div className="rounded-[1.15rem] border border-current/10 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-current/60">
                      Service health
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-200">
                      Operational
                    </p>
                  </div>
                </div>
                <div className="rounded-[1.15rem] border border-current/10 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-current/60">
                    Business date
                  </p>
                  <p className="mt-1 text-sm font-medium text-current/90">
                    June 26, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[18.5rem_1fr]">
          <aside
            className={cn(
              "rounded-[2rem] border p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
              currentVersion.theme.sidebar,
            )}
          >
            <div className="rounded-[1.4rem] border border-current/10 bg-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/60">
                  Workspace
                </p>
                <Menu className="size-4 text-current/40" />
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em]">
                {currentVersion.shellLabel}
              </h2>
              <p className="mt-2 text-sm leading-6 text-current/75">
                {currentVersion.shellDescription}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-[1rem] border border-current/10 bg-black/5 px-3 py-2">
                  <p className="text-current/45">Entity</p>
                  <p className="mt-1 font-medium text-current/80">Acme Workforce</p>
                </div>
                <div className="rounded-[1rem] border border-current/10 bg-black/5 px-3 py-2">
                  <p className="text-current/45">Environment</p>
                  <p className="mt-1 font-medium text-current/80">Production</p>
                </div>
              </div>
            </div>

            <nav className="mt-5 grid gap-1">
              {currentVersion.navigation.map((itemKey) => {
                const screen = currentVersion.screens[itemKey]

                if (!screen) {
                  return null
                }

                const Icon = navIcons[itemKey]
                const isCurrent = itemKey === currentScreenKey

                return (
                  <Link
                    key={itemKey}
                    href={`/${currentVersion.id}/${getPathForScreen(itemKey)}`}
                    className={cn(
                      "flex items-center gap-3 rounded-[1.15rem] px-3 py-3 text-sm transition",
                      isCurrent
                        ? "bg-black/85 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                        : "text-current/75 hover:bg-black/5 hover:text-current",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{screen.navLabel}</p>
                      <p
                        className={cn(
                          "truncate text-xs",
                          isCurrent ? "text-white/65" : "text-current/50",
                        )}
                      >
                        {screen.navHint}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-5 rounded-[1.4rem] border border-current/10 bg-black/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/50">
                Team inbox
              </p>
              <div className="mt-3 grid gap-3">
                {utilityStats.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-[1rem] border border-current/10 bg-white/10 px-3 py-2.5"
                  >
                    <span className="text-sm text-current/70">{item.label}</span>
                    <span className="text-sm font-medium text-current/85">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-5">
            <div
              className={cn(
                "rounded-[2rem] border px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
                currentVersion.theme.panel,
              )}
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-current/55">
                    {breadcrumbs.map((item, index) => (
                      <div key={item.label} className="flex items-center gap-2">
                        {index > 0 ? <ArrowRight className="size-3.5" /> : null}
                        {item.href ? (
                          <Link href={item.href} className="hover:text-current">
                            {item.label}
                          </Link>
                        ) : (
                          <span className="text-current/85">{item.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workflowTabs.map((tab) => (
                      <Link
                        key={tab.label}
                        href={tab.href}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm transition",
                          tab.current
                            ? "bg-slate-950 text-white"
                            : "border border-current/10 bg-black/5 text-current/70 hover:bg-black/10 hover:text-current",
                        )}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full border border-current/10 bg-black/5 px-3.5 py-2 text-sm text-current/70 transition hover:bg-black/10 hover:text-current">
                    <Filter className="size-4" />
                    Filters
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-current/10 bg-black/5 px-3.5 py-2 text-sm text-current/70 transition hover:bg-black/10 hover:text-current">
                    <FolderKanban className="size-4" />
                    Saved views
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-current/10 bg-black/5 px-3.5 py-2 text-sm text-current/70 transition hover:bg-black/10 hover:text-current">
                    <MoreHorizontal className="size-4" />
                    More
                  </button>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "rounded-[2rem] border p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
                currentVersion.theme.panel,
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-current/55">
                    Page overview
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-current/80">
                    {getOperationalSummary(currentScreenKey)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getOperationalFlags(currentScreenKey).map((flag) => (
                      <span
                        key={flag}
                        className="rounded-full border border-current/10 bg-black/5 px-3 py-1.5 text-xs font-medium text-current/70"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {primaryHref ? (
                    <Button className="rounded-full px-4" variant="secondary" asChild>
                      <Link href={primaryHref}>{currentScreen.primaryAction}</Link>
                    </Button>
                  ) : (
                    <Button className="rounded-full px-4" variant="secondary">
                      {currentScreen.primaryAction}
                    </Button>
                  )}
                  {currentScreen.secondaryAction ? (
                    secondaryHref ? (
                      <Button className="rounded-full px-4" variant="outline" asChild>
                        <Link href={secondaryHref}>{currentScreen.secondaryAction}</Link>
                      </Button>
                    ) : (
                      <Button className="rounded-full px-4" variant="outline">
                        {currentScreen.secondaryAction}
                      </Button>
                    )
                  ) : null}
                </div>
              </div>
            </div>

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

            <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col gap-5">
                <PrimaryContent
                  screenKey={currentScreenKey}
                  screen={currentScreen}
                  version={currentVersion}
                  routeContext={routeContext}
                />
              </div>
              <div className="flex flex-col gap-5">
                <OperationalChecklistPanel screen={currentScreen} version={currentVersion} />
                <ActivityRailPanel screenKey={currentScreenKey} version={currentVersion} />
              </div>
            </section>
          </section>
        </div>
      </div>
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
                  label: "Workforce records",
                  value: "248",
                  meta: "Active employee profiles",
                },
                {
                  label: "Pending approvals",
                  value: "19",
                  meta: "Leave, onboarding, and payroll actions",
                },
                {
                  label: "Payroll readiness",
                  value: "96%",
                  meta: "Current monthly close status",
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
      <SurfaceCard title="Operations pulse" version={version}>
        <div className="grid gap-3 md:grid-cols-3">
          {(screen.cards ?? []).map((card) => (
            <div
              key={card.title}
              className="rounded-[1.35rem] border border-current/10 bg-black/5 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-current/55">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-current/80">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </SurfaceCard>
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
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-[1rem] border border-current/10 bg-black/5 px-4 py-3 text-sm text-current/45">
          <Search className="size-4 shrink-0" />
          <span>Search records, owners, tags, or workflow states</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-current/10 bg-black/5 px-3 py-2 text-sm text-current/70">
            Status: All
          </button>
          <button className="rounded-full border border-current/10 bg-black/5 px-3 py-2 text-sm text-current/70">
            Department: Any
          </button>
        </div>
      </div>
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
      <CardsPanel screen={screen} version={version} />
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
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <CardsPanel screen={screen} version={version} />
}

function LeaveManagementScreen({
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

function AttendanceScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <CardsPanel screen={screen} version={version} />
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
  return <FeedPanel screen={screen} version={version} />
}

function DocumentsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <FeedPanel screen={screen} version={version} />
}

function NotificationsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <FeedPanel screen={screen} version={version} />
}

function SettingsScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <CardsPanel screen={screen} version={version} />
}

function AdminConsoleScreen({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return <CardsPanel screen={screen} version={version} />
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
      return <CardsPanel screen={screen} version={version} />
    case "feed":
      return <FeedPanel screen={screen} version={version} />
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
      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        {[
          "Identity and employment",
          "Reporting and payroll",
          "Policies and audit trail",
        ].map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-[1rem] border border-current/10 bg-black/5 px-4 py-3 text-sm"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              {index + 1}
            </div>
            <span className="text-current/75">{item}</span>
          </div>
        ))}
      </div>
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

function CardsPanel({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return (
    <SurfaceCard title={screen.cardsTitle ?? "Key sections"} version={version}>
      <div className="grid gap-3 md:grid-cols-2">
        {(screen.cards ?? []).map((card) => (
          <div
            key={card.title}
            className="rounded-[1.35rem] border border-current/10 bg-black/5 p-4"
          >
            <p className="font-medium text-current/90">{card.title}</p>
            <p className="mt-2 text-sm leading-6 text-current/70">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  )
}

function FeedPanel({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return (
    <SurfaceCard title={screen.feedTitle ?? "Recent activity"} version={version}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-current/10 bg-black/5 px-3 py-2 text-xs uppercase tracking-[0.22em] text-current/55">
          <CheckCircle2 className="size-3.5" />
          Operational stream
        </div>
        <button className="rounded-full border border-current/10 bg-black/5 px-3 py-2 text-sm text-current/70">
          View all activity
        </button>
      </div>
      <div className="grid gap-3">
        {(screen.feed ?? []).map((item) => (
          <div
            key={`${item.title}-${item.meta}`}
            className="rounded-[1.35rem] border border-current/10 bg-black/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-current/90">{item.title}</p>
              {item.status ? (
                <span className="rounded-full bg-white/50 px-2.5 py-1 text-xs text-current/70">
                  {item.status}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-current/65">{item.meta}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  )
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

function OperationalChecklistPanel({
  screen,
  version,
}: {
  screen: ScreenDefinition
  version: VersionDefinition
}) {
  return (
    <SurfaceCard title="Open work items" version={version}>
      <div className="grid gap-3">
        {(screen.highlights ?? []).map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[1.2rem] border border-current/10 bg-black/5 p-4 text-sm leading-6 text-current/80"
          >
            <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              {index + 1}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </SurfaceCard>
  )
}

function ActivityRailPanel({
  screenKey,
  version,
}: {
  screenKey: ScreenKey
  version: VersionDefinition
}) {
  return (
    <SurfaceCard title="Recent activity" version={version}>
      <div className="grid gap-3">
        {getActivityItems(screenKey).map((item) => (
          <div
            key={`${item.title}-${item.meta}`}
            className="rounded-[1.2rem] border border-current/10 bg-black/5 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-current/90">{item.title}</p>
              <span className="rounded-full bg-white/40 px-2 py-1 text-[11px] text-current/70">
                {item.badge}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-current/65">{item.meta}</p>
          </div>
        ))}
      </div>
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

function getWorkflowTabs(
  screenKey: ScreenKey,
  versionId: VersionDefinition["id"],
  routeContext?: { employeeId?: string },
) {
  const employeeId = routeContext?.employeeId ?? "emp-001"
  const employeeTabs = [
    {
      key: "employeesList" as const,
      label: "Directory",
      href: `/${versionId}/${getPathForScreen("employeesList")}`,
    },
    {
      key: "employeeDetails" as const,
      label: "Profile",
      href: `/${versionId}/${getPathForScreen("employeeDetails", { employeeId })}`,
    },
    {
      key: "employeeAdd" as const,
      label: "New hire",
      href: `/${versionId}/${getPathForScreen("employeeAdd")}`,
    },
    {
      key: "employeeEdit" as const,
      label: "Update record",
      href: `/${versionId}/${getPathForScreen("employeeEdit", { employeeId })}`,
    },
  ]

  const defaultTabs = [
    {
      key: screenKey,
      label: "Overview",
      href: `/${versionId}/${getPathForScreen(screenKey)}`,
    },
  ]

  const tabSource =
    screenKey === "employeesList" ||
    screenKey === "employeeDetails" ||
    screenKey === "employeeAdd" ||
    screenKey === "employeeEdit"
      ? employeeTabs
      : defaultTabs

  return tabSource.map((tab) => ({
    ...tab,
    current: tab.key === screenKey,
  }))
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

function getUtilityStats(screenKey: ScreenKey) {
  if (
    screenKey === "employeesList" ||
    screenKey === "employeeDetails" ||
    screenKey === "employeeAdd" ||
    screenKey === "employeeEdit"
  ) {
    return [
      { label: "Pending approvals", value: "07" },
      { label: "Profiles in review", value: "11" },
      { label: "Onboarding today", value: "03" },
    ]
  }

  return [
    { label: "Action queue", value: "19" },
    { label: "Unread alerts", value: "06" },
    { label: "Policy exceptions", value: "04" },
  ]
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

function getOperationalSummary(screenKey: ScreenKey) {
  switch (screenKey) {
    case "dashboard":
      return "Monitor workforce health, approvals, payroll readiness, and cross-functional escalations in one place."
    case "employeesList":
      return "Manage the employee directory, inspect status changes, and move into profile or onboarding actions from a single workspace."
    case "employeeDetails":
      return "Review a complete employee record including reporting, compensation, documentation, and operational dependencies."
    case "employeeAdd":
      return "Create a new employee record with onboarding-ready profile, reporting, and payroll information."
    case "employeeEdit":
      return "Update profile information while preserving downstream operational integrity across payroll, attendance, and approvals."
    case "leaveManagement":
      return "Track time-away demand, approval queues, and policy-sensitive absence cases across the organization."
    case "attendance":
      return "Monitor daily presence signals, unresolved attendance anomalies, and shift-related exceptions."
    case "payroll":
      return "Review payrun blockers, banking mismatches, and compensation exceptions before payroll close."
    default:
      return "Work from a production-style HRMS workspace with module-specific actions, controls, and operational context."
  }
}

function getOperationalFlags(screenKey: ScreenKey) {
  switch (screenKey) {
    case "dashboard":
      return ["Live queues", "Manager escalations", "Compliance watch"]
    case "employeesList":
      return ["Directory controls", "Status filters", "Profile actions"]
    case "employeeDetails":
      return ["Profile record", "Compensation context", "Document trail"]
    case "employeeAdd":
      return ["New hire intake", "Onboarding workflow", "Payroll setup"]
    case "employeeEdit":
      return ["Change tracking", "Downstream checks", "Audit-safe update"]
    case "leaveManagement":
      return ["Approval queue", "Policy review", "Balance checks"]
    case "attendance":
      return ["Presence signals", "Shift anomalies", "Remote coverage"]
    case "payroll":
      return ["Payrun blockers", "Finance handoff", "Bank verification"]
    default:
      return ["Operational view", "Product workflow", "Role-based actions"]
  }
}

function getActivityItems(screenKey: ScreenKey) {
  switch (screenKey) {
    case "employeesList":
    case "employeeDetails":
    case "employeeAdd":
    case "employeeEdit":
      return [
        {
          title: "Manager approval completed",
          meta: "Ava Patel role mapping was approved by Grace Chen 12 minutes ago.",
          badge: "Approved",
        },
        {
          title: "Payroll sync queued",
          meta: "The latest employee profile change will be synced to payroll in the next batch.",
          badge: "Queued",
        },
        {
          title: "Document follow-up created",
          meta: "A compliance reminder was scheduled for Mia Shah's onboarding packet.",
          badge: "Action",
        },
      ]
    case "leaveManagement":
      return [
        {
          title: "Annual leave request escalated",
          meta: "One pending request exceeded the manager SLA and was escalated to People Ops.",
          badge: "Escalated",
        },
        {
          title: "Policy conflict detected",
          meta: "A remote work request overlaps with a regional holiday calendar exception.",
          badge: "Review",
        },
        {
          title: "Balance refresh completed",
          meta: "Quarterly leave accrual balances were recalculated across all entities.",
          badge: "Done",
        },
      ]
    default:
      return [
        {
          title: "Operations digest published",
          meta: "The regional people operations summary was published for leadership review.",
          badge: "Published",
        },
        {
          title: "Approval queue refreshed",
          meta: "Pending approvals and escalations were synced from the latest workflow snapshot.",
          badge: "Synced",
        },
        {
          title: "System notice cleared",
          meta: "The earlier notification delay affecting people alerts has been resolved.",
          badge: "Resolved",
        },
      ]
  }
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
