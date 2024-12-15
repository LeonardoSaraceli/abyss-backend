import jwt from 'jsonwebtoken'
import { InvalidTokenError } from '../errors/ApiError.js'

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

export { isTokenValid }
