# MyChessFamily (Full Stack)

This project now uses:

- React + Vite for the frontend
- Node.js HTTP API for persistent shared data (server.js)
- JSON database file at data/db.json

## Why this matters

Registrations are now saved on the server, not browser local storage. So if families register from another PC, the admin dashboard can see those sign-ups.

## Run locally

### 1) Start API server

npm run server

Runs on http://localhost:4000.

### 2) Start frontend

npm run dev

Runs on http://localhost:5173 with /api proxied to the backend.

### Optional: run both in one command

npm run dev:full

## Admin credentials

username: admin  
password: chess123
