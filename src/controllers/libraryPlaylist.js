import { getLibraryByIdDb } from '../domains/library.js'
import {
  createLibraryPlaylistDb,
  deleteLibraryPlaylistDb,
  getLibraryPlaylistDb,
  getLibraryPlaylistsDb,
} from '../domains/libraryPlaylist.js'
import { getPlaylistByIdDb } from '../domains/playlist.js'
import { NotFoundError } from '../errors/ApiError.js'

const getLibraryPlaylists = async (req, res) => {
  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const libraryPlaylists = await getLibraryPlaylistsDb(req.user.id)

  res.json({
    libraryPlaylists: libraryPlaylists.rows,
  })
}

const createLibraryPlaylist = async (req, res) => {
  const { playlistId } = req.body

  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const playlist = await getPlaylistByIdDb(playlistId)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  await createLibraryPlaylistDb(req.user.id, playlistId)
  const libraryPlaylist = await getLibraryPlaylistDb(req.user.id, playlistId)

  res.status(201).json({
    libraryPlaylist: libraryPlaylist.rows[0],
  })
}

const deleteLibraryPlaylist = async (req, res) => {
  const { id } = req.params

  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const playlist = await getPlaylistByIdDb(id)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  const libraryPlaylist = await getLibraryPlaylistDb(req.user.id, id)

  if (!libraryPlaylist.rowCount) {
    throw new NotFoundError('LibraryPlaylist not found')
  }

  await deleteLibraryPlaylistDb(req.user.id, id)

  res.json({
    libraryPlaylist: libraryPlaylist.rows[0],
  })
}

export { getLibraryPlaylists, createLibraryPlaylist, deleteLibraryPlaylist }
