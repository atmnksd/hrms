import pg from "pg"

const { Pool } = pg

declare global {
  var __hrmsPgPool__: pg.Pool | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the HRMS backend.")
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  })
}

export const postgres = globalThis.__hrmsPgPool__ ?? createPool()

if (process.env.NODE_ENV !== "production") {
  globalThis.__hrmsPgPool__ = postgres
}
