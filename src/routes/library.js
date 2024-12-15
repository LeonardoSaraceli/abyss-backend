import { Router } from 'express'
import { isTokenValid } from '../middleware/auth.js'
import { getLibraryById } from '../controllers/library.js'

const route = Router()

route.get('/', isTokenValid, getLibraryById)

export default route
