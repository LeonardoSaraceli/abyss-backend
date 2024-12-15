import { db } from '../lib/db.js'

const createLibraryDb = async (userId) => {
  return await db.query('INSERT INTO libraries (userId) values ($1)', [userId])
}

const getLibraryByIdDb = async (userId) => {
  return await db.query('SELECT * FROM libraries WHERE userId = $1', [userId])
}

export { createLibraryDb, getLibraryByIdDb }
