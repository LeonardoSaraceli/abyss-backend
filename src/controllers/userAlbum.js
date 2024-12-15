import {
  getAllUsersAlbumsByQuery,
  getAllUsersAlbumsDb,
} from '../domains/userAlbum.js'
import { MissingFieldsError } from '../errors/ApiError.js'

const getAllUsersAlbums = async (req, res) => {
  const { userId, albumId } = req.query

  if ((userId && isNaN(userId)) || (albumId && isNaN(albumId))) {
    throw new MissingFieldsError('Invalid query parameters')
  }

  if (userId || albumId) {
    const fieldsToGet = Object.fromEntries(
      Object.entries({ userId, albumId }).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    )

    const usersAlbums = await getAllUsersAlbumsByQuery(fieldsToGet)

    return res.json({
      usersAlbums: usersAlbums.rows,
    })
  }

  const usersAlbums = await getAllUsersAlbumsDb()

  res.json({
    usersAlbums: usersAlbums.rows,
  })
}

export { getAllUsersAlbums }
