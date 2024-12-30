import 'dotenv/config'
import express, { json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import morgan from 'morgan'
import ApiError from './errors/ApiError.js'
import userRoute from './routes/user.js'
import libraryRoute from './routes/library.js'
import musicRoute from './routes/music.js'
import albumRoute from './routes/album.js'
import playlistRoute from './routes/playlist.js'
import userMusicRoute from './routes/userMusic.js'
import userAlbumRoute from './routes/userAlbum.js'
import libraryAlbumRoute from './routes/libraryAlbum.js'
import libraryPlaylistRoute from './routes/libraryPlaylist.js'
import playlistMusicRoute from './routes/playlistMusic.js'

const app = express()

app.use(morgan('dev'))
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.FRONTENDURL?.replace(/\/$/, '')

      if (!origin || origin === allowedOrigin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    preflightContinue: false,
  })
)
app.use(json())

app.use('/users', userRoute)
app.use('/libraries', libraryRoute)
app.use('/musics', musicRoute)
app.use('/albums', albumRoute)
app.use('/playlists', playlistRoute)
app.use('/usersMusics', userMusicRoute)
app.use('/usersAlbums', userAlbumRoute)
app.use('/librariesAlbums', libraryAlbumRoute)
app.use('/librariesPlaylists', libraryPlaylistRoute)
app.use('/playlistsMusics', playlistMusicRoute)

app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
    })
  }

  res.status(500).json({
    error: error.message,
  })
})

export default app
