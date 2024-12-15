import {
  createAlbumDb,
  deleteAlbumByIdDb,
  getAlbumByIdDb,
  getAllAlbumMusicsByIdDb,
  getAllAlbumsDb,
  getLatestAlbumDb,
  updateAlbumByIdDb,
} from '../domains/album.js'
import { getUserByIdDb } from '../domains/user.js'
import { addUsersToAlbumDb } from '../domains/userAlbum.js'
import { MissingFieldsError, NotFoundError } from '../errors/ApiError.js'

const getAllAlbums = async (req, res) => {
  const albums = await getAllAlbumsDb()

  res.json({
    albums: albums.rows,
  })
}

const getAlbumById = async (req, res) => {
  const { id } = req.params

  const album = await getAlbumByIdDb(id)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  const musics = await getAllAlbumMusicsByIdDb(id)

  res.json({
    album: {
      ...album.rows[0],
      musics: musics.rowCount > 0 ? musics.rows : [],
    },
  })
}

const createAlbum = async (req, res) => {
  const { cover, title, users } = req.body

  if (!cover || !title || !users) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  for (const user of users) {
    const existingUser = await getUserByIdDb(user.id)

    if (!existingUser.rowCount) {
      throw new NotFoundError(`User with id ${user.id} not found`)
    }
  }

  await createAlbumDb(cover, title)
  const album = await getLatestAlbumDb()
  await addUsersToAlbumDb(users, album.rows[0].id)

  res.status(201).json({
    album: album.rows[0],
  })
}

const updateAlbumById = async (req, res) => {
  const { cover, title } = req.body
  const { id } = req.params

  const album = await getAlbumByIdDb(id)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  if (!cover && !title) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  const fieldsToUpdate = Object.fromEntries(
    Object.entries({ cover, title }).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  )

  await updateAlbumByIdDb(fieldsToUpdate, id)
  const updatedAlbum = await getAlbumByIdDb(id)

  res.json({
    album: updatedAlbum.rows[0],
  })
}

const deleteAlbumById = async (req, res) => {
  const { id } = req.params

  const album = await getAlbumByIdDb(id)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  await deleteAlbumByIdDb(id)

  res.json({
    album: album.rows[0],
  })
}

export {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbumById,
  deleteAlbumById,
}
