# Architecture Overview

This document provides a high-level overview of the **Bandline** system architecture.

## System Layout

Bandline follows a standard **Client-Server** architecture, supported by a relational **Database**.

```mermaid
graph TD
    User((User))
    Client[Client (Frontend)]
    Server[Server (Backend)]
    DB[(PostgreSQL)]

    User -->|Interacts| Client
    Client -->|HTTP/REST| Server
    Server -->|Queries| DB
    DB -->|Data| Server
    Server -->|Response| Client
```

## Technology Stack

### Frontend
- **Framework**: Svelte/React (See `client/package.json`)
- **Styling**: TailwindCSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express/Fastify (See `server/package.json`)
- **API**: RESTful API

### Database
- **System**: PostgreSQL
- **ORM**: Prisma

## Directory Structure

- `/client`: Frontend source code and assets.
- `/server`: Backend source code, API logic, and database schema.
- `/docs`: Project documentation and requirements.
- `/tests`: Automated integration and unit tests.

## Data Flow

1.  **Request**: User initiates an action via the Client.
2.  **Processing**: Client sends an HTTP request to the Server.
3.  **Logic & Persistence**: Server processes the request, interacting with the Database via Prisma as needed.
4.  **Response**: Server returns the data or confirmation to the Client.
