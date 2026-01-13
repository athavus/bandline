# Bandline

> **"Code loud, commit proud."**

Welcome to **Bandline**. This repository hosts a full-stack application designed for managing music projects, artists, and collections.

---

## Overview

Bandline is a comprehensive solution that bridges the gap between client interfaces and server-side management. It provides a robust set of features for artists and managers to keep their projects in sync.

### Key Features
- **Multi-Track Performance**: Simultaneous client and server operations.
- **High Performance**: Optimized endpoints for speed and reliability.
- **Robust Persistence**: Integrated database management with PostgreSQL.
- **Cross-Platform**: Fully compatible with Linux and Windows environments.

---

## Prerequisites

Ensure the following dependencies are installed before setting up the project:

1.  **Node.js**: Version 20 (LTS) is required.
2.  **PostgreSQL**: Must be installed and running.
3.  **pnpm**: The specific package manager used for this project.

---

## Installation

To configure the project, including database setup and dependencies, run the setup script located in the **root directory**.

### Linux / Mac
```bash
./setup.sh
```
*Note: Ensure the script has execution permissions (`chmod +x setup.sh`)*

### Windows
```cmd
.\setup.cmd
```

---

## Running the Application

### Server (Backend)
Navigate to the server directory to start the backend services:

```bash
cd server
pnpm dev
```
The server will be accessible at `http://localhost:3000`.

### Client (Frontend)
For details on running the client application, please refer to the [Client Documentation](./client/README.md).

---

## Documentation

For a deeper dive into the project's structure and guidelines:

- **[Contributing Guidelines](./CONTRIBUTING.md)**: Standards and protocols for collaboration.
- **[Architecture Overview](./ARCHITECTURE.md)**: System design and technical diagrams.
- **[API Reference](./server/README.md)**: Detailed endpoint documentation.
- **[Technical Rider](./docs/TECHNICAL_RIDER.md)**: Functional and non-functional requirements.

---

## Testing

To run the automated test suite:

1.  Navigate to the tests directory: `cd tests`
2.  Prepare the test environment:
    - Windows: `.\setup-tests.cmd`
    - Linux: `./setup-tests.sh`
3.  Execute tests: `pnpm test`

> **Note**: The test suite is pre-configured to handle file parallelism issues.
