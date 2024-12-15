import { getLibraryByIdDb } from '../domains/library.js'
import { NotFoundError } from '../errors/ApiError.js'

const getLibraryById = async (req, res) => {
  const library = await getLibraryByIdDb(req.user.id)

  if (!library) {
    throw new NotFoundError('Library not found')
  }

  res.json({
    library: library.rows[0],
  })
}

export { getLibraryById }
