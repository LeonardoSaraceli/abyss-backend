import { Router } from 'express'
import {
  createToken,
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserInfo,
  updateUserById,
} from '../controllers/user.js'
import { isTokenValid } from '../middleware/auth.js'

const route = Router()

route.get('/info', isTokenValid, getUserInfo)
route.get('/', getAllUsers)
route.get('/:id', getUserById)
route.post('/register', createUser)
route.post('/login', createToken)
route.put('/', isTokenValid, updateUserById)
route.delete('/', isTokenValid, deleteUserById)

export default route
