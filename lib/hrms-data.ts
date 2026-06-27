export const AVAILABLE_VERSIONS = ["v0", "v1", "v2", "v3", "v4"] as const

export type VersionId = (typeof AVAILABLE_VERSIONS)[number]

export const APP_MODULES = [
  "Dashboard",
  "Login",
  "Employee Management",
  "Departments",
  "Leave Management",
  "Attendance",
  "Payroll",
  "Performance Reviews",
  "Documents",
  "Notifications",
  "Settings",
  "Admin",
] as const

export const SCREEN_PATHS = {
  dashboard: "dashboard",
  login: "login",
  employeesList: "employees",
  employeeDetails: "employees/:employeeId",
  employeeAdd: "employees/new",
  employeeEdit: "employees/:employeeId/edit",
  departments: "departments",
  leaveManagement: "leave-management",
  attendance: "attendance",
  payroll: "payroll",
  performanceReviews: "performance-reviews",
  documents: "documents",
  notifications: "notifications",
  settings: "settings",
  admin: "admin",
} as const

export type ScreenKey = keyof typeof SCREEN_PATHS

export type ScreenKind =
  | "dashboard"
  | "login"
  | "table"
  | "profile"
  | "form"
  | "cards"
  | "feed"

export type Kpi = {
  label: string
  value: string
  delta: string
}

export type ScreenField = {
  label: string
  placeholder: string
  helper?: string
}

export type ScreenCard = {
  title: string
  description: string
}

export type ScreenFeedItem = {
  title: string
  meta: string
  status?: string
}

export type ScreenTable = {
  title: string
  columns: [string, string, string, string]
  rows: Array<[string, string, string, string]>
}

export type ScreenDefinition = {
  navLabel: string
  navHint: string
  eyebrow: string
  title: string
  description: string
  kind: ScreenKind
  primaryAction: string
  secondaryAction?: string
  locatorRisk: string
  highlights: string[]
  kpis?: Kpi[]
  cards?: ScreenCard[]
  cardsTitle?: string
  table?: ScreenTable
  fields?: ScreenField[]
  formTitle?: string
  feed?: ScreenFeedItem[]
  feedTitle?: string
}

type ThemeDefinition = {
  page: string
  hero: string
  sidebar: string
  panel: string
  card: string
}

export type VersionDefinition = {
  id: VersionId
  releaseLabel: string
  changeSummary: string
  notice: string
  shellLabel: string
  shellDescription: string
  driftMarkers: string[]
  navigation: ScreenKey[]
  theme: ThemeDefinition
  screens: Record<ScreenKey, ScreenDefinition>
}

type VersionDelta = {
  releaseLabel?: string
  changeSummary?: string
  notice?: string
  shellLabel?: string
  shellDescription?: string
  driftMarkers?: string[]
  navigation?: ScreenKey[]
  theme?: Partial<ThemeDefinition>
  screens?: Partial<Record<ScreenKey, Partial<ScreenDefinition>>>
}

const baseNavigation: ScreenKey[] = [
  "dashboard",
  "employeesList",
  "departments",
  "leaveManagement",
  "attendance",
  "payroll",
  "performanceReviews",
  "documents",
  "notifications",
  "settings",
  "admin",
]

const v0: VersionDefinition = {
  id: "v0",
  releaseLabel: "Baseline operations suite",
  changeSummary:
    "The original release uses straightforward headings, conventional navigation names, and stable card layouts.",
  notice:
    "Treat this release as the golden reference for selectors, semantics, and screen structure.",
  shellLabel: "Human Resources Control Center",
  shellDescription:
    "A focused workspace for people operations, approvals, workforce records, and payroll readiness.",
  driftMarkers: [
    "Page titles match navigation labels closely.",
    "Primary actions use direct verbs such as Add, Save, and Export.",
    "Tables and forms follow a conservative enterprise layout.",
  ],
  navigation: baseNavigation,
  theme: {
    page: "bg-[linear-gradient(180deg,_#f2f6ff_0%,_#ebf0f8_100%)] text-slate-950",
    hero: "border-sky-200 bg-[linear-gradient(120deg,_#0f172a_0%,_#1d4ed8_54%,_#dbeafe_160%)] text-white",
    sidebar: "border-white/60 bg-white/84 text-slate-950 backdrop-blur",
    panel: "border-white/60 bg-white/86 text-slate-950 backdrop-blur",
    card: "border-white/60 bg-white/86 text-slate-950 backdrop-blur",
  },
  screens: {
    dashboard: {
      navLabel: "Dashboard",
      navHint: "Overview",
      eyebrow: "Executive snapshot",
      title: "HR operations dashboard",
      description:
        "A consolidated view of staffing, approvals, payroll readiness, and upcoming workforce actions.",
      kind: "dashboard",
      primaryAction: "Create report",
      secondaryAction: "Export summary",
      locatorRisk:
        "Future versions may rename the headline cards, move the primary CTA, or swap the card order while keeping the same business data.",
      highlights: [
        "Top-level widgets establish the baseline selector strategy.",
        "Expect later releases to reframe the same metrics with different titles.",
        "Automation can use this screen as the visual anchor for cross-version comparisons.",
      ],
      kpis: [
        { label: "Headcount", value: "248", delta: "+12 since last quarter" },
        { label: "Open Requests", value: "19", delta: "6 require manager review" },
        { label: "Payroll Ready", value: "96%", delta: "2 records missing bank details" },
        { label: "Attendance Rate", value: "94.8%", delta: "Improved after shift rebalance" },
      ],
      cards: [
        {
          title: "Urgent approvals",
          description: "Seven leave requests and three document renewals are waiting for action.",
        },
        {
          title: "Hiring pipeline",
          description: "Two engineering roles and one payroll analyst role are in final review.",
        },
        {
          title: "Compliance watch",
          description: "Three employee profiles need document refresh before month end.",
        },
      ],
      table: {
        title: "Today's workforce focus",
        columns: ["Employee", "Task", "Owner", "Status"],
        rows: [
          ["Ava Patel", "Finalize onboarding plan", "HR Ops", "In progress"],
          ["Liam Wong", "Approve location transfer", "People Lead", "Awaiting"],
          ["Noah Silva", "Confirm payroll exception", "Payroll", "Needs review"],
          ["Mia Shah", "Collect visa renewal copy", "Admin", "Scheduled"],
        ],
      },
    },
    login: {
      navLabel: "Login",
      navHint: "Authentication",
      eyebrow: "Access management",
      title: "Sign in to HRMS",
      description:
        "Employees, managers, and administrators enter the same application through a shared access portal.",
      kind: "login",
      primaryAction: "Sign in",
      secondaryAction: "Use SSO",
      locatorRisk:
        "Authentication labels are prime candidates for drift, especially when teams change wording from Sign in to Continue or Access workspace.",
      highlights: [
        "Baseline form labels are explicit and stable.",
        "Later versions can relabel fields without changing login semantics.",
        "CTA button text should intentionally evolve across releases.",
      ],
      fields: [
        { label: "Work email", placeholder: "name@company.com" },
        { label: "Password", placeholder: "Enter your password" },
      ],
    },
    employeesList: {
      navLabel: "Employee Management",
      navHint: "Directory",
      eyebrow: "Workforce records",
      title: "Employee list",
      description:
        "Browse the workforce directory, review employment status, and open records for details or updates.",
      kind: "table",
      primaryAction: "Add employee",
      secondaryAction: "Export list",
      locatorRisk:
        "List screens commonly break selectors when table captions, toolbar labels, or action button names change.",
      highlights: [
        "A classic list page for row-based automation.",
        "Useful for validating row discovery, filters, and row actions.",
        "Later versions may change the navigation label away from Employee Management.",
      ],
      kpis: [
        { label: "Active employees", value: "232", delta: "9 new hires this month" },
        { label: "On leave", value: "14", delta: "4 parental leave cases" },
        { label: "Contractors", value: "21", delta: "3 pending renewals" },
        { label: "Profile gaps", value: "8", delta: "Mostly missing documents" },
      ],
      table: {
        title: "Employee directory",
        columns: ["Employee", "Role", "Department", "Status"],
        rows: [
          ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
          ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
          ["Mia Shah", "Office Manager", "Admin", "Probation"],
          ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
        ],
      },
    },
    employeeDetails: {
      navLabel: "Employee Details",
      navHint: "Profile",
      eyebrow: "Record inspection",
      title: "Employee details",
      description:
        "Inspect a single employee record with profile, role, compensation, and compliance context.",
      kind: "profile",
      primaryAction: "Edit employee",
      secondaryAction: "Download dossier",
      locatorRisk:
        "Details screens often drift when teams reorganize profile panels or rename sections like Compensation and Employment.",
      highlights: [
        "Profile metadata can move between cards without changing the workflow outcome.",
        "A useful target for text-based locator healing.",
        "Download actions may migrate into overflow menus in future versions.",
      ],
      fields: [
        { label: "Employee", placeholder: "Ava Patel" },
        { label: "Department", placeholder: "Talent Acquisition" },
        { label: "Manager", placeholder: "Grace Chen" },
        { label: "Employment type", placeholder: "Full-time" },
        { label: "Location", placeholder: "Bengaluru" },
        { label: "Compensation band", placeholder: "P3" },
      ],
      cardsTitle: "Related record zones",
      cards: [
        {
          title: "Documents",
          description: "Offer letter, ID proof, tax declaration, and appraisal notes.",
        },
        {
          title: "Recent actions",
          description: "Address update approved and laptop replacement requested.",
        },
      ],
    },
    employeeAdd: {
      navLabel: "Add Employee",
      navHint: "Onboarding",
      eyebrow: "Record creation",
      title: "Add employee",
      description:
        "Capture the core profile data required to onboard a new employee into the system.",
      kind: "form",
      primaryAction: "Save employee",
      secondaryAction: "Save draft",
      locatorRisk:
        "Forms are ideal for locator-healing tests because labels, field grouping, and CTA placement often change between releases.",
      highlights: [
        "Baseline onboarding form with direct labels.",
        "Expect future releases to split or rename sections.",
        "Helpful for testing field-level locator resilience.",
      ],
      formTitle: "Onboarding form",
      fields: [
        { label: "Full name", placeholder: "Enter full legal name" },
        { label: "Work email", placeholder: "Enter corporate email" },
        { label: "Department", placeholder: "Select department" },
        { label: "Role", placeholder: "Select role" },
        { label: "Joining date", placeholder: "Pick joining date" },
        { label: "Employment type", placeholder: "Select employment type" },
      ],
    },
    employeeEdit: {
      navLabel: "Edit Employee",
      navHint: "Update profile",
      eyebrow: "Record update",
      title: "Edit employee",
      description:
        "Modify an existing employee record while preserving audit-friendly workflow cues.",
      kind: "form",
      primaryAction: "Update employee",
      secondaryAction: "Discard changes",
      locatorRisk:
        "Edit forms typically introduce drift through renamed save actions and regrouped sections, making them strong locator-healing targets.",
      highlights: [
        "Pairs naturally with Employee details for edit-entry flows.",
        "Good for validating selector healing after CTA and field-label changes.",
        "Can later add conditional sections without changing the route.",
      ],
      formTitle: "Profile update form",
      fields: [
        { label: "Phone number", placeholder: "Enter mobile number" },
        { label: "Location", placeholder: "Select office location" },
        { label: "Manager", placeholder: "Select reporting manager" },
        { label: "Emergency contact", placeholder: "Enter emergency contact" },
        { label: "Bank status", placeholder: "Select payroll bank status" },
        { label: "Notes", placeholder: "Add internal note" },
      ],
    },
    departments: {
      navLabel: "Departments",
      navHint: "Org units",
      eyebrow: "Structure",
      title: "Department overview",
      description:
        "Review department ownership, budget posture, and staffing coverage across the organization.",
      kind: "cards",
      primaryAction: "Create department",
      secondaryAction: "View org chart",
      locatorRisk:
        "Department cards often get renamed or reordered, which can break card-based selectors.",
      highlights: [
        "Card-heavy page for container-level locator strategies.",
        "A good candidate for testing title-only matching.",
        "Later versions may move the org chart action into the header.",
      ],
      cardsTitle: "Department groups",
      fields: [
        { label: "Department name", placeholder: "Enter department name" },
        { label: "Lead", placeholder: "Select department lead" },
        { label: "Budget status", placeholder: "Select budget status" },
        { label: "Open roles", placeholder: "Enter open roles count" },
      ],
      cards: [
        { title: "Engineering", description: "78 employees across product and platform squads." },
        { title: "Talent", description: "12 recruiters and coordinators driving current hiring plans." },
        { title: "Finance", description: "16 staff supporting payroll, FP&A, and procurement." },
        { title: "Admin", description: "11 operators handling facilities, travel, and workplace services." },
      ],
    },
    leaveManagement: {
      navLabel: "Leave Management",
      navHint: "Time away",
      eyebrow: "Requests",
      title: "Leave management",
      description:
        "Track balances, pending approvals, and policy-sensitive absence workflows in one place.",
      kind: "table",
      primaryAction: "Apply leave",
      secondaryAction: "Review policy",
      locatorRisk:
        "Leave workflows are ideal for testing broken locators after tab, button, or queue labels change.",
      highlights: [
        "Queue-like page with action-driven rows.",
        "Can later evolve into tabs or filters without touching the route.",
        "Works well for intent-based locator healing scenarios.",
      ],
      fields: [
        { label: "Employee", placeholder: "Select employee" },
        { label: "Leave type", placeholder: "Select leave type" },
        { label: "Start date", placeholder: "Select start date" },
        { label: "End date", placeholder: "Select end date" },
      ],
      table: {
        title: "Pending leave actions",
        columns: ["Employee", "Leave type", "Dates", "Status"],
        rows: [
          ["Mia Shah", "Annual leave", "Jul 02 - Jul 05", "Pending manager"],
          ["Ava Patel", "Sick leave", "Jun 28", "Approved"],
          ["Noah Silva", "Comp-off", "Jul 12", "Pending HR"],
          ["Liam Wong", "Work from home", "Jul 01 - Jul 03", "Policy review"],
        ],
      },
    },
    attendance: {
      navLabel: "Attendance",
      navHint: "Presence",
      eyebrow: "Daily rhythm",
      title: "Attendance",
      description:
        "Monitor punctuality, shift coverage, exceptions, and hybrid attendance behavior.",
      kind: "cards",
      primaryAction: "Mark attendance",
      secondaryAction: "Export exceptions",
      locatorRisk:
        "Attendance views often drift from card layouts to timelines or grids, challenging structure-based selectors.",
      highlights: [
        "Designed for card and summary-based locators.",
        "A useful page for visual diff demonstrations.",
        "Future versions may move from summary cards to denser operational language.",
      ],
      fields: [
        { label: "Employee", placeholder: "Select employee" },
        { label: "Work date", placeholder: "Select work date" },
        { label: "Status", placeholder: "Select status" },
        { label: "Work mode", placeholder: "Select work mode" },
        { label: "Check in", placeholder: "Set check in time" },
        { label: "Check out", placeholder: "Set check out time" },
        { label: "Notes", placeholder: "Optional attendance notes" },
      ],
    },
    payroll: {
      navLabel: "Payroll",
      navHint: "Compensation",
      eyebrow: "Monthly close",
      title: "Payroll",
      description:
        "Verify payroll readiness, exception records, and downstream dependencies before the monthly run.",
      kind: "table",
      primaryAction: "Run payroll check",
      secondaryAction: "Download register",
      locatorRisk:
        "Payroll pages often shift wording from payroll to compensation, which makes text-only locators brittle.",
      highlights: [
        "Useful for checking list selectors against renamed finance terms.",
        "A strong candidate for row-action and summary-card comparisons.",
        "Future versions may foreground exception queues over the table.",
      ],
      table: {
        title: "Payroll exception queue",
        columns: ["Employee", "Issue", "Owner", "Priority"],
        rows: [
          ["Noah Silva", "Bank account mismatch", "Payroll", "High"],
          ["Priya Menon", "Missing tax regime", "HR Ops", "Medium"],
          ["Daniel Reed", "Bonus pending approval", "Finance", "Medium"],
          ["Ivy Kumar", "Location allowance conflict", "Comp Team", "High"],
        ],
      },
    },
    performanceReviews: {
      navLabel: "Performance Reviews",
      navHint: "Growth cycles",
      eyebrow: "Talent outcomes",
      title: "Performance reviews",
      description:
        "Track review cycles, calibration readiness, and overdue manager feedback.",
      kind: "feed",
      primaryAction: "Start review cycle",
      secondaryAction: "Open calibration",
      locatorRisk:
        "Review modules frequently rename actions and cycle labels, causing automation based on visible text to drift.",
      highlights: [
        "Feed-like view suits activity selectors and list healing.",
        "Useful for validating navigation-name drift.",
        "Cycle wording is expected to vary significantly in later versions.",
      ],
      feedTitle: "Review cycle feed",
      feed: [
        { title: "Mid-year cycle launched", meta: "124 employees assigned reviewers", status: "Live" },
        { title: "Manager reminders queued", meta: "18 managers have overdue feedback", status: "Attention" },
        { title: "Calibration deck updated", meta: "Leadership review scheduled for Friday", status: "Ready" },
      ],
    },
    documents: {
      navLabel: "Documents",
      navHint: "File center",
      eyebrow: "Records",
      title: "Documents",
      description:
        "Centralize employee files, compliance renewals, and HR-generated letters.",
      kind: "feed",
      primaryAction: "Upload document",
      secondaryAction: "Open expiring files",
      locatorRisk:
        "Document modules often drift toward file-browser metaphors, changing both labels and container structure.",
      highlights: [
        "Good for testing CTA relocation.",
        "Can later swap cards for drawers or segmented lists.",
        "Document status chips are likely to move or be renamed.",
      ],
      feedTitle: "Latest document events",
      feed: [
        { title: "Visa renewal packet uploaded", meta: "For Mia Shah by Admin Ops", status: "New" },
        { title: "Policy handbook versioned", meta: "FY26 release published to all employees", status: "Published" },
        { title: "Offer letter signed", meta: "Candidate accepted payroll analyst role", status: "Completed" },
      ],
    },
    notifications: {
      navLabel: "Notifications",
      navHint: "Alerts",
      eyebrow: "Awareness",
      title: "Notifications",
      description:
        "Track HR-wide alerts, workflow reminders, and employee-facing communication items.",
      kind: "feed",
      primaryAction: "Compose announcement",
      secondaryAction: "View unread",
      locatorRisk:
        "Notification centers commonly change from list layouts to message cards, challenging DOM-specific automation.",
      highlights: [
        "Alert-heavy surface suited for locator healing demonstrations.",
        "Easy to vary label language without changing intent.",
        "Can evolve into inbox-like UI in later versions.",
      ],
      feedTitle: "Alert stream",
      feed: [
        { title: "Benefits enrollment closes soon", meta: "Sent to all employees 2 hours ago", status: "Unread" },
        { title: "Manager review reminder", meta: "Queued for 18 managers this morning", status: "Queued" },
        { title: "Office closure advisory", meta: "Shared with Bengaluru office staff", status: "Delivered" },
      ],
    },
    settings: {
      navLabel: "Settings",
      navHint: "Configuration",
      eyebrow: "System tuning",
      title: "Settings",
      description:
        "Control policy, branding, approval chains, and environment-level HRMS preferences.",
      kind: "cards",
      primaryAction: "Save preferences",
      secondaryAction: "View audit trail",
      locatorRisk:
        "Settings surfaces drift heavily when configuration groups are renamed or nested differently.",
      highlights: [
        "A configuration-oriented page with stable business meaning.",
        "Well suited for testing heading-level locator healing.",
        "Nested sections can change significantly across versions.",
      ],
      cardsTitle: "Configuration groups",
      cards: [
        { title: "Approvals", description: "Routing rules for leave, onboarding, and payroll exceptions." },
        { title: "Branding", description: "Logo, email signature, and employee portal copy settings." },
        { title: "Security", description: "Password policies, SSO, and session governance." },
        { title: "Localization", description: "Working week, holiday calendar, and timezone preferences." },
      ],
    },
    admin: {
      navLabel: "Admin",
      navHint: "Governance",
      eyebrow: "Platform controls",
      title: "Admin console",
      description:
        "Manage system ownership tasks, elevated actions, and audit-sensitive maintenance operations.",
      kind: "cards",
      primaryAction: "Review audit log",
      secondaryAction: "Manage roles",
      locatorRisk:
        "Admin panels often change grouping and naming quickly, making them useful for high-drift locator exercises.",
      highlights: [
        "A dense surface for action and card-based selectors.",
        "Good for testing shell-level changes in later versions.",
        "Role and audit wording may evolve while the route remains the same.",
      ],
      cardsTitle: "Admin control zones",
      cards: [
        { title: "Role administration", description: "Assign HR admin, payroll, and auditor permissions." },
        { title: "Audit monitoring", description: "Inspect elevated actions and export compliance trails." },
        { title: "Data maintenance", description: "Archive stale records and reconcile controlled lists." },
        { title: "Environment flags", description: "Toggle module visibility and staged rollout behavior." },
      ],
    },
  },
}

const versionDeltas: Record<Exclude<VersionId, "v0">, VersionDelta> = {
  v1: {
    releaseLabel: "Polished release candidate",
    changeSummary:
      "This deployment keeps the same flows but introduces fresher wording, denser summaries, and more productized navigation cues.",
    notice:
      "Expect CTA and section naming changes while the route paths and workflow intent stay stable.",
    shellLabel: "People Operations Hub",
    shellDescription:
      "A people operations workspace centered on daily execution, leadership visibility, and employee records.",
    driftMarkers: [
      "Several buttons shift from direct verbs to softer action language.",
      "Navigation remains recognizable but adopts more product-oriented hints.",
      "Dashboard support content is grouped more tightly.",
    ],
    screens: {
      dashboard: {
        eyebrow: "Operations pulse",
        title: "People operations pulse",
        primaryAction: "Generate snapshot",
        secondaryAction: "Share digest",
        locatorRisk:
          "The dashboard CTA text and hero title changed, so exact-text selectors from v0 should no longer be trusted.",
        cards: [
          {
            title: "Operational follow-up",
            description: "Managers can review workforce actions, compliance items, and payroll exceptions from one place.",
          },
          {
            title: "Hiring cadence",
            description: "Three roles are in final stages and one candidate is awaiting document collection.",
          },
          {
            title: "Risk watch",
            description: "Compliance-sensitive profiles are grouped into a shared watchlist instead of separate cards.",
          },
        ],
      },
      login: {
        navLabel: "Workspace Login",
        navHint: "Access flow",
        eyebrow: "Workspace access",
        title: "Access the HR workspace",
        primaryAction: "Continue",
        secondaryAction: "Continue with SSO",
        fields: [
          { label: "Business email", placeholder: "Enter your business email" },
          { label: "Access key", placeholder: "Enter your access password" },
        ],
      },
      employeesList: {
        navLabel: "Employees",
        navHint: "People list",
        title: "Employee directory",
        primaryAction: "Create employee",
        kpis: [
          { label: "People active", value: "0", delta: "Current active roster" },
          { label: "Working remote", value: "0", delta: "Remote assignment count" },
          { label: "Under review", value: "0", delta: "Probation population" },
          { label: "Payroll blockers", value: "0", delta: "Bank verification issues" },
        ],
        table: {
          title: "People directory",
          columns: ["Person", "Position", "Team", "State"],
          rows: [
            ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
            ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
            ["Mia Shah", "Office Manager", "Admin", "Probation"],
            ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
          ],
        },
      },
      employeeDetails: {
        navLabel: "Employee Record",
        navHint: "Profile card",
        eyebrow: "Record summary",
        title: "Employee record",
        primaryAction: "Open edit flow",
        secondaryAction: "Export record",
        fields: [
          { label: "Worker", placeholder: "Employee name" },
          { label: "Business unit", placeholder: "Department" },
          { label: "Reporting lead", placeholder: "Manager" },
          { label: "Employment class", placeholder: "Employment type" },
          { label: "Work base", placeholder: "Location" },
          { label: "Band", placeholder: "Compensation band" },
        ],
      },
      employeeAdd: {
        navLabel: "Create Employee",
        navHint: "Joiner setup",
        eyebrow: "Joiner intake",
        title: "Create employee record",
        formTitle: "New joiner intake",
        primaryAction: "Create profile",
        secondaryAction: "Keep draft",
        fields: [
          { label: "Legal name", placeholder: "Enter legal name" },
          { label: "Corporate email", placeholder: "Enter work email" },
          { label: "Business unit", placeholder: "Choose department" },
          { label: "Job title", placeholder: "Choose role" },
          { label: "Start date", placeholder: "Select start date" },
          { label: "Work arrangement", placeholder: "Select employment type" },
        ],
      },
      employeeEdit: {
        navLabel: "Revise Employee",
        navHint: "Profile update",
        eyebrow: "Profile revision",
        title: "Revise employee profile",
        primaryAction: "Save profile changes",
        secondaryAction: "Drop edits",
        formTitle: "Revision console",
        fields: [
          { label: "Legal name", placeholder: "Update legal name" },
          { label: "Corporate email", placeholder: "Update work email" },
          { label: "Job title", placeholder: "Update role" },
          { label: "Business unit", placeholder: "Update department" },
          { label: "Reporting lead", placeholder: "Choose manager" },
          { label: "Work arrangement", placeholder: "Choose employment type" },
          { label: "Work base", placeholder: "Choose location" },
          { label: "Mobile number", placeholder: "Update phone number" },
          { label: "Emergency contact", placeholder: "Update contact" },
          { label: "Band", placeholder: "Update band" },
          { label: "Bank verification", placeholder: "Choose bank status" },
          { label: "Start date", placeholder: "Update joining date" },
          { label: "Record state", placeholder: "Choose status" },
        ],
      },
      departments: {
        navLabel: "Business Units",
        navHint: "Departments",
        eyebrow: "Unit setup",
        title: "Business unit directory",
        primaryAction: "Add business unit",
        secondaryAction: "Open org chart",
        fields: [
          { label: "Business unit", placeholder: "Enter business unit name" },
          { label: "Unit owner", placeholder: "Choose unit owner" },
          { label: "Funding state", placeholder: "Choose funding state" },
          { label: "Open seats", placeholder: "Enter open seat count" },
        ],
      },
      leaveManagement: {
        navLabel: "Leave Desk",
        navHint: "Absence queue",
        eyebrow: "Absence control",
        title: "Leave desk",
        primaryAction: "Create leave request",
        secondaryAction: "Open policy guide",
        fields: [
          { label: "Worker", placeholder: "Choose worker" },
          { label: "Absence type", placeholder: "Choose absence type" },
          { label: "From date", placeholder: "Select start date" },
          { label: "To date", placeholder: "Select end date" },
        ],
        table: {
          title: "Absence request board",
          columns: ["Worker", "Request type", "Coverage window", "Decision"],
          rows: [
            ["Mia Shah", "Annual leave", "Jul 02 - Jul 05", "Pending manager"],
            ["Ava Patel", "Sick leave", "Jun 28", "Approved"],
            ["Noah Silva", "Comp-off", "Jul 12", "Pending HR"],
            ["Liam Wong", "Work from home", "Jul 01 - Jul 03", "Policy review"],
          ],
        },
      },
      attendance: {
        navLabel: "Attendance Hub",
        navHint: "Daily attendance",
        eyebrow: "Shift register",
        title: "Attendance hub",
        primaryAction: "Record attendance",
        secondaryAction: "Download register",
        fields: [
          { label: "Worker", placeholder: "Choose worker" },
          { label: "Shift date", placeholder: "Choose shift date" },
          { label: "Presence state", placeholder: "Choose presence state" },
          { label: "Work pattern", placeholder: "Choose work pattern" },
          { label: "Clock in", placeholder: "Choose clock in time" },
          { label: "Clock out", placeholder: "Choose clock out time" },
          { label: "Shift notes", placeholder: "Add shift notes" },
        ],
      },
      payroll: {
        navHint: "Comp workflow",
        eyebrow: "Comp controls",
        title: "Compensation readiness",
        primaryAction: "Run compensation check",
        secondaryAction: "Export register",
        table: {
          title: "Compensation blocker queue",
          columns: ["Worker", "Exception", "Desk owner", "Severity"],
          rows: [
            ["Noah Silva", "Bank account mismatch", "Payroll", "High"],
            ["Priya Menon", "Missing tax regime", "HR Ops", "Medium"],
            ["Daniel Reed", "Bonus pending approval", "Finance", "Medium"],
            ["Ivy Kumar", "Location allowance conflict", "Comp Team", "High"],
          ],
        },
      },
      performanceReviews: {
        navLabel: "Review Cycles",
        navHint: "Performance",
        title: "Review cycle center",
        primaryAction: "Launch review cycle",
        secondaryAction: "Open calibration room",
      },
      documents: {
        navLabel: "Document Center",
        navHint: "Records",
        title: "Document center",
        primaryAction: "Add document",
        secondaryAction: "Inspect expiring files",
      },
      notifications: {
        navLabel: "Alerts",
        navHint: "Notifications",
        title: "Alert center",
        primaryAction: "Draft alert",
        secondaryAction: "View unread alerts",
      },
      settings: {
        navLabel: "Admin Settings",
        navHint: "Preferences",
        title: "Administration settings",
        primaryAction: "Apply settings",
        secondaryAction: "Open audit trail",
      },
      admin: {
        navLabel: "Control Admin",
        navHint: "Ops controls",
        eyebrow: "Admin controls",
        title: "Administrative controls",
        primaryAction: "Open audit log",
        secondaryAction: "Manage access roles",
      },
    },
  },
  v2: {
    releaseLabel: "Adaptive workspace refresh",
    changeSummary:
      "The second follow-up deployment shifts the IA slightly, reframes employee content as people operations, and compresses descriptive copy.",
    notice:
      "Good candidate for navigation-label healing because multiple modules now use alternate naming.",
    shellLabel: "Workforce Pulse Workspace",
    shellDescription:
      "An operations-first workspace built around workforce movement, approvals, and time-sensitive actions.",
    driftMarkers: [
      "Employee-facing modules now use People phrasing in multiple places.",
      "Some labels are shortened while others become more operational.",
      "Section titles are less verbose than the baseline release.",
    ],
    screens: {
      dashboard: {
        navLabel: "Home Pulse",
        navHint: "Ops summary",
        eyebrow: "Pulse summary",
        title: "Workforce pulseboard",
        primaryAction: "Issue pulse brief",
        secondaryAction: "Broadcast digest",
        kpis: [
          { label: "Workforce total", value: "0", delta: "People in active roster" },
          { label: "Open approvals", value: "0", delta: "Requests pending action" },
          { label: "Bank-cleared", value: "0", delta: "Payroll verified records" },
          { label: "Presence score", value: "0", delta: "Attendance compliance rate" },
        ],
      },
      login: {
        navLabel: "Access",
        navHint: "Workspace entry",
        eyebrow: "Identity gateway",
        title: "Enter the workforce workspace",
        primaryAction: "Open workspace",
        secondaryAction: "Use enterprise sign-on",
        fields: [
          { label: "Work identity", placeholder: "Enter work identity" },
          { label: "Security phrase", placeholder: "Enter security phrase" },
        ],
      },
      employeesList: {
        navLabel: "People Directory",
        navHint: "Roster",
        eyebrow: "People listing",
        title: "People roster",
        primaryAction: "Add person",
        secondaryAction: "Download roster",
        table: {
          title: "People roster view",
          columns: ["Worker", "Assignment", "Org unit", "Lifecycle"],
          rows: [
            ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
            ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
            ["Mia Shah", "Office Manager", "Admin", "Probation"],
            ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
          ],
        },
      },
      employeeDetails: {
        navLabel: "People Profile",
        navHint: "Worker card",
        eyebrow: "Profile snapshot",
        title: "People profile",
        primaryAction: "Open profile update",
        secondaryAction: "Export profile pack",
        fields: [
          { label: "Person", placeholder: "Employee name" },
          { label: "Org unit", placeholder: "Department" },
          { label: "Manager", placeholder: "Manager" },
          { label: "Worker type", placeholder: "Employment type" },
          { label: "Site", placeholder: "Location" },
          { label: "Comp band", placeholder: "Compensation band" },
        ],
      },
      employeeAdd: {
        navLabel: "New Person",
        navHint: "Roster intake",
        eyebrow: "People intake",
        title: "Open people intake",
        formTitle: "People intake workspace",
        primaryAction: "Create people record",
        secondaryAction: "Store draft",
        fields: [
          { label: "Worker name", placeholder: "Enter worker name" },
          { label: "Business email", placeholder: "Enter business email" },
          { label: "Org unit", placeholder: "Choose org unit" },
          { label: "Assignment", placeholder: "Choose assignment" },
          { label: "Start date", placeholder: "Choose start date" },
          { label: "Worker type", placeholder: "Choose worker type" },
          { label: "People lead", placeholder: "Choose people lead" },
          { label: "Work site", placeholder: "Enter work site" },
          { label: "Mobile", placeholder: "Enter mobile number" },
          { label: "Emergency contact", placeholder: "Enter emergency contact" },
          { label: "Comp band", placeholder: "Enter compensation band" },
          { label: "Bank state", placeholder: "Choose bank state" },
          { label: "Lifecycle", placeholder: "Choose lifecycle state" },
        ],
      },
      employeeEdit: {
        navLabel: "Update Profile",
        navHint: "Record changes",
        eyebrow: "Profile changes",
        title: "Update people profile",
        primaryAction: "Apply updates",
        secondaryAction: "Cancel updates",
        fields: [
          { label: "Person", placeholder: "Update person name" },
          { label: "Work email", placeholder: "Update corporate email" },
          { label: "Assignment", placeholder: "Update role" },
          { label: "Org unit", placeholder: "Choose org unit" },
          { label: "People lead", placeholder: "Choose manager" },
          { label: "Worker type", placeholder: "Choose worker type" },
          { label: "Site", placeholder: "Choose work site" },
          { label: "Phone", placeholder: "Update phone" },
          { label: "Emergency contact", placeholder: "Update emergency contact" },
          { label: "Comp band", placeholder: "Update band" },
          { label: "Bank state", placeholder: "Choose bank state" },
          { label: "Start date", placeholder: "Update start date" },
          { label: "Lifecycle", placeholder: "Choose lifecycle state" },
        ],
      },
      departments: {
        navLabel: "Org Units",
        navHint: "Structure map",
        title: "Org units",
        primaryAction: "Create org unit",
        secondaryAction: "Open org map",
        fields: [
          { label: "Org unit", placeholder: "Enter org unit name" },
          { label: "Unit lead", placeholder: "Choose unit lead" },
          { label: "Budget signal", placeholder: "Choose budget signal" },
          { label: "Open headcount", placeholder: "Enter open headcount" },
        ],
      },
      leaveManagement: {
        navLabel: "Time Away",
        navHint: "Leave desk",
        eyebrow: "Time away control",
        title: "Time away queue",
        primaryAction: "Request time away",
        secondaryAction: "Open leave rules",
        fields: [
          { label: "Person", placeholder: "Choose person" },
          { label: "Time-away type", placeholder: "Choose time-away type" },
          { label: "Begin date", placeholder: "Choose begin date" },
          { label: "Finish date", placeholder: "Choose finish date" },
        ],
        table: {
          title: "Time away queue",
          columns: ["Person", "Request", "Date span", "Workflow state"],
          rows: [
            ["Mia Shah", "Annual leave", "Jul 02 - Jul 05", "Pending manager"],
            ["Ava Patel", "Sick leave", "Jun 28", "Approved"],
            ["Noah Silva", "Comp-off", "Jul 12", "Pending HR"],
            ["Liam Wong", "Work from home", "Jul 01 - Jul 03", "Policy review"],
          ],
        },
      },
      attendance: {
        navLabel: "Presence",
        navHint: "Attendance grid",
        title: "Presence board",
        primaryAction: "Capture attendance",
        secondaryAction: "Export attendance",
        fields: [
          { label: "Person", placeholder: "Choose person" },
          { label: "Presence date", placeholder: "Choose presence date" },
          { label: "Presence signal", placeholder: "Choose presence signal" },
          { label: "Work setting", placeholder: "Choose work setting" },
          { label: "Start mark", placeholder: "Choose start mark" },
          { label: "End mark", placeholder: "Choose end mark" },
          { label: "Presence notes", placeholder: "Add presence notes" },
        ],
      },
      payroll: {
        navLabel: "Pay Admin",
        navHint: "Payrun desk",
        eyebrow: "Payrun controls",
        title: "Payrun readiness",
        primaryAction: "Check payrun",
        secondaryAction: "Download payrun file",
        table: {
          title: "Payrun review list",
          columns: ["Person", "Pay issue", "Queue owner", "Risk"],
          rows: [
            ["Noah Silva", "Bank account mismatch", "Payroll", "High"],
            ["Priya Menon", "Missing tax regime", "HR Ops", "Medium"],
            ["Daniel Reed", "Bonus pending approval", "Finance", "Medium"],
            ["Ivy Kumar", "Location allowance conflict", "Comp Team", "High"],
          ],
        },
      },
      performanceReviews: {
        navLabel: "Performance",
        navHint: "Cycle tracker",
        title: "Review cycles",
        primaryAction: "Start cycle",
        secondaryAction: "Open calibration",
      },
      documents: {
        navLabel: "Records",
        navHint: "File library",
        title: "Records vault",
        primaryAction: "Upload record",
        secondaryAction: "Inspect expiring files",
      },
      notifications: {
        navLabel: "Message Center",
        navHint: "Alerts feed",
        title: "Workforce messages",
        primaryAction: "Compose message",
        secondaryAction: "Open unread",
      },
      settings: {
        navLabel: "Workspace Config",
        navHint: "System controls",
        title: "Workspace settings",
        primaryAction: "Save workspace settings",
        secondaryAction: "Inspect change log",
      },
      admin: {
        navLabel: "Operations Admin",
        navHint: "Control desk",
        title: "Operations control desk",
        primaryAction: "Inspect controls",
        secondaryAction: "Open role setup",
      },
    },
  },
  v3: {
    releaseLabel: "Locator-stress deployment",
    changeSummary:
      "This release deliberately intensifies semantic and structural drift by regrouping content and using a punchier product voice.",
    notice:
      "Expected to break brittle selectors that depend on exact headings, action labels, or rigid card groupings.",
    shellLabel: "TeamOS Command Layer",
    shellDescription:
      "A streamlined operating layer for fast-moving people teams managing approvals, records, and coverage.",
    driftMarkers: [
      "Hero headlines are shorter and more brand-like.",
      "Action labels shift away from baseline enterprise wording.",
      "Content zones use stronger abstractions such as command, vault, and board.",
    ],
    screens: {
      dashboard: {
        navLabel: "Command",
        navHint: "Ops deck",
        eyebrow: "Command stream",
        title: "Command deck",
        primaryAction: "Launch board export",
        secondaryAction: "Pin digest",
        kpis: [
          { label: "Roster live", value: "0", delta: "Tracked people records" },
          { label: "Approvals hot", value: "0", delta: "Queued decisions in play" },
          { label: "Bank pass", value: "0", delta: "Records cleared for payrun" },
          { label: "Presence live", value: "0", delta: "Current attendance health" },
        ],
      },
      login: {
        navLabel: "Gateway",
        navHint: "Secure entry",
        title: "Enter TeamOS",
        description:
          "The shared authentication flow now uses a more branded entry experience while preserving the same meaning.",
        primaryAction: "Enter workspace",
        secondaryAction: "Use identity pass",
        fields: [
          { label: "Identity route", placeholder: "Enter identity route" },
          { label: "Access phrase", placeholder: "Enter access phrase" },
        ],
      },
      employeesList: {
        navLabel: "Roster Board",
        navHint: "People command",
        eyebrow: "Roster operations",
        title: "Roster board",
        locatorRisk:
          "The list route is unchanged, but the title, navigation label, and primary action language now differ substantially from the baseline.",
        primaryAction: "Open intake",
        secondaryAction: "Pull roster export",
        table: {
          title: "Roster command board",
          columns: ["Teammate", "Function", "Pod", "Signal"],
          rows: [
            ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
            ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
            ["Mia Shah", "Office Manager", "Admin", "Probation"],
            ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
          ],
        },
      },
      employeeDetails: {
        navLabel: "Profile Console",
        navHint: "Dossier",
        title: "Profile console",
        primaryAction: "Launch profile edit",
        secondaryAction: "Pull dossier",
      },
      employeeAdd: {
        navLabel: "Profile Intake",
        navHint: "New record",
        eyebrow: "Intake launch",
        title: "Launch new profile",
        formTitle: "Profile intake console",
        primaryAction: "Commit profile",
        secondaryAction: "Stage draft",
        fields: [
          { label: "Identity", placeholder: "Capture legal name" },
          { label: "Mail route", placeholder: "Capture work email" },
          { label: "Org pod", placeholder: "Assign org pod" },
          { label: "Function", placeholder: "Assign function" },
          { label: "Go-live date", placeholder: "Choose go-live date" },
          { label: "Worker mode", placeholder: "Choose worker mode" },
        ],
      },
      employeeEdit: {
        navLabel: "Profile Tuning",
        navHint: "Edit console",
        eyebrow: "Tuning controls",
        title: "Tune employee profile",
        primaryAction: "Commit updates",
        secondaryAction: "Abandon draft",
        fields: [
          { label: "Identity", placeholder: "Update legal name" },
          { label: "Mail route", placeholder: "Update work email" },
          { label: "Function", placeholder: "Update function" },
          { label: "Org pod", placeholder: "Choose org pod" },
          { label: "Reporting owner", placeholder: "Choose reporting owner" },
          { label: "Worker mode", placeholder: "Choose worker mode" },
          { label: "Base", placeholder: "Choose work base" },
          { label: "Call line", placeholder: "Update phone" },
          { label: "Emergency line", placeholder: "Update emergency line" },
          { label: "Band", placeholder: "Update band" },
          { label: "Bank gate", placeholder: "Choose bank gate" },
          { label: "Go-live date", placeholder: "Update go-live date" },
          { label: "Signal", placeholder: "Choose record signal" },
        ],
      },
      departments: {
        navLabel: "Design Grid",
        navHint: "Org design",
        title: "Design grid",
        primaryAction: "Add org node",
        secondaryAction: "Launch org view",
        fields: [
          { label: "Org node", placeholder: "Capture org node name" },
          { label: "Node owner", placeholder: "Assign node owner" },
          { label: "Budget marker", placeholder: "Assign budget marker" },
          { label: "Seat gap", placeholder: "Capture seat gap" },
        ],
      },
      leaveManagement: {
        navLabel: "Absence",
        navHint: "Command queue",
        eyebrow: "Absence stream",
        title: "Absence command",
        primaryAction: "Launch absence request",
        secondaryAction: "Inspect rulebook",
        fields: [
          { label: "Teammate", placeholder: "Assign teammate" },
          { label: "Request signal", placeholder: "Assign request signal" },
          { label: "Launch date", placeholder: "Choose launch date" },
          { label: "Close date", placeholder: "Choose close date" },
        ],
        table: {
          title: "Absence action board",
          columns: ["Teammate", "Request", "Window", "State"],
          rows: [
            ["Mia Shah", "Annual leave", "Jul 02 - Jul 05", "Manager hold"],
            ["Ava Patel", "Sick leave", "Jun 28", "Approved"],
            ["Noah Silva", "Comp-off", "Jul 12", "HR review"],
            ["Liam Wong", "Remote request", "Jul 01 - Jul 03", "Policy check"],
          ],
        },
      },
      attendance: {
        navLabel: "Pulse Grid",
        navHint: "Presence command",
        title: "Pulse grid",
        primaryAction: "Log presence",
        secondaryAction: "Export pulse log",
        fields: [
          { label: "Teammate", placeholder: "Assign teammate" },
          { label: "Pulse date", placeholder: "Choose pulse date" },
          { label: "Pulse state", placeholder: "Choose pulse state" },
          { label: "Mode signal", placeholder: "Choose mode signal" },
          { label: "Pulse start", placeholder: "Choose pulse start" },
          { label: "Pulse end", placeholder: "Choose pulse end" },
          { label: "Command notes", placeholder: "Add command notes" },
        ],
      },
      payroll: {
        navLabel: "Payrun Ops",
        navHint: "Blocker board",
        eyebrow: "Payrun stream",
        title: "Payrun board",
        primaryAction: "Check payrun health",
        secondaryAction: "Pull blocker file",
        table: {
          title: "Payrun blockers",
          columns: ["Teammate", "Blocker", "Desk", "Priority"],
          rows: [
            ["Noah Silva", "Bank account mismatch", "Payroll", "High"],
            ["Priya Menon", "Missing tax regime", "HR Ops", "Medium"],
            ["Daniel Reed", "Bonus pending approval", "Finance", "Medium"],
            ["Ivy Kumar", "Allowance conflict", "Comp Team", "High"],
          ],
        },
      },
      performanceReviews: {
        navLabel: "Growth Board",
        navHint: "Cycle command",
        title: "Growth board",
        primaryAction: "Open cycle launch",
        secondaryAction: "Review calibration",
      },
      documents: {
        navLabel: "Vault Board",
        navHint: "Records command",
        title: "Vault board",
        primaryAction: "Push file",
        secondaryAction: "Inspect vault expiry",
      },
      notifications: {
        navLabel: "Inbox",
        navHint: "Ops stream",
        title: "Ops inbox",
        primaryAction: "Send bulletin",
        secondaryAction: "Focus unread",
      },
      settings: {
        navLabel: "Control Settings",
        navHint: "Config console",
        title: "Control settings",
        primaryAction: "Commit config",
        secondaryAction: "Read change history",
      },
      admin: {
        navLabel: "Control Room",
        navHint: "Governance ops",
        title: "Control room",
        primaryAction: "Inspect audit stream",
        secondaryAction: "Tune permissions",
      },
    },
  },
  v4: {
    releaseLabel: "Mature multi-release simulator",
    changeSummary:
      "The latest version sharpens the shell further, introduces more compact wording, and pushes the same workflows through a more modern product veneer.",
    notice:
      "Use this release as the strongest healing challenge before changing underlying data or APIs.",
    shellLabel: "Workgrid HQ",
    shellDescription:
      "A compact workspace for executive visibility, people records, payroll controls, and organization-wide actions.",
    driftMarkers: [
      "Several titles become intentionally shorter and less literal.",
      "Buttons use productized phrasing instead of classic CRUD verbs.",
      "Navigation drift is strongest here while route conventions remain stable.",
    ],
    screens: {
      dashboard: {
        navLabel: "HQ",
        navHint: "Exec board",
        eyebrow: "HQ overview",
        title: "Ops HQ",
        primaryAction: "Ship digest",
        secondaryAction: "Pin board note",
        kpis: [
          { label: "Roster total", value: "0", delta: "Headcount in HQ view" },
          { label: "Queue open", value: "0", delta: "Requests still unresolved" },
          { label: "Payrun clear", value: "0", delta: "Payroll-ready records" },
          { label: "Presence score", value: "0", delta: "Daily presence ratio" },
        ],
      },
      login: {
        navLabel: "Access",
        navHint: "HQ entry",
        title: "Unlock workspace",
        primaryAction: "Unlock HQ",
        secondaryAction: "Use identity provider",
        fields: [
          { label: "Identity key", placeholder: "Enter identity key" },
          { label: "Unlock phrase", placeholder: "Enter unlock phrase" },
        ],
      },
      employeesList: {
        navLabel: "Roster",
        navHint: "Team grid",
        eyebrow: "Team coverage",
        title: "Team roster",
        primaryAction: "Launch intake",
        secondaryAction: "Download team grid",
        table: {
          title: "Team coverage grid",
          columns: ["Teammate", "Craft", "Cluster", "State"],
          rows: [
            ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
            ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
            ["Mia Shah", "Office Manager", "Admin", "Probation"],
            ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
          ],
        },
      },
      employeeDetails: {
        navLabel: "Profile Hub",
        navHint: "Linked view",
        eyebrow: "Profile surfaces",
        title: "Profile hub",
        cardsTitle: "Linked surfaces",
        primaryAction: "Tune record",
        secondaryAction: "Download hub pack",
        fields: [
          { label: "Teammate", placeholder: "Employee name" },
          { label: "Cluster", placeholder: "Department" },
          { label: "Owner", placeholder: "Manager" },
          { label: "Contract mode", placeholder: "Employment type" },
          { label: "Base", placeholder: "Location" },
          { label: "Level", placeholder: "Compensation band" },
        ],
      },
      employeeAdd: {
        navLabel: "Intake",
        navHint: "Launch pad",
        eyebrow: "Launch intake",
        title: "Profile intake pad",
        formTitle: "Launchpad intake form",
        primaryAction: "Launch record",
        secondaryAction: "Park draft",
        fields: [
          { label: "Profile name", placeholder: "Capture profile name" },
          { label: "Mail route", placeholder: "Capture business email" },
          { label: "Cluster", placeholder: "Assign cluster" },
          { label: "Craft", placeholder: "Assign craft" },
          { label: "Start marker", placeholder: "Set start marker" },
          { label: "Contract mode", placeholder: "Set contract mode" },
          { label: "Owner", placeholder: "Assign owner" },
          { label: "Base", placeholder: "Set work base" },
          { label: "Call line", placeholder: "Capture call line" },
          { label: "Emergency line", placeholder: "Capture emergency line" },
          { label: "Level", placeholder: "Assign level" },
          { label: "Bank gate", placeholder: "Set bank gate" },
          { label: "State", placeholder: "Set profile state" },
        ],
      },
      employeeEdit: {
        navLabel: "Profile Tune",
        navHint: "Record tuning",
        eyebrow: "Tune-up mode",
        title: "Tune profile",
        primaryAction: "Apply tune-up",
        secondaryAction: "Reset edits",
        fields: [
          { label: "Teammate", placeholder: "Update employee name" },
          { label: "Mail", placeholder: "Update work email" },
          { label: "Craft", placeholder: "Update craft" },
          { label: "Cluster", placeholder: "Choose cluster" },
          { label: "Owner", placeholder: "Choose owner" },
          { label: "Contract mode", placeholder: "Choose contract mode" },
          { label: "Base", placeholder: "Choose base" },
          { label: "Phone", placeholder: "Update phone" },
          { label: "Emergency line", placeholder: "Update emergency line" },
          { label: "Level", placeholder: "Update level" },
          { label: "Bank gate", placeholder: "Choose bank gate" },
          { label: "Start marker", placeholder: "Update start marker" },
          { label: "State", placeholder: "Choose state" },
        ],
      },
      departments: {
        navLabel: "Org Design",
        navHint: "Org blueprint",
        title: "Org design",
        primaryAction: "Add org blueprint",
        secondaryAction: "Open structure canvas",
        fields: [
          { label: "Blueprint node", placeholder: "Enter blueprint node" },
          { label: "Blueprint owner", placeholder: "Choose blueprint owner" },
          { label: "Funding marker", placeholder: "Choose funding marker" },
          { label: "Seat plan", placeholder: "Enter seat plan count" },
        ],
      },
      leaveManagement: {
        navLabel: "Absence Grid",
        navHint: "Time control",
        eyebrow: "Absence grid",
        title: "Absence grid",
        primaryAction: "Launch time request",
        secondaryAction: "Inspect policy map",
        fields: [
          { label: "Roster item", placeholder: "Choose roster item" },
          { label: "Time signal", placeholder: "Choose time signal" },
          { label: "Open span", placeholder: "Choose open span" },
          { label: "Close span", placeholder: "Choose close span" },
        ],
        table: {
          title: "Absence coverage grid",
          columns: ["Teammate", "Time item", "Span", "Decision state"],
          rows: [
            ["Mia Shah", "Annual leave", "Jul 02 - Jul 05", "Pending manager"],
            ["Ava Patel", "Sick leave", "Jun 28", "Approved"],
            ["Noah Silva", "Comp-off", "Jul 12", "Pending HR"],
            ["Liam Wong", "Work from home", "Jul 01 - Jul 03", "Policy review"],
          ],
        },
      },
      attendance: {
        navLabel: "Presence",
        navHint: "Pulse register",
        title: "Presence grid",
        primaryAction: "Stamp presence",
        secondaryAction: "Download anomalies",
        fields: [
          { label: "Roster item", placeholder: "Choose roster item" },
          { label: "Register date", placeholder: "Choose register date" },
          { label: "Presence code", placeholder: "Choose presence code" },
          { label: "Mode code", placeholder: "Choose mode code" },
          { label: "Register in", placeholder: "Choose register in" },
          { label: "Register out", placeholder: "Choose register out" },
          { label: "Grid notes", placeholder: "Add grid notes" },
        ],
      },
      payroll: {
        navLabel: "Payrun",
        navHint: "Run status",
        eyebrow: "Payrun health",
        title: "Payrun health",
        primaryAction: "Inspect payrun",
        secondaryAction: "Download payrun audit",
        table: {
          title: "Payrun health grid",
          columns: ["Teammate", "Risk item", "Control desk", "Severity"],
          rows: [
            ["Noah Silva", "Bank account mismatch", "Payroll", "High"],
            ["Priya Menon", "Missing tax regime", "HR Ops", "Medium"],
            ["Daniel Reed", "Bonus pending approval", "Finance", "Medium"],
            ["Ivy Kumar", "Location allowance conflict", "Comp Team", "High"],
          ],
        },
      },
      performanceReviews: {
        navLabel: "Growth",
        navHint: "Cycle lab",
        title: "Growth cycles",
        primaryAction: "Launch cycle",
        secondaryAction: "Open review board",
      },
      documents: {
        navLabel: "Vault",
        navHint: "File archive",
        title: "File vault",
        primaryAction: "Add vault file",
        secondaryAction: "Inspect file expiry",
      },
      notifications: {
        navLabel: "Signal Center",
        navHint: "Alert vault",
        title: "Signal center",
        primaryAction: "Compose signal",
        secondaryAction: "Review unread signals",
      },
      settings: {
        navLabel: "Preferences",
        navHint: "HQ config",
        title: "Workspace prefs",
        primaryAction: "Apply prefs",
        secondaryAction: "Read config history",
      },
      admin: {
        navLabel: "Governance",
        navHint: "Control policy",
        title: "Governance room",
        primaryAction: "Inspect governance log",
        secondaryAction: "Manage control roles",
      },
    },
  },
}

const versionCache = new Map<VersionId, VersionDefinition>()

export function isVersionId(value: string): value is VersionId {
  return AVAILABLE_VERSIONS.includes(value as VersionId)
}

export function getPathForScreen(
  screenKey: ScreenKey,
  params?: { employeeId?: string },
) {
  const employeeId = params?.employeeId ?? "emp-001"

  switch (screenKey) {
    case "employeeDetails":
      return `employees/${employeeId}`
    case "employeeEdit":
      return `employees/${employeeId}/edit`
    default:
      return SCREEN_PATHS[screenKey]
  }
}

export function getVersionDefinition(versionId: VersionId): VersionDefinition {
  const cached = versionCache.get(versionId)

  if (cached) {
    return cached
  }

  if (versionId === "v0") {
    versionCache.set("v0", v0)
    return v0
  }

  const previousVersionId =
    AVAILABLE_VERSIONS[AVAILABLE_VERSIONS.indexOf(versionId) - 1]
  const previous = getVersionDefinition(previousVersionId)
  const delta = versionDeltas[versionId]

  const merged: VersionDefinition = {
    ...previous,
    id: versionId,
    releaseLabel: delta.releaseLabel ?? previous.releaseLabel,
    changeSummary: delta.changeSummary ?? previous.changeSummary,
    notice: delta.notice ?? previous.notice,
    shellLabel: delta.shellLabel ?? previous.shellLabel,
    shellDescription: delta.shellDescription ?? previous.shellDescription,
    driftMarkers: delta.driftMarkers ?? previous.driftMarkers,
    navigation: delta.navigation ?? previous.navigation,
    theme: {
      ...previous.theme,
      ...delta.theme,
    },
    screens: mergeScreens(previous.screens, delta.screens),
  }

  versionCache.set(versionId, merged)
  return merged
}

function mergeScreens(
  previous: Record<ScreenKey, ScreenDefinition>,
  delta?: Partial<Record<ScreenKey, Partial<ScreenDefinition>>>,
) {
  const next = { ...previous }

  if (!delta) {
    return next
  }

  for (const key of Object.keys(previous) as ScreenKey[]) {
    const override = delta[key]

    if (!override) {
      next[key] = previous[key]
      continue
    }

    next[key] = {
      ...previous[key],
      ...override,
    }
  }

  return next
}
