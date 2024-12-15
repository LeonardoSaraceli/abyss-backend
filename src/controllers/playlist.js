import {
  createLibraryPlaylistDb,
  deleteLibraryPlaylistDb,
} from '../domains/libraryPlaylist.js'
import {
  createPlaylistDb,
  deletePlaylistByIdDb,
  getAllPlaylistsDb,
  getLatestPlaylistDb,
  getPlaylistByIdDb,
  updatePlaylistByIdDb,
} from '../domains/playlist.js'
import { MissingFieldsError, NotFoundError } from '../errors/ApiError.js'

const getAllPlaylists = async (req, res) => {
  const playlists = await getAllPlaylistsDb()

  res.json({
    playlists: playlists.rows,
  })
}

const getPlaylistById = async (req, res) => {
  const { id } = req.params

  const playlist = await getPlaylistByIdDb(id)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  res.json({
    playlist: playlist.rows[0],
  })
}

const createPlaylist = async (req, res) => {
  const { cover, title } = req.body

  if (!cover || !title) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  await createPlaylistDb(cover, title, req.user.id)
  const playlist = await getLatestPlaylistDb()
  await createLibraryPlaylistDb(req.user.id, playlist.rows[0].id)

  res.status(201).json({
    playlist: playlist.rows[0],
  })
}

const updatePlaylistById = async (req, res) => {
  const { cover, title } = req.body
  const { id } = req.params

  if (!cover && !title) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  const playlist = await getPlaylistByIdDb(id)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  const fieldsToUpdate = Object.fromEntries(
    Object.entries({ cover, title }).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  )

  await updatePlaylistByIdDb(fieldsToUpdate, id, req.user.id)
  const updatedPlaylist = await getPlaylistByIdDb(id)

  res.json({
    playlist: updatedPlaylist.rows[0],
  })
}

const deletePlaylistById = async (req, res) => {
  const { id } = req.params

  const playlist = await getPlaylistByIdDb(id)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  await deletePlaylistByIdDb(id)
  await deleteLibraryPlaylistDb(req.user.id, id)

  res.json({
    playlist: playlist.rows[0],
  })
}

export {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylistById,
  deletePlaylistById,
}
