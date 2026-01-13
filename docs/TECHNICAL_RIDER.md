# Technical Rider (Requirements & Specifications)

This document outlines the functional and non-functional requirements for the **Bandline** project.

## 1. Functional Requirements

### Authentication
- **RF01**: User registration (username, email, password).
- **RF02**: Login & Session management via HTTP-only cookies.
- **RF03**: Google OAuth support.

### Features
- **RF04**: Artist Search (Integration with Spotify).
- **RF05**: Artist Details (Enriched with Last.fm data).
- **RF06**: Discography Listing (Albums sorted by release date).
- **RF07**: Tracklist View.

### User Management
- **RF08**: Search History (Last 50 searches).
- **RF09**: Favorites Management (Albums).
- **RF10**: Completed Albums Collection.
- **RF11**: Profile Management (Bio, avatar updates).

---

## 2. Non-Functional Requirements

- **RNF01**: **Node.js 20** & **TypeScript**.
- **RNF02**: **PostgreSQL** database with **Prisma ORM**.
- **RNF03**: Secure session handling (Passport + express-session).
- **RNF04**: Rate limiting & clear input validation.
- **RNF05**: Standardized error handling.
- **RNF06**: Automated testing suite (Vitest).

---

## 3. Compliance & Security

- **RL01**: LGPD Compliance.
- **RL02**: Secure password hashing (Bcrypt).
- **RL03**: Compliance with Spotify & Last.fm Terms of Service.
- **RL04**: Compliance with Google OAuth policies.

---

## Deployment Scripts

- `setup.sh` / `setup.cmd`: Initial project setup (Dependences & Database).
- `deploy.sh` / `deploy.cmd`: Production deployment scripts.
- `tests/setup-tests.sh` / `.cmd`: Test environment setup.
