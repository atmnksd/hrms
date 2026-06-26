import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import pg from "pg"

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed the database.")
  }

  const sql = await readFile(path.join(__dirname, "seed.sql"), "utf8")
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  })

  const client = await pool.connect()

  try {
    await client.query(sql)
    console.log("Seed complete.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
