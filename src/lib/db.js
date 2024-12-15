import pkg from 'pg'
const { Pool } = pkg

const { PGHOST, PGDB, PGUSER, PGPASSWORD, PGPORT } = process.env

export const db = new Pool({
  host: PGHOST,
  database: PGDB,
  user: PGUSER,
  password: PGPASSWORD,
  port: Number(PGPORT),
})
