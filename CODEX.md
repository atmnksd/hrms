# Project Summary

This file is the running product and implementation brief for the `hrms` application.
It should be updated continuously as the product is clarified across multiple conversations.

## Current Status

The project purpose is partially documented.
Use this file as the source of truth for the app's evolving intent, scope, and constraints.
The initial feature set and versioning direction are now defined at a high level.
An initial implementation scaffold now exists for `v0` through `v4` with versioned screen routes and shared inherited screen definitions.

## Product Purpose

This project is an HRMS system sample application.
Its primary purpose is to demonstrate, practice, and test locator healing in a realistic product-style UI.

## Target Users

Pending user-provided details.

## Core Workflows

- Users and automated tests should be able to navigate the same logical HRMS screen across multiple UI versions.
- Screen routes should follow a versioned path convention such as `/v0/<screen-path>`, `/v1/<screen-path>`, `/v2/<screen-path>`, and so on.
- `v0` is the baseline and default first version of each screen.
- Later versions represent new deployments that change screen structure or presentation while keeping the underlying APIs stable.
- These version-to-version UI changes are intentional so automation locators may break and require healing.
- The version root such as `/v0` should behave like the real entry point of the HRMS system.
- If the user is authenticated, `/v0` should route into the working product area such as the dashboard.
- If the user is not authenticated, `/v0` should route to the login experience for that version.

## Functional Requirements

- The application should support multiple versions of the same screen under version-prefixed routes.
- Different screen versions should preserve the same business behavior and API contracts where possible.
- Newer screen versions should be able to introduce DOM, layout, labeling, or component-level changes that affect test locators.
- The system should make it easy to compare the same workflow across versions for locator-healing validation.
- The sample application should likely include around 4 to 5 UI versions for demonstration purposes.

## Application Modules

- Dashboard
- Login
- Employee Management
- Employee Management: List
- Employee Management: Details
- Employee Management: Add
- Employee Management: Edit
- Departments
- Leave Management
- Attendance
- Payroll
- Performance Reviews
- Documents
- Notifications
- Settings
- Admin

## Non-Functional Requirements

Pending user-provided details.

## Business Rules

Pending user-provided details.

## Roles And Permissions

Pending user-provided details.

## Data Model Notes

- The backend data store should use PostgreSQL.

## UI And UX Notes

- Each versioned screen should feel like a realistic follow-up deployment rather than an unrelated mock.
- Differences between versions can include layout changes, renamed labels, reordered sections, changed component composition, and other locator-impacting UI updates.
- Even though this is a demo application, it should not look or feel like a demo.
- The product should include realistic HRMS chrome such as global navigation, workspace headers, contextual actions, workflow tabs, breadcrumbs, and operational side panels.
- Screen flows should resemble a real internal enterprise application, especially across employee list, details, add, and edit journeys.

## Technical Constraints

- Versioned screen routing should follow `/v{n}/<rest-of-screen-path>` conventions.
- From a development perspective, new screen versions should be defined as deltas from previous versions rather than full rewrites.
- If a screen is not overridden in a newer version, it should inherit the implementation from the previous version by default.
- Prefer an implementation model where `v1` extends `v0`, `v2` extends `v1`, and so on, so only the changed parts need to be defined.
- The application should use PostgreSQL as its backend database.
- The application is intended to be deployed on Vercel.
- Only the screen layer should be versioned. Backend APIs should model the real HRMS product domain rather than versioned or generic demo resources.

## Implementation Notes

- The first UI scaffold includes `v0`, `v1`, `v2`, `v3`, and `v4`.
- Versioned routes should use explicit product pages under `/[version]/...`, not a catch-all slug screen resolver.
- Employee CRUD routes should follow product-like paths such as `/[version]/employees`, `/[version]/employees/new`, `/[version]/employees/[employeeId]`, and `/[version]/employees/[employeeId]/edit`.
- Screen definitions are resolved through inheritance so newer versions only override changed labels, copy, or structure-related metadata.
- The current implementation uses mock HRMS data and UI states to simulate locator drift across releases.
- The application now includes backend API routes under `/api/hrms/*`.
- A repository layer supports PostgreSQL when `DATABASE_URL` is configured and falls back to seeded in-process data for local development.
- Key screens now derive runtime content from backend-backed services rather than only from static screen metadata.
- Avoid generic catch-all APIs and generic catch-all screens where possible; prefer explicit HRMS modules such as employees, departments, leave requests, attendance, payroll issues, review cycles, documents, notifications, settings groups, and admin tasks.
- The architecture should resemble a real HRMS product, with only the visual and DOM presentation varying across `v0` to `v4`.
- Authentication now uses a cookie-backed HRMS session so version roots and protected product pages can redirect like a real system.
- Login, create employee, and edit employee flows should use actual HTML inputs and submit to the HRMS APIs instead of rendering placeholder boxes.
- After major route-structure changes, the Next.js dev server may need a restart so deleted catch-all routes do not linger in the local route graph.

## Open Questions

- Which user roles should be supported for testing scenarios?
- What kinds of locator-healing cases should the application intentionally help simulate?
- Should unversioned routes resolve to `v0`, or should only explicit versioned URLs be supported?
- Should version inheritance happen at page level, section level, component level, or support all three?
- Should all listed modules exist in all 4 to 5 versions, or should some appear only in later versions?
- Which modules should be prioritized first for implementation?

## Change Log

- 2026-06-26: Initialized `CODEX.md` as a living project summary for future prompts.
- 2026-06-26: Added the core purpose as an HRMS sample app for locator-healing practice and demonstration.
- 2026-06-26: Added the versioned screen-routing model with delta-based inheritance between UI versions.
- 2026-06-26: Added the planned HRMS module set and the expectation of roughly 4 to 5 screen versions.
- 2026-06-26: Added PostgreSQL as the backend data store and Vercel as the deployment target.
- 2026-06-26: Documented that the initial `v0` to `v4` implementation scaffold now exists with inherited versioned screen definitions.
- 2026-06-26: Added HRMS backend APIs, a repository layer with PostgreSQL support, and runtime screen data wiring.
- 2026-06-26: Clarified that the application should feel like a real HRMS product with realistic navigation and screen flows rather than a demo-style UI.
- 2026-06-26: Refined the architecture direction to favor explicit HRMS modules and product-specific APIs/screens rather than generic demo abstractions.
- 2026-06-26: Replaced catch-all versioned screen routing with explicit product page routes, including real employee CRUD-style URLs.
- 2026-06-26: Added auth-aware version-root redirects and real login/create/edit form inputs tied to HRMS APIs.
