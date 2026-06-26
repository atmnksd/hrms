import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

declare global {
  var __hrmsPrisma__: PrismaClient | undefined
  var __hrmsPrismaAdapter__: PrismaPg | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the HRMS backend.")
}

const adapter =
  globalThis.__hrmsPrismaAdapter__ ?? new PrismaPg(process.env.DATABASE_URL)

export const prisma =
  globalThis.__hrmsPrisma__ ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalThis.__hrmsPrismaAdapter__ = adapter
  globalThis.__hrmsPrisma__ = prisma
}
