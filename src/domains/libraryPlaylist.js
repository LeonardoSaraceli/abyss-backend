import { db } from '../lib/db.js'

const getLibraryPlaylistsDb = async (libraryId) => {
  return await db.query(
    'SELECT * FROM libraries_playlists WHERE libraryId = $1',
    [libraryId]
  )
}

const createLibraryPlaylistDb = async (libraryId, playlistId) => {
  return await db.query(
    'INSERT INTO libraries_playlists (libraryId, playlistId) VALUES ($1, $2)',
    [libraryId, playlistId]
  )
}

const getLibraryPlaylistDb = async (libraryId, playlistId) => {
  return await db.query(
    'SELECT * FROM libraries_playlists WHERE libraryId = $1 AND playlistId = $2',
    [libraryId, playlistId]
  )
}

const deleteLibraryPlaylistDb = async (libraryId, playlistId) => {
  return await db.query(
    'DELETE FROM libraries_playlists WHERE libraryId = $1 AND playlistId = $2',
    [libraryId, playlistId]
  )
}

export {
  getLibraryPlaylistsDb,
  createLibraryPlaylistDb,
  getLibraryPlaylistDb,
  deleteLibraryPlaylistDb,
}
