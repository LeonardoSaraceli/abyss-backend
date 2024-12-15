import { db } from '../lib/db.js'

const createMusicDb = async (url, cover, title) => {
  return await db.query(
    'INSERT INTO musics (url, cover, title) VALUES ($1, $2, $3)',
    [url, cover, title]
  )
}

const getLatestMusicDb = async () => {
  return await db.query('SELECT * FROM musics ORDER BY createdAt DESC LIMIT 1')
}

const getAllMusicsDb = async () => {
  return await db.query('SELECT * FROM musics')
}

const getMusicByIdDb = async (musicId) => {
  return await db.query('SELECT * FROM musics WHERE id = $1', [musicId])
}

const deleteMusicByIdDb = async (musicId) => {
  return await db.query('DELETE FROM musics WHERE id = $1', [musicId])
}

const updateMusicDb = async (fieldsToUpdate, musicId) => {
  const fieldsToUpdateArr = Object.entries(fieldsToUpdate)
  const values = []
  let query = 'UPDATE musics SET '

  fieldsToUpdateArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}, `
    values.push(value)
  })

  query += `updatedAt = $${fieldsToUpdateArr.length + 1} WHERE id = $${
    fieldsToUpdateArr.length + 2
  }`
  values.push(new Date())
  values.push(musicId)

  return await db.query(query, values)
}

export {
  createMusicDb,
  getLatestMusicDb,
  getAllMusicsDb,
  getMusicByIdDb,
  deleteMusicByIdDb,
  updateMusicDb,
}
