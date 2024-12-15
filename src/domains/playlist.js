import { db } from '../lib/db.js'

const getAllPlaylistsDb = async () => {
  return await db.query('SELECT * FROM playlists')
}

const getPlaylistByIdDb = async (playlistId) => {
  return await db.query('SELECT * FROM playlists WHERE id = $1', [playlistId])
}

const createPlaylistDb = async (cover, title, userId) => {
  return await db.query(
    'INSERT INTO playlists (cover, title, userId) VALUES ($1, $2, $3)',
    [cover, title, userId]
  )
}

const getLatestPlaylistDb = async () => {
  return await db.query(
    'SELECT * FROM playlists ORDER BY createdAt DESC LIMIT 1'
  )
}

const updatePlaylistByIdDb = async (fieldsToUpdate, playlistId, userId) => {
  const fieldsToUpdateArr = Object.entries(fieldsToUpdate)
  const values = []
  let query = 'UPDATE playlists SET '

  fieldsToUpdateArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}, `
    values.push(value)
  })

  query += `updatedAt = $${fieldsToUpdateArr.length + 1}, userId = $${
    fieldsToUpdateArr.length + 2
  } WHERE id = $${fieldsToUpdateArr.length + 3}`
  values.push(new Date())
  values.push(userId)
  values.push(playlistId)

  return await db.query(query, values)
}

const deletePlaylistByIdDb = async (playlistId) => {
  return await db.query('DELETE * FROM playlists WHERE id = $1', [playlistId])
}

export {
  getAllPlaylistsDb,
  getPlaylistByIdDb,
  createPlaylistDb,
  getLatestPlaylistDb,
  updatePlaylistByIdDb,
  deletePlaylistByIdDb,
}
