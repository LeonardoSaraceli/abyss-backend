import { Router } from 'express'
import {
  createAlbum,
  deleteAlbumById,
  getAlbumById,
  getAllAlbums,
  updateAlbumById,
} from '../controllers/album.js'

const route = Router()

route.get('/', getAllAlbums)
route.get('/:id', getAlbumById)
route.post('/', createAlbum)
route.put('/:id', updateAlbumById)
route.delete('/:id', deleteAlbumById)

export default route
