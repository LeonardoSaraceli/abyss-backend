import { getAlbumByIdDb } from '../domains/album.js'
import {
  createMusicDb,
  deleteMusicByIdDb,
  getAllMusicsDb,
  getLatestMusicDb,
  getMusicByIdDb,
  updateMusicDb,
} from '../domains/music.js'
import { getUserByIdDb } from '../domains/user.js'
import { addUsersToMusicDb } from '../domains/userMusic.js'
import { MissingFieldsError, NotFoundError } from '../errors/ApiError.js'

const createMusic = async (req, res) => {
  const { url, cover, title, users } = req.body

  if (!url || !cover || !title || !users) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  for (const user of users) {
    const existingUser = await getUserByIdDb(user.id)

    if (!existingUser.rowCount) {
      throw new NotFoundError(`User with id ${user.id} not found`)
    }
  }

  await createMusicDb(url, cover, title)
  const music = await getLatestMusicDb()
  await addUsersToMusicDb(users, music.rows[0].id)

  res.status(201).json({
    music: music.rows[0],
  })
}

const getAllMusics = async (req, res) => {
  const musics = await getAllMusicsDb()

  res.json({
    musics: musics.rows,
  })
}

const getMusicById = async (req, res) => {
  const { id } = req.params

  const music = await getMusicByIdDb(id)

  if (!music.rowCount) {
    throw new NotFoundError('Music not found')
  }

  res.json({
    music: music.rows[0],
  })
}

const deleteMusicById = async (req, res) => {
  const { id } = req.params

  const music = await getMusicByIdDb(id)

  if (!music.rowCount) {
    throw new NotFoundError('Music not found')
  }

  await deleteMusicByIdDb(id)

  res.json({
    music: music.rows[0],
  })
}

const updateMusicById = async (req, res) => {
  const { url, cover, title, albumId } = req.body
  const { id } = req.params

  if (!url && !cover && !title && !albumId) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  const album = await getAlbumByIdDb(albumId)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  const music = await getMusicByIdDb(id)

  if (!music.rowCount) {
    throw new NotFoundError('Music not found')
  }

  const fieldsToUpdate = Object.fromEntries(
    Object.entries({ url, cover, title, albumId }).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  )

  await updateMusicDb(fieldsToUpdate, id)
  const updatedMusic = await getMusicByIdDb(id)

  res.json({
    music: updatedMusic.rows[0],
  })
}

export {
  createMusic,
  getAllMusics,
  getMusicById,
  deleteMusicById,
  updateMusicById,
}
