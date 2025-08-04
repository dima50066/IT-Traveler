# IT-Traveler

> Transform Travel Planning into Seamless Adventure

🚀 **Just Launched** | 💼 **Hobby Project** | 🖥️ **TypeScript** | 🧪 **53.7% Test Coverage** | 🛠️ **Dockerized**

---

**Built with modern tools and technologies:**

![TypeScript](https://img.shields.io/badge/-TypeScript-blue?style=flat-square) ![Node.js](https://img.shields.io/badge/-NodeJS-green?style=flat-square) ![MongoDB](https://img.shields.io/badge/-MongoDB-green?style=flat-square) ![Redis](https://img.shields.io/badge/-Redis-red?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-blue?style=flat-square) ![Prisma](https://img.shields.io/badge/-Prisma-lightgrey?style=flat-square) ![Vue.js](https://img.shields.io/badge/-VueJS-green?style=flat-square) ![Vite](https://img.shields.io/badge/-Vite-pink?style=flat-square) ![Pinia](https://img.shields.io/badge/-Pinia-yellow?style=flat-square) ![Socket.IO](https://img.shields.io/badge/-SocketIO-black?style=flat-square) ![Mapbox](https://img.shields.io/badge/-Mapbox-blue?style=flat-square) ![Cloudinary](https://img.shields.io/badge/-Cloudinary-blue?style=flat-square) ![ESLint](https://img.shields.io/badge/-ESLint-purple?style=flat-square) ![Docker](https://img.shields.io/badge/-Docker-blue?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [Scripts](#scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [Project Plan](#project-plan)
- [License](#license)
- [Authors](#authors)

---

## Overview

**IT-Traveler** is a full-stack travel planning platform designed for developers to build rich, map-based applications with real-time collaboration features. It simplifies the creation of scalable, interactive travel apps by offering modular architecture, dynamic map visualizations, and seamless integrations.

### Why IT-Traveler?

- ✅ **Modular Architecture:** Reusable components with clear separation of concerns for scalable development.
- 🔁 **Real-Time Collaboration:** Built-in chat, notifications, and live updates via WebSocket (Socket.IO).
- 🗺️ **Interactive Maps:** Dynamic route visualization and geospatial features powered by Mapbox.
- 💻 **Developer-Friendly:** Consistent environment setup, robust validation, and streamlined workflows.
- ⚙️ **Extensible & Customizable:** Easily integrate external APIs, customize UI, and extend functionalities.

---

## Features

- **User Management:** Secure authentication and profile management.
- **Trip Planning:** Create, edit, and manage trips with interactive Mapbox maps.
- **Collaboration:** Invite users, share todo lists, and chat in real-time per trip.
- **Budget Tracking:** Monitor trip expenses with analytics.
- **Favorites & Visited Places:** Save and organize favorite locations.
- **Responsive UI:** Built with Tailwind CSS for a seamless experience across devices.

---

## Project Structure

```
.
├── backend/              # Node.js/Express API (TypeScript)
├── frontend/             # Vue 3 SPA (Vite, TypeScript, Tailwind)
├── docker-compose.yml    # Docker Compose configuration
├── PROJECT_PLAN.md       # Feature breakdown and roadmap
└── .vscode/              # VS Code settings
```

---

## Tech Stack

- **Frontend:** Vue 3, Vite, TypeScript, Tailwind CSS, Pinia, Mapbox GL JS
- **Backend:** Node.js, Express, TypeScript, MongoDB, Socket.IO, Prisma
- **Databases:** MongoDB, Redis, PostgreSQL
- **DevOps:** Docker, Docker Compose
- **Tools:** ESLint, Cloudinary, WebSocket, JSON

---

## Getting Started

### Prerequisites

- **Node.js:** v18+ recommended
- **Package Manager:** npm
- **Container Runtime:** Docker (optional, for containerized setup)
- **Databases:** MongoDB (local or cloud), Redis, PostgreSQL
- **API Keys:** Mapbox token, Cloudinary (optional)

---

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dima50066/IT-Traveler.git
   cd IT-Traveler
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

   - Configure your MongoDB URI, Redis, PostgreSQL, and other secrets in `backend/.env`.

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

   - Configure your API endpoint and Mapbox token in `frontend/.env`.

4. **Open in Browser:**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

---

### Docker Setup

Run the full stack with Docker Compose:

```bash
docker-compose up --build
```

- Ensure environment variables are set in `backend/.env` and `frontend/.env`.
- Alternatively, build and run the Docker image:

  ```bash
  docker build -t it-traveler .
  docker run -it it-traveler
  ```

---

## Scripts

### Backend

- `npm run dev`: Start backend in development mode (nodemon)
- `npm run build`: Build TypeScript code
- `npm start`: Run the built server

### Frontend

- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run lint`: Lint code with ESLint

---

## Testing

Run the test suite with:

- **npm:**

  ```bash
  npm test
  ```

- **Docker:**

  ```bash
  docker-compose exec backend npm test
  ```

> Note: Replace `<test_framework>` with the actual test framework used (e.g., Jest, Mocha) in the project configuration.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Open a Pull Request with a detailed description.

---

## Project Plan

For a detailed feature breakdown, data models, and development roadmap, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

---

## License

[MIT](LICENSE)

---

## Authors

- **Dumitru Cuznetov** <dima50066@gmail.com>
- [Add other contributors here]

---
