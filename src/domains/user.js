import { db } from '../lib/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getAllUsersDb = async () => {
  return await db.query('SELECT * FROM users')
}

const getUserByEmailDb = async (email) => {
  return await db.query('SELECT * FROM users WHERE email = $1', [email])
}

const createUserDb = async (email, password, name) => {
  return await db.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
    [email, await bcrypt.hash(String(password), 10), name]
  )
}

const createTokenDb = (userId, secretKey) => {
  return jwt.sign({ id: userId }, secretKey)
}

const verifyPasswordDb = async (formPw, userPw) => {
  return await bcrypt.compare(String(formPw), String(userPw))
}

const getUserByIdDb = async (userId) => {
  return await db.query('SELECT * FROM users WHERE id = $1', [userId])
}

const updateUserByIdDb = async (fieldsToUpdate, userId) => {
  const fieldsToUpdateArr = Object.entries(fieldsToUpdate)
  const values = []
  let query = 'UPDATE users SET '

  fieldsToUpdateArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}, `
    values.push(value)
  })

  query += `updatedAt = $${fieldsToUpdateArr.length + 1} WHERE id = $${
    fieldsToUpdateArr.length + 2
  }`
  values.push(new Date())
  values.push(userId)

  return await db.query(query, values)
}

const deleteUserByIdDb = async (userId) => {
  return await db.query('DELETE FROM users WHERE id = $1', [userId])
}

export {
  getAllUsersDb,
  getUserByEmailDb,
  createUserDb,
  createTokenDb,
  verifyPasswordDb,
  getUserByIdDb,
  updateUserByIdDb,
  deleteUserByIdDb,
}
