import { createLibraryDb } from '../domains/library.js'
import {
  createTokenDb,
  createUserDb,
  deleteUserByIdDb,
  getAllUsersDb,
  getUserByEmailDb,
  getUserByIdDb,
  updateUserByIdDb,
  verifyPasswordDb,
} from '../domains/user.js'
import {
  MissingFieldsError,
  NotFoundError,
  UniqueFieldError,
} from '../errors/ApiError.js'

const getUserInfo = async (req, res) => {
  const user = await getUserByIdDb(req.user.id)

  if (user.rowCount) {
    delete user.rows[0].password

    return res.json({
      user: user.rows[0],
    })
  }
}

const getAllUsers = async (req, res) => {
  const users = await getAllUsersDb()

  const usersWithoutPassword = users.rows.map(({ password, ...user }) => user)

  res.json({
    users: usersWithoutPassword,
  })
}

const getUserById = async (req, res) => {
  const { id } = req.params

  const user = await getUserByIdDb(id)

  if (!user.rowCount) {
    throw new NotFoundError('User not found')
  }

  delete user.rows[0].password

  res.json({
    user: user.rows[0],
  })
}

const createUser = async (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password || !name) {
    throw new MissingFieldsError('Missing field in request body')
  }

  const isEmailUnique = await getUserByEmailDb(email)

  if (isEmailUnique.rowCount) {
    throw new UniqueFieldError('Email already registered')
  }

  await createUserDb(email, password, name)
  const user = await getUserByEmailDb(email)
  await createLibraryDb(user.rows[0].id)
  const token = createTokenDb(user.rows[0].id, process.env.SECRETKEY)

  res.status(201).json({
    token,
  })
}

const createToken = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new MissingFieldsError('Missing field in request body')
  }

  const user = await getUserByEmailDb(email)

  if (!user.rowCount) {
    throw new NotFoundError('User not found')
  }

  const isPasswordValid = await verifyPasswordDb(
    password,
    user.rows[0].password
  )

  if (!isPasswordValid) {
    throw new NotFoundError('User not found')
  }

  const token = createTokenDb(user.rows[0].id, process.env.SECRETKEY)

  res.status(201).json({
    token,
  })
}

const updateUserById = async (req, res) => {
  const { name, email, picture } = req.body
  const { id } = req.user

  if (!name && !email && !picture) {
    throw new MissingFieldsError('Missing field in request body')
  }

  if (email) {
    const existingEmail = await getUserByEmailDb(email)

    if (existingEmail.rowCount) {
      throw new UniqueFieldError('Email already registered')
    }
  }

  const fieldsToUpdate = {}

  if (name) {
    fieldsToUpdate.name = name
  }

  if (picture) {
    fieldsToUpdate.picture = picture
  }

  await updateUserByIdDb(fieldsToUpdate, id)

  const updatedUser = await getUserByIdDb(id)
  delete updatedUser.rows[0].password

  return res.json({
    user: updatedUser.rows[0],
  })
}

const deleteUserById = async (req, res) => {
  const user = await getUserByIdDb(req.user.id)

  if (!user.rowCount) {
    throw new NotFoundError('User not found')
  }

  await deleteUserByIdDb(req.user.id)
  delete user.rows[0].password

  res.json({
    user: user.rows[0],
  })
}

export {
  getUserInfo,
  getAllUsers,
  getUserById,
  createUser,
  createToken,
  updateUserById,
  deleteUserById,
}
