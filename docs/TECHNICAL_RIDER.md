# 📋 Technical Rider (Requirements & Specs)

This document outlines the specific technical requirements for the **Bandline** tour. All venues (environments) must adhere to these specs.

## 1. Setlist Requirements (Functional)

### 🎫 Box Office (Auth)
- **RF01**: User registration (username, email, password) - *No scalpers allowed.*
- **RF02**: Login & Session via cookie (HTTP Only).
- **RF03**: Google OAuth support - *VIP Entry.*

### 🎸 The Performance (Features)
- **RF04**: Artist Search (Spotify Integration).
- **RF05**: Artist Details (with Last.fm bio & similar artists).
- **RF06**: Discography (Albums sorted by release date).
- **RF07**: Tracklist (Album details).

### 🌟 Fan Engagement (User Data)
- **RF08**: Search History (Last 50 searches).
- **RF09**: Favorites (Albums).
- **RF10**: Completed Albums (The "I was there" badge).
- **RF11**: Profile Management (Update bio, avatar).

---

## 2. Venue Specs (Non-Functional)

- **RNF01**: **Node.js 20** & **TypeScript** platform.
- **RNF02**: **PostgreSQL** database with **Prisma ORM**.
- **RNF03**: Secure sessions (Passport + express-session).
- **RNF04**: Rate limiting & Input validation (Defensive playing).
- **RNF05**: Error handling (The show must go on).
- **RNF06**: Testing suite (Vitest).

---

## 3. Legal & Safety (Compliance)

- **RL01**: LGPD Compliance (Privacy first).
- **RL02**: Secure password hashing (Bcrypt).
- **RL03**: Spotify & Last.fm Terms of Service adherance.
- **RL04**: Google OAuth policies.

---

## 👷 Roadies (Scripts & Utils)

Our crew keeps the show running:

- `setup.sh` / `setup.cmd`: Initial stage construction (Install & DB setup).
- `deploy.sh` / `deploy.cmd`: Production deployment.
- `tests/setup-tests.sh` / `.cmd`: isolating the soundcheck environment.

---

*This rider is non-negotiable. Good luck with the show!*
