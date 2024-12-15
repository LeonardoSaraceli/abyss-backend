import { Router } from 'express'
import { isTokenValid } from '../middleware/auth.js'
import {
  createLibraryPlaylist,
  deleteLibraryPlaylist,
  getLibraryPlaylists,
} from '../controllers/libraryPlaylist.js'

const route = Router()

route.get('/', isTokenValid, getLibraryPlaylists)
route.post('/', isTokenValid, createLibraryPlaylist)
route.delete('/:id', isTokenValid, deleteLibraryPlaylist)

export default route
