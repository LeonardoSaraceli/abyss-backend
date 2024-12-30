BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    picture     TEXT,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS libraries (
    id          SERIAL PRIMARY KEY,
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP DEFAULT NOW(),
    userId      INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS albums (
    id          SERIAL PRIMARY KEY,
    cover       TEXT NOT NULL,
    title       TEXT UNIQUE NOT NULL,
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS musics (
    id          SERIAL PRIMARY KEY,
    url         TEXT NOT NULL,
    cover       TEXT NOT NULL,
    title       TEXT NOT NULL,
    position    INTEGER,
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP DEFAULT NOW(),
    albumId     INTEGER,
    FOREIGN KEY (albumId) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlists (
    id          SERIAL PRIMARY KEY,
    cover       TEXT NOT NULL,
    title       TEXT NOT NULL,
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP DEFAULT NOW(),
    userId      INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_musics (
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    musicId INT REFERENCES musics(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, musicId)
);

CREATE TABLE IF NOT EXISTS users_albums (
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    albumId INT REFERENCES albums(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, albumId)
);

CREATE TABLE IF NOT EXISTS libraries_albums (
    libraryId INT REFERENCES libraries(id) ON DELETE CASCADE,
    albumId INT REFERENCES albums(id) ON DELETE CASCADE,
    PRIMARY KEY (libraryId, albumId)
);

CREATE TABLE IF NOT EXISTS libraries_playlists (
    libraryId INT REFERENCES libraries(id) ON DELETE CASCADE,
    playlistId INT REFERENCES playlists(id) ON DELETE CASCADE,
    PRIMARY KEY (libraryId, playlistId)
);

CREATE TABLE IF NOT EXISTS playlists_musics (
    playlistId INT REFERENCES playlists(id) ON DELETE CASCADE,
    musicId INT REFERENCES musics(id) ON DELETE CASCADE,
    PRIMARY KEY (musicId, playlistId)
);

COMMIT;
