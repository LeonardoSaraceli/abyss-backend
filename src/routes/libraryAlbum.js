import { Router } from 'express'
import { isTokenValid } from '../middleware/auth.js'
import {
  createLibraryAlbum,
  deleteLibraryAlbum,
  getLibraryAlbums,
} from '../controllers/libraryAlbum.js'

const route = Router()

route.get('/', isTokenValid, getLibraryAlbums)
route.post('/', isTokenValid, createLibraryAlbum)
route.delete('/:id', isTokenValid, deleteLibraryAlbum)

export default route
