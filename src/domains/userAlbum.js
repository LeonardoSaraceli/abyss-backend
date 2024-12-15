import { db } from '../lib/db.js'

const addUsersToAlbumDb = async (users, albumId) => {
  for (const user of users) {
    await db.query(
      'INSERT INTO users_albums (userId, albumId) VALUES ($1, $2)',
      [user.id, albumId]
    )
  }
}

const getAllUsersAlbumsDb = async () => {
  return await db.query('SELECT * FROM users_albums')
}

const getAllUsersAlbumsByQuery = async (fieldsToGet) => {
  const fieldsToGetArr = Object.entries(fieldsToGet)
  const values = []
  let query = 'SELECT * FROM users_albums WHERE '

  fieldsToGetArr.forEach(([key, value], index) => {
    query += `${key} = $${index + 1}`

    if (index < fieldsToGetArr.length - 1) {
      query += ' AND '
    }

    values.push(value)
  })

  return await db.query(query, values)
}

export { addUsersToAlbumDb, getAllUsersAlbumsDb, getAllUsersAlbumsByQuery }
