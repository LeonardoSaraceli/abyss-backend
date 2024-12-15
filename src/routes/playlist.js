import { Router } from 'express'
import { isTokenValid, upload } from '../middleware/auth.js'
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
route.post('/', isTokenValid, upload.single('cover'), createPlaylist)
route.put('/:id', isTokenValid, upload.single('cover'), updatePlaylistById)
route.delete('/:id', isTokenValid, deletePlaylistById)

export default route
