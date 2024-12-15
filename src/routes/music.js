import { Router } from 'express'
import {
  createMusic,
  deleteMusicById,
  getAllMusics,
  getMusicById,
  updateMusicById,
} from '../controllers/music.js'

const route = Router()

route.get('/', getAllMusics)
route.get('/:id', getMusicById)
route.post('/', createMusic)
route.put('/:id', updateMusicById)
route.delete('/:id', deleteMusicById)

export default route
