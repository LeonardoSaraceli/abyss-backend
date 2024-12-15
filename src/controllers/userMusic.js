import {
  getAllUsersMusicsByQuery,
  getAllUsersMusicsDb,
} from '../domains/userMusic.js'
import { MissingFieldsError } from '../errors/ApiError.js'

const getAllUsersMusics = async (req, res) => {
  const { userId, musicId } = req.query

  if ((userId && isNaN(userId)) || (musicId && isNaN(musicId))) {
    throw new MissingFieldsError('Invalid query parameters')
  }

  if (userId || musicId) {
    const fieldsToGet = Object.fromEntries(
      Object.entries({ userId, musicId }).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    )

    const usersMusics = await getAllUsersMusicsByQuery(fieldsToGet)

    return res.json({
      usersMusics: usersMusics.rows,
    })
  }

  const usersMusics = await getAllUsersMusicsDb()

  res.json({
    usersMusics: usersMusics.rows,
  })
}

export { getAllUsersMusics }
