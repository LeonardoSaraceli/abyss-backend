import { Router } from 'express'
import { isTokenValid } from '../middleware/auth.js'
import {
  createPlaylist,
  deletePlaylistById,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
} from '../controllers/playlist.js'

const route = Router()

route.get('/', getAllPlaylists)
route.get('/:id', getPlaylistById)
route.post('/', isTokenValid, createPlaylist)
route.put('/:id', isTokenValid, updatePlaylistById)
route.delete('/:id', isTokenValid, deletePlaylistById)

export default route
