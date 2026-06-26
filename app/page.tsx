import Link from "next/link"
import {
  ArrowRight,
  FileClock,
  GitBranch,
  LayoutTemplate,
  ShieldCheck,
} from "lucide-react"

import {
  APP_MODULES,
  AVAILABLE_VERSIONS,
  getVersionDefinition,
} from "@/lib/hrms-data"

const versionCards = AVAILABLE_VERSIONS.map((versionId) => {
  const version = getVersionDefinition(versionId)

  return {
    id: version.id,
    releaseLabel: version.releaseLabel,
    summary: version.changeSummary,
    notice: version.notice,
  }
})

export default function HomePage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(39,119,255,0.18),_transparent_32%),linear-gradient(180deg,_#fbfcff_0%,_#eef3fb_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                <GitBranch className="size-3.5" />
                Locator-healing playground
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
                  HRMS releases designed to break selectors without breaking
                  workflows.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Each version simulates a fresh deployment of the same HRMS
                  product. Screen hierarchy, labels, wrappers, and component
                  arrangements change over time while the core workflows stay
                  recognizable.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/v0/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Open baseline `v0`
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/v4/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Compare latest `v4`
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Build goals
                </span>
                <FileClock className="size-4 text-slate-500" />
              </div>
              <div className="grid gap-3">
                {[
                  "Version-prefixed routes from `/v0/...` through `/v4/...`.",
                  "Delta-only release definitions so newer versions inherit prior screens.",
                  "Consistent product workflows with intentionally shifting locators.",
                  "A realistic enough shell for automation practice and demonstrations.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          {versionCards.map((version) => (
            <Link
              key={version.id}
              href={`/${version.id}/dashboard`}
              className="group rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-950">
                  {version.id.toUpperCase()}
                </span>
                <LayoutTemplate className="size-4 text-slate-400 transition group-hover:text-slate-700" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                {version.releaseLabel}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {version.summary}
              </p>
              <p className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                {version.notice}
              </p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <ShieldCheck className="size-4" />
              Module surface
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              The sample app spans the full HRMS navigation.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {APP_MODULES.map((module) => (
                <span
                  key={module}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Suggested path
            </p>
            <div className="mt-4 grid gap-3">
              {[
                {
                  step: "1. Start in `v0/dashboard`",
                  detail: "Capture the baseline labels, headings, and component hierarchy.",
                },
                {
                  step: "2. Replay the same path in `v2`",
                  detail: "Observe renamed navigation items and reorganized content blocks.",
                },
                {
                  step: "3. Stress-test on `v4`",
                  detail: "Validate locator healing against stronger visual and structural drift.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-medium">{item.step}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
