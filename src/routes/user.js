import { Router } from 'express'
import {
  createToken,
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.js'
import { isTokenValid, upload } from '../middleware/auth.js'

const route = Router()

route.get('/', getAllUsers)
route.get('/:id', getUserById)
route.post('/register', createUser)
route.post('/login', createToken)
route.put('/', isTokenValid, upload.single('picture'), updateUserById)
route.delete('/', isTokenValid, deleteUserById)

export default route
