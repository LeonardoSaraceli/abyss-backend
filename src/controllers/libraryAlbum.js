import { getAlbumByIdDb } from '../domains/album.js'
import { getLibraryByIdDb } from '../domains/library.js'
import {
  createLibraryAlbumDb,
  deleteLibraryAlbumDb,
  getLibraryAlbumDb,
  getLibraryAlbumsDb,
} from '../domains/libraryAlbum.js'
import { NotFoundError } from '../errors/ApiError.js'

const getLibraryAlbums = async (req, res) => {
  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const libraryAlbums = await getLibraryAlbumsDb(req.user.id)

  res.json({
    libraryAlbums: libraryAlbums.rows,
  })
}

const createLibraryAlbum = async (req, res) => {
  const { albumId } = req.body

  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const album = await getAlbumByIdDb(albumId)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  await createLibraryAlbumDb(req.user.id, albumId)
  const libraryAlbum = await getLibraryAlbumDb(req.user.id, albumId)

  res.status(201).json({
    libraryAlbum: libraryAlbum.rows[0],
  })
}

const deleteLibraryAlbum = async (req, res) => {
  const { id } = req.params

  const library = await getLibraryByIdDb(req.user.id)

  if (!library.rowCount) {
    throw new NotFoundError('Library not found')
  }

  const album = await getAlbumByIdDb(id)

  if (!album.rowCount) {
    throw new NotFoundError('Album not found')
  }

  const libraryAlbum = await getLibraryAlbumDb(req.user.id, id)

  if (!libraryAlbum.rowCount) {
    throw new NotFoundError('LibraryAlbum not found')
  }

  await deleteLibraryAlbumDb(req.user.id, id)

  res.json({
    libraryAlbum: libraryAlbum.rows[0],
  })
}

export { getLibraryAlbums, createLibraryAlbum, deleteLibraryAlbum }
