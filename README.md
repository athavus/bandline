# 🎸 Bandline: The Tour

> **"Code loud, commit proud."**

Welcome to **Bandline**, your backstage pass to managing the ultimate musical project. This repository isn't just code; it's a setlist of features designed to rock your workflow.

---

## 💿 The Album (Overview)

Bandline is a full-stack application composed to deliver a seamless experience. Whether you're a frontman (client) or holding down the rhythm section (server), this project keeps everyone in sync.

### 🎶 Greatest Hits (Features)
- **Multi-Track Performance**: Simultaneous client and server operations.
- **Killer Riffs**: Optimized endpoints for high performance.
- **Solid Baseline**: Robust database integration with PostgreSQL.
- **Cross-Platform Tour**: Compatible with Linux and Windows.

---

## 🎤 Soundcheck (Prerequisites)

Before we can start the show, make sure your gear is tuned:

1.  **Node.js**: Version 20 (LTS) - *The vocal mic.*
2.  **PostgreSQL**: Installed & Running - *The drum kit.*
3.  **pnpm**: Package Manager - *The guitar pick.*

---

## 🎛️ Stage Setup (Installation)

Get all the instruments plugged in. Run the setup script in the **root directory**:

### 🐧 Linux / Mac
```bash
./setup.sh
```
*(Don't forget to give it some gain: `chmod +x setup.sh`)*

### 🪟 Windows
```cmd
.\setup.cmd
```

---

## 🚀 The Gig (Running the App)

Time to hit the stage!

### 🥁 The Rhythm Section (Server)
Navigate to the server details and start the beat:

```bash
cd server
pnpm dev
```
*Live at: `http://localhost:3000`*

### 🎸 The Frontman (Client)
(See `client/README.md` for specific venue details!)

---

## 🎟️ Backstage Pass (Documentation)

Want to know how the magic happens? Check out our detailed liner notes:

- **[Join the Band (Contributing)](./CONTRIBUTING.md)**: Rules of the road for new members.
- **[Stage Setup (Architecture)](./ARCHITECTURE.md)**: Technical diagrams and deep dives.
- **[Setlist (API)](./server/README.md)**: The list of every song we play.

---

## 🧪 Rehearsals (Testing)

Don't go live without a practice run.

1.  **Enter the Studio**: `cd tests`
2.  **Prep the Room**:
    - Windows: `.\setup-tests.cmd`
    - Linux: `./setup-tests.sh`
3.  **Jam Session**: `pnpm test`

> **Note**: If you hear feedback (errors), check your "File Parallelism" settings. We've optimized the mix to handle it.

---

Made with 🤘 by the Bandline Crew.
