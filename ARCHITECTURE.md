# 🏗️ Stage Setup (Architecture)

Every great show needs a solid stage setup. Here's how **Bandline** is wired up.

## 🗺️ The Stage Layout (System Overview)

We rock a classic **Client-Server** formation, backed by a powerful **Database** rhythm section.

```mermaid
graph TD
    User((🎤 Audience))
    Client[🎸 Frontman (Client)]
    Server[🥁 Rhythm Section (Server)]
    DB[(💽 The Vault (PostgreSQL))]

    User -->|Interacts| Client
    Client -->|Requests (HTTP/REST)| Server
    Server -->|Queries| DB
    DB -->|Data| Server
    Server -->|Response| Client
```

## 🔌 The Gear (Tech Stack)

### 🎸 Lead Guitar (Frontend)
- **Framework**: Svelte/React (Check `client/package.json`)
- **Styling**: Tailored for the spotlight.

### 🥁 Drums (Backend)
- **Runtime**: Node.js
- **Framework**: Express/Fastify (Check `server/package.json`)
- **API**: The setlist users interact with.

### 💽 Bass (Database)
- **System**: PostgreSQL
- **ORM**: Prisma (The bridge between the music and the recording).

## 📂 Tour Bus (Directory Structure)

- `/client` - Where the visual magic happens.
- `/server` - The engine room.
- `/docs` - The archive of old lyrics and technical riders.
- `/tests` - The rehearsal studio.

## 🔄 The Flow (Data Cycle)

1.  **Intro**: User logs in.
2.  **Verse**: Client requests data.
3.  **Chorus**: Server processes logic & talks to DB.
4.  **Outro**: Data returned to user.

---
*Keep the cables organized and the stage clean!*
