import { Router } from 'express'
import { getAllUsersAlbums } from '../controllers/userAlbum.js'

const route = Router()

route.get('/', getAllUsersAlbums)

export default route
