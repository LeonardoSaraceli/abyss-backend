import { db } from '../lib/db.js'

const getAllAlbumsDb = async () => {
  return await db.query('SELECT * FROM albums')
}

const getAlbumByIdDb = async (albumId) => {
  return await db.query('SELECT * FROM albums WHERE id = $1', [albumId])
}

const createAlbumDb = async (cover, title) => {
  return await db.query('INSERT INTO albums (cover, title) VALUES ($1, $2)', [
    cover,
    title,
  ])
}

const getLatestAlbumDb = async () => {
  return await db.query('SELECT * FROM albums ORDER BY createdAt DESC LIMIT 1')
}

const updateAlbumByIdDb = async (fieldsToUpdate, albumId) => {
  const fieldsToUpdateArr = Object.entries(fieldsToUpdate)
  const values = []
  let query = 'UPDATE albums SET '

  fieldsToUpdateArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}, `
    values.push(value)
  })

  query += `updatedAt = $${fieldsToUpdateArr.length + 1} WHERE id = $${
    fieldsToUpdateArr.length + 2
  }`
  values.push(new Date())
  values.push(albumId)

  return await db.query(query, values)
}

const deleteAlbumByIdDb = async (albumId) => {
  return await db.query('DELETE FROM albums WHERE id = $1', [albumId])
}

const getAllAlbumMusicsByIdDb = async (albumId) => {
  return await db.query(
    `
    SELECT 
        m.id AS music_id,
        m.title AS music_title,
        m.url AS music_url,
        m.cover AS music_cover,
        m.createdAt AS music_createdAt,
        m.updatedAt AS music_updatedAt
    FROM 
        musics m
    WHERE 
        m.albumId = $1
    ORDER BY
        m.position ASC
  `,
    [albumId]
  )
}

export {
  getAllAlbumsDb,
  getAlbumByIdDb,
  createAlbumDb,
  getLatestAlbumDb,
  updateAlbumByIdDb,
  deleteAlbumByIdDb,
  getAllAlbumMusicsByIdDb,
}
