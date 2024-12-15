import jwt from 'jsonwebtoken'
import { InvalidTokenError } from '../errors/ApiError.js'
import multer from 'multer'

const isTokenValid = (req, res, next) => {
  try {
    const headers = req.headers['authorization']

    const token = headers.split(' ')[1]

    const payload = jwt.verify(token, process.env.SECRETKEY)

    req.user = payload

    next()
  } catch (error) {
    throw new InvalidTokenError('Unauthorized token')
  }
}

const upload = multer({ storage: multer.memoryStorage() })

export { isTokenValid, upload }
