import { db } from '../lib/db.js'

const getPlaylistMusicsDb = async (playlistId) => {
  return await db.query(
    'SELECT * FROM playlists_musics WHERE playlistId = $1',
    [playlistId]
  )
}

const createPlaylistMusicDb = async (playlistId, musicId) => {
  return await db.query(
    'INSERT INTO playlists_musics (playlistId, musicId) VALUES ($1, $2)',
    [playlistId, musicId]
  )
}

const getPlaylistMusicDb = async (playlistId, musicId) => {
  return await db.query(
    'SELECT * FROM playlists_musics WHERE playlistId = $1 AND musicId = $2',
    [playlistId, musicId]
  )
}

const deletePlaylistMusicDb = async (playlistId, musicId) => {
  return await db.query(
    'DELETE FROM playlists_musics WHERE playlistId = $1 AND musicId = $2',
    [playlistId, musicId]
  )
}

export {
  getPlaylistMusicsDb,
  createPlaylistMusicDb,
  getPlaylistMusicDb,
  deletePlaylistMusicDb,
}
