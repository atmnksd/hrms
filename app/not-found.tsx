import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Route missing
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.04em]">
          This HRMS screen does not exist.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Try one of the released dashboards or return to the version launcher.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
          >
            Back to launcher
          </Link>
          <Link
            href="/v0/dashboard"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
          >
            Open `v0/dashboard`
          </Link>
        </div>
      </div>
    </main>
  )
}
