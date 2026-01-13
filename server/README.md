# Server Documentation

This directory contains the backend application for Bandline.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js

## API Endpoints

### Authentication
- `POST /auth/register`: User registration.
- `POST /auth/login`: User login.
- `GET /auth/me`: Session validation.
- `POST /auth/logout`: User logout.

### Artists
- `GET /searchArtists`: Search for artists.
- `GET /artists/:id`: Get artist details.
- `GET /artistAlbums/:id`: Get artist albums.

### Albums & Tracks
- `GET /albumTracks/:id`: Get album tracklist.

### User Data
- `GET /history`: User search history.
- `GET /favorites`: User favorite albums.
- `GET /completedAlbums`: User completed albums collection.
- `GET /profile`: User profile information.

## API Documentation

- **OpenAPI Spec**: The raw OpenAPI specification is available at `server/openapi.yaml`.
- **Interactive Docs**: Available at `/docs` when the server is running.

## Database

We use Prisma for database schema management and migrations.
