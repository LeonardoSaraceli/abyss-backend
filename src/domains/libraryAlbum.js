import { db } from '../lib/db.js'

const getLibraryAlbumsDb = async (libraryId) => {
  return await db.query('SELECT * FROM libraries_albums WHERE libraryId = $1', [
    libraryId,
  ])
}

const createLibraryAlbumDb = async (libraryId, albumId) => {
  return await db.query(
    'INSERT INTO libraries_albums (libraryId, albumId) VALUES ($1, $2)',
    [libraryId, albumId]
  )
}

const getLibraryAlbumDb = async (libraryId, albumId) => {
  return await db.query(
    'SELECT * FROM libraries_albums WHERE libraryId = $1 AND albumId = $2',
    [libraryId, albumId]
  )
}

const deleteLibraryAlbumDb = async (libraryId, albumId) => {
  return await db.query(
    'DELETE FROM libraries_albums WHERE libraryId = $1 AND albumId = $2',
    [libraryId, albumId]
  )
}

export {
  getLibraryAlbumsDb,
  createLibraryAlbumDb,
  getLibraryAlbumDb,
  deleteLibraryAlbumDb,
}
