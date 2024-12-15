import {
  createPlaylistMusicDb,
  deletePlaylistMusicDb,
  getPlaylistMusicDb,
  getPlaylistMusicsDb,
} from '../domains/playlistMusic.js'
import { getMusicByIdDb } from '../domains/music.js'
import { getPlaylistByIdDb } from '../domains/playlist.js'
import { NotFoundError } from '../errors/ApiError.js'

const getPlaylistMusics = async (req, res) => {
  const { id } = req.params

  const playlist = await getPlaylistByIdDb(id)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  const playlistMusics = await getPlaylistMusicsDb(id)

  res.json({
    playlistMusics: playlistMusics.rows,
  })
}

const createPlaylistMusic = async (req, res) => {
  const { playlistId, musicId } = req.body

  const playlist = await getPlaylistByIdDb(playlistId)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  const music = await getMusicByIdDb(musicId)

  if (!music.rowCount) {
    throw new NotFoundError('Music not found')
  }

  await createPlaylistMusicDb(playlistId, musicId)
  const playlistMusic = await getPlaylistMusicDb(playlistId, musicId)

  res.status(201).json({
    playlistMusic: playlistMusic.rows[0],
  })
}

const deletePlaylistMusic = async (req, res) => {
  const { playlistId, musicId } = req.query

  const playlist = await getPlaylistByIdDb(playlistId)

  if (!playlist.rowCount) {
    throw new NotFoundError('Playlist not found')
  }

  const music = await getMusicByIdDb(musicId)

  if (!music.rowCount) {
    throw new NotFoundError('Music not found')
  }

  const playlistMusic = await getPlaylistMusicDb(playlistId, musicId)

  if (!playlistMusic.rowCount) {
    throw new NotFoundError('playlistMusic not found')
  }

  await deletePlaylistMusicDb(playlistId, musicId)

  res.json({
    playlistMusic: playlistMusic.rows[0],
  })
}

export { getPlaylistMusics, createPlaylistMusic, deletePlaylistMusic }
