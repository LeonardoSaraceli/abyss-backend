import { Router } from 'express'
import { isTokenValid } from '../middleware/auth.js'
import {
  createPlaylistMusic,
  deletePlaylistMusic,
  getPlaylistMusics,
} from '../controllers/playlistMusic.js'

const route = Router()

route.get('/:id', isTokenValid, getPlaylistMusics)
route.post('/', isTokenValid, createPlaylistMusic)
route.delete('/', isTokenValid, deletePlaylistMusic)

export default route
