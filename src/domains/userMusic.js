import { db } from '../lib/db.js'

const addUsersToMusicDb = async (users, musicId) => {
  for (const user of users) {
    await db.query(
      'INSERT INTO users_musics (userId, musicId) VALUES ($1, $2)',
      [user.id, musicId]
    )
  }
}

const getAllUsersMusicsDb = async () => {
  return await db.query('SELECT * FROM users_musics')
}

const getAllUsersMusicsByQuery = async (fieldsToGet) => {
  const fieldsToGetArr = Object.entries(fieldsToGet)
  const values = []
  let query = 'SELECT * FROM users_musics WHERE '

  fieldsToGetArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}`

    if (index < fieldsToGetArr.length - 1) {
      query += ' AND '
    }

    values.push(value)
  })

  return await db.query(query, values)
}

export { addUsersToMusicDb, getAllUsersMusicsDb, getAllUsersMusicsByQuery }
