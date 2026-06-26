export default function LoadingVersionedScreen() {
  return (
    <div className="min-h-svh bg-slate-950 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-28 animate-pulse rounded-[2rem] bg-white/8" />
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <div className="h-[34rem] animate-pulse rounded-[2rem] bg-white/8" />
          <div className="flex flex-col gap-5">
            <div className="h-44 animate-pulse rounded-[2rem] bg-white/8" />
            <div className="grid gap-5 md:grid-cols-3">
              <div className="h-36 animate-pulse rounded-[2rem] bg-white/8" />
              <div className="h-36 animate-pulse rounded-[2rem] bg-white/8" />
              <div className="h-36 animate-pulse rounded-[2rem] bg-white/8" />
            </div>
            <div className="h-72 animate-pulse rounded-[2rem] bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  )
}
