import { Router } from 'express'
import { getAllUsersMusics } from '../controllers/userMusic.js'

const route = Router()

route.get('/', getAllUsersMusics)

export default route
