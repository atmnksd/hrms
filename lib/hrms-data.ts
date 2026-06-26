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
    "Classic enterprise shell with descriptive labels and predictable content blocks.",
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
      cardsTitle: "Attendance signals",
      cards: [
        { title: "Late arrivals", description: "Nine employees crossed the grace period today." },
        { title: "Shift swaps", description: "Four pending approvals across customer support." },
        { title: "Remote presence", description: "63 employees marked remote for the day." },
        { title: "Biometric sync", description: "One office device has not uploaded the latest logs." },
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
      "A tidier release with product-style copy and stronger dashboard framing.",
    driftMarkers: [
      "Several buttons shift from direct verbs to softer action language.",
      "Navigation remains recognizable but adopts more product-oriented hints.",
      "Dashboard support content is grouped more tightly.",
    ],
    screens: {
      dashboard: {
        title: "People operations pulse",
        primaryAction: "Generate snapshot",
        secondaryAction: "Share digest",
        locatorRisk:
          "The dashboard CTA text and hero title changed, so exact-text selectors from v0 should no longer be trusted.",
        cards: [
          {
            title: "Action queue",
            description: "Ten people operations items are waiting across approvals, renewals, and payroll checks.",
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
        title: "Access the HR workspace",
        primaryAction: "Continue",
        secondaryAction: "Continue with SSO",
      },
      employeesList: {
        navLabel: "Employees",
        title: "Employee directory",
        primaryAction: "Create employee",
        table: {
          title: "People directory",
          columns: ["Person", "Role", "Team", "Status"],
          rows: [
            ["Ava Patel", "Senior Recruiter", "Talent", "Active"],
            ["Noah Silva", "Payroll Analyst", "Finance", "Active"],
            ["Mia Shah", "Office Manager", "Admin", "Probation"],
            ["Liam Wong", "Engineering Manager", "Engineering", "Remote"],
          ],
        },
      },
      employeeAdd: {
        title: "Create employee record",
        formTitle: "New joiner intake",
        primaryAction: "Create profile",
      },
      payroll: {
        navLabel: "Compensation",
        title: "Compensation readiness",
        primaryAction: "Run compensation check",
      },
      notifications: {
        title: "Alert center",
        primaryAction: "Draft alert",
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
      "Navigation and headings emphasize a faster-moving, operations-focused vocabulary.",
    driftMarkers: [
      "Employee-facing modules now use People phrasing in multiple places.",
      "Some labels are shortened while others become more operational.",
      "Section titles are less verbose than the baseline release.",
    ],
    screens: {
      dashboard: {
        navLabel: "Home Pulse",
        title: "Workforce pulseboard",
        secondaryAction: "Broadcast digest",
      },
      employeesList: {
        navLabel: "People Directory",
        navHint: "Roster",
        title: "People roster",
        secondaryAction: "Download roster",
      },
      employeeDetails: {
        navLabel: "People Profile",
        title: "People profile",
        secondaryAction: "Export profile pack",
      },
      employeeEdit: {
        navLabel: "Update Profile",
        title: "Update people profile",
        primaryAction: "Apply updates",
      },
      departments: {
        title: "Org units",
        secondaryAction: "Open org map",
      },
      leaveManagement: {
        navLabel: "Time Away",
        title: "Time away queue",
        primaryAction: "Request time away",
      },
      attendance: {
        title: "Presence board",
        primaryAction: "Capture attendance",
      },
      performanceReviews: {
        navLabel: "Performance",
        title: "Review cycles",
      },
      documents: {
        title: "Records vault",
        secondaryAction: "Inspect expiring files",
      },
      settings: {
        title: "Workspace settings",
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
      "A more opinionated shell that feels like a product relaunch instead of a minor UI polish.",
    driftMarkers: [
      "Hero headlines are shorter and more brand-like.",
      "Action labels shift away from baseline enterprise wording.",
      "Content zones use stronger abstractions such as command, vault, and board.",
    ],
    screens: {
      dashboard: {
        title: "Command deck",
        primaryAction: "Launch board export",
        secondaryAction: "Pin digest",
      },
      login: {
        title: "Enter TeamOS",
        description:
          "The shared authentication flow now uses a more branded entry experience while preserving the same meaning.",
        primaryAction: "Enter workspace",
      },
      employeesList: {
        title: "Roster board",
        locatorRisk:
          "The list route is unchanged, but the title, navigation label, and primary action language now differ substantially from the baseline.",
        primaryAction: "Open intake",
      },
      employeeAdd: {
        title: "Launch new profile",
        formTitle: "Profile intake console",
        secondaryAction: "Stage draft",
      },
      leaveManagement: {
        title: "Absence command",
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
      payroll: {
        title: "Payrun board",
        primaryAction: "Check payrun health",
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
      notifications: {
        navLabel: "Inbox",
        title: "Ops inbox",
        secondaryAction: "Focus unread",
      },
      admin: {
        title: "Control room",
        primaryAction: "Inspect audit stream",
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
      "Compact, release-hardened UI language with the highest amount of locator drift among the current versions.",
    driftMarkers: [
      "Several titles become intentionally shorter and less literal.",
      "Buttons use productized phrasing instead of classic CRUD verbs.",
      "Navigation drift is strongest here while route conventions remain stable.",
    ],
    screens: {
      dashboard: {
        navLabel: "HQ",
        title: "Ops HQ",
        primaryAction: "Ship digest",
      },
      login: {
        navLabel: "Access",
        title: "Unlock workspace",
        secondaryAction: "Use identity provider",
      },
      employeesList: {
        navLabel: "Roster",
        title: "Team roster",
        primaryAction: "Launch intake",
      },
      employeeDetails: {
        title: "Profile hub",
        cardsTitle: "Linked surfaces",
      },
      employeeEdit: {
        title: "Tune profile",
        secondaryAction: "Reset edits",
      },
      departments: {
        navLabel: "Org Design",
        title: "Org design",
      },
      attendance: {
        navLabel: "Presence",
        title: "Presence grid",
        secondaryAction: "Download anomalies",
      },
      payroll: {
        navLabel: "Payrun",
        title: "Payrun health",
      },
      performanceReviews: {
        navLabel: "Growth",
        title: "Growth cycles",
        primaryAction: "Launch cycle",
      },
      documents: {
        navLabel: "Vault",
        title: "File vault",
      },
      settings: {
        navLabel: "Preferences",
        title: "Workspace prefs",
      },
      admin: {
        navLabel: "Governance",
        title: "Governance room",
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
