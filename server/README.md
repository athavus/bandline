# 🥁 The Rhythm Section (Server)

This is the engine room, keeping the beat for the whole band.

## 🥁 The Kit (Stack)

- **Drummer**: Node.js + Express
- **Bass Player**: PostgreSQL + Prisma
- **Manager**: Passport.js (Auth)

## 📑 The Setlist (API Endpoints)

Here are the tracks we play every night:

### 🎫 Box Office (Auth)
- `POST /auth/register`: Sell a new ticket (Sign up).
- `POST /auth/login`: Check the ticket (Sign in).
- `GET /auth/me`: Verify the VIP pass (Session check).
- `POST /auth/logout`: End the show (Sign out).

### 🎸 The Stars (Artists)
- `GET /searchArtists`: Find a band.
- `GET /artists/:id`: Get the band's bio.
- `GET /artistAlbums/:id`: Discography.

### 💿 The Records (Albums & Tracks)
- `GET /albumTracks/:id`: Tracklist.

### 🌟 Fan Club (User Features)
- `GET /history`: What you've been listening to.
- `GET /favorites`: Your top picks.
- `GET /completedAlbums`: The full collection.
- `GET /profile`: Your fan ID.

## 🛠️ Tech Specs

- **OpenAPI**: The official lyric sheet is at `server/openapi.yaml`.
- **Docs**: View interactive docs at `/docs` when the server is running.
- **Database**: We use Prisma to keep our records straight.

## 🧪 Soundcheck (Testing)

The backend has a dedicated test suite in the `tests/` folder of the root.

---

*Keep the tempo steady!*
