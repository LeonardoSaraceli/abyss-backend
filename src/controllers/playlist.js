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
import { createClient } from '@supabase/supabase-js'

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

const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY)

const createPlaylist = async (req, res) => {
  if (!req.file || !req.body.title) {
    throw new MissingFieldsError('Missing fields in request body')
  }

  const { title } = req.body
  const file = req.file

  const filePath = `${Date.now()}-${file.originalname}`

  const { error: uploadError } = await supabase.storage
    .from(process.env.BUCKETNAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    })

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`)
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(process.env.BUCKETNAME)
    .createSignedUrl(filePath, 60 * 60 * 24)

  if (signedError) {
    throw new Error(`Failed to generate signed URL: ${signedError.message}`)
  }

  await createPlaylistDb(signedData.signedUrl, title, req.user.id)
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

  const fieldsToUpdate = {}

  if (title) {
    fieldsToUpdate.title = title
  }

  if (cover && req.file) {
    const file = req.file
    const filePath = `${Date.now()}-${file.originalname}`

    if (playlist.rows[0].cover) {
      const { error: deleteError } = await supabase.storage
        .from(process.env.BUCKETNAME)
        .remove([playlist.rows[0].cover])

      if (deleteError) {
        throw new Error(`Failed to delete old cover: ${deleteError.message}`)
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(process.env.BUCKETNAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      })

    if (uploadError) {
      throw new Error(`Failed to upload new cover: ${uploadError.message}`)
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(process.env.BUCKETNAME)
      .createSignedUrl(filePath, 60 * 60 * 24)

    if (signedError) {
      throw new Error(`Failed to generate signed URL: ${signedError.message}`)
    }

    fieldsToUpdate.cover = signedData.signedUrl
  }

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
