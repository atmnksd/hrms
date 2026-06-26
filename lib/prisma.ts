import { PrismaClient } from "@prisma/client"

declare global {
  var __hrmsPrisma__: PrismaClient | undefined
}

export const prisma =
  globalThis.__hrmsPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalThis.__hrmsPrisma__ = prisma
}
