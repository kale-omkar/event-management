# EventNest — Event Management Platform

A full-stack event management website where customers browse events, view
details and inclusions, submit bookings and send enquiries. Built for Indian
customers, with all prices in **Indian Rupees (INR)**.

**Stack:** React 19 + Vite · FastAPI · MySQL · SQLAlchemy 2 · Pydantic v2

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running Both Servers](#running-both-servers)
- [API Endpoints](#api-endpoints)
- [Design System](#design-system)
- [Images](#images)
- [Team Workflow](#team-workflow)

---

## Tech Stack

| Layer      | Technology                                                     |
| ---------- | -------------------------------------------------------------- |
| Frontend   | React 19, Vite 8, React Router 7, Axios, framer-motion, react-icons |
| Styling    | Hand-written CSS with custom properties (no framework)         |
| Backend    | FastAPI, Uvicorn                                               |
| Database   | MySQL 8+                                                       |
| ORM        | SQLAlchemy 2.x                                                 |
| Validation | Pydantic v2, pydantic-settings                                 |

---

## Folder Structure

```
.
├── frontend/
│   ├── public/
│   │   ├── images/                 # ALL images live here
│   │   │   ├── hero/  events/  services/  gallery/  about/
│   │   │   ├── logo.svg  placeholder.svg
│   │   │   └── ...
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/             # Layout, Navbar, Footer, SmartImage, cards…
│   │   ├── pages/                  # One file per route (lazy loaded)
│   │   ├── hooks/                  # useFetch
│   │   ├── services/               # axios instance, image helpers
│   │   ├── utils/                  # formatPrice
│   │   ├── index.css               # Design system: variables, reset, primitives
│   │   ├── components.css          # Component styles
│   │   ├── App.jsx                 # Router
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # App, CORS, routers, startup, error handlers
│   │   ├── config.py               # Environment settings
│   │   ├── database.py             # Engine, session, get_db
│   │   ├── seed.py                 # Demo data inserted on first run
│   │   ├── models/                 # event.py, booking.py, contact.py
│   │   ├── schemas/                # Pydantic request/response models
│   │   ├── routes/                 # event_routes.py, booking_routes.py, contact_routes.py
│   │   └── services/               # Business logic
│   ├── .env.example
│   └── requirements.txt
│
├── database/
│   └── schema.sql                  # CREATE DATABASE, tables, seed data
│
├── .gitignore
└── README.md
```

### Request flow

```
Page (pages/Events.jsx)
  → useFetch hook (hooks/useFetch.js)
    → axios instance (services/api.js)
      → FastAPI route (routes/event_routes.py)
        → service function (services/event_service.py)
          → SQLAlchemy model (models/event.py)
            → MySQL
```

Keep this layering: routes stay thin and delegate to the service layer.

---

## Prerequisites

- **Node.js 18+** and npm — `node -v`
- **Python 3.10+** — `python3 --version`
- **MySQL 8+** running locally

> On macOS with Homebrew, `mysql` is keg-only and may not be on your `PATH`.
> Prefix commands with `export PATH="/opt/homebrew/opt/mysql/bin:$PATH"`.

---

## Setup

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

Creates `event_management`, all three tables, and inserts 9 sample events.

Verify:

```sql
USE event_management;
SELECT COUNT(*) FROM events;
```

> You can skip this: the backend creates missing tables **and** seeds demo data
> automatically on first run if `events` is empty. Running the file yourself
> just makes the first startup faster.

### 2. Backend

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows

pip install -r requirements.txt

cp .env.example .env               # then edit DB_PASSWORD
```

Set your MySQL password in `backend/.env`, then:

```bash
uvicorn app.main:app --reload
```

- API: <http://localhost:8000>
- Interactive docs: <http://localhost:8000/docs>

Run this from inside `backend/` so `app.main` resolves and `.env` is found.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env               # optional, has a working default
npm run dev
```

- App: <http://localhost:5173>

Restart `npm run dev` after editing `.env` — Vite only reads env files at
startup.

---

## Environment Variables

Real `.env` files are gitignored. Only `.env.example` files are committed.

### `backend/.env`

| Variable          | Required | Default                                              | Description                          |
| ----------------- | -------- | ---------------------------------------------------- | ------------------------------------ |
| `DB_HOST`         | Yes      | `localhost`                                          | MySQL host                           |
| `DB_PORT`         | No       | `3306`                                               | MySQL port                           |
| `DB_USER`         | Yes      | `root`                                               | MySQL username                       |
| `DB_PASSWORD`     | Yes      | *(empty)*                                            | MySQL password                       |
| `DB_NAME`         | Yes      | `event_management`                                   | Must match `schema.sql`              |
| `CORS_ORIGINS`    | No       | `http://localhost:5173,http://127.0.0.1:5173`        | Comma-separated allowed origins      |
| `SEED_DEMO_DATA`  | No       | `true`                                               | Insert demo events when table empty  |

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME` are combined into:

```
mysql+pymysql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME
```

`localhost` and `127.0.0.1` are **different origins** to a browser, so both are
listed by default. Add your deployed frontend origin here too.

If MySQL is unreachable the API still starts and `/api/health` still responds;
the server logs a warning and database endpoints return **503** with an
actionable message rather than a 500 stack trace.

### `frontend/.env`

| Variable            | Required | Default                 | Description                 |
| ------------------- | -------- | ----------------------- | --------------------------- |
| `VITE_API_BASE_URL` | No       | `http://localhost:8000` | Base URL of the backend API |

Only `VITE_`-prefixed variables reach the browser, and they are **inlined into
the build**. Never put a secret in a `VITE_` variable.

---

## Running Both Servers

| Terminal | Command                                                              | URL                      |
| -------- | -------------------------------------------------------------------- | ------------------------ |
| 1        | `cd backend && source .venv/bin/activate && uvicorn app.main:app --reload` | <http://localhost:8000> |
| 2        | `cd frontend && npm run dev`                                         | <http://localhost:5173>  |

Production build check:

```bash
cd frontend
npm run build
npm run preview        # http://localhost:4173
```

---

## API Endpoints

| Method | Path                        | Description                            |
| ------ | --------------------------- | -------------------------------------- |
| GET    | `/`                         | Welcome message                        |
| GET    | `/api/health`               | Health + database connection status    |
| GET    | `/api/events`               | List events. Supports `?category=` and `?search=` |
| GET    | `/api/events/{id}`          | One event, 404 if missing              |
| GET    | `/api/events/{id}/related`  | Other events in the same category      |
| POST   | `/api/events`               | Create an event                        |
| POST   | `/api/bookings`             | Submit a booking request               |
| GET    | `/api/bookings`             | List bookings, newest first            |
| POST   | `/api/contact`              | Submit a contact enquiry               |

`GET /api/events` returns `{ events, total, categories }` so the frontend filter
chips stay in sync without a second request.

### Validation

`POST /api/bookings` rejects with **422** unless:

- `phone` is a 10-digit Indian mobile number (`6`–`9` start, optional `+91`)
- `event_date` is today or later
- `guests` is between 1 and 1000
- `email` is a valid address
- `event_id`, if supplied, refers to an existing event (else **404**)

`POST /api/contact` requires a message of at least 10 characters.

---

## Design System

Defined as CSS custom properties in `src/index.css`.

- **Palette** — deep indigo/violet primary (`--brand-*`), warm gold accent
  (`--accent-*`), slate neutrals (`--ink-*`)
- **Type** — Fraunces (display serif) for headings, Inter for body, via Google Fonts
- **Spacing** — 4px-based scale, `--sp-1` … `--sp-24`
- **Radii** — `--r-sm` (8px) … `--r-xl` (26px), `--r-full` for pills
- **Shadows** — four levels from `--shadow-xs` to `--shadow-lg`

### Breakpoints

Mobile first, then widened: `640px`, `768px`, `900px`, `1024px`, `1280px`.
`body` sets `overflow-x: hidden`, images use `max-width: 100%` and
`object-fit: cover`, and every grid collapses to one column below `640px`, so
there is no horizontal scroll at 360px.

### Motion

Animations use `transform` and `opacity` only, so they stay GPU-friendly.
`prefers-reduced-motion` is respected globally in CSS and per-component via
framer-motion's `useReducedMotion`.

### Components

`SmartImage` (lazy loading, shimmer skeleton, fade-in, `onError` fallback),
`ScrollReveal`, `StatsCounter`, `TestimonialsSlider`, `Lightbox` (Esc + arrow
keys), `ToastProvider` + `useToast`, `BackToTop`, `ErrorState`/`EmptyState`/
`SkeletonGrid`, `NotFound`.

---

## Images

**One convention, used everywhere:**

- Every image file lives in `frontend/public/images/`
- It is referenced as `/images/...`
- The database stores **only that relative path** (e.g.
  `/images/events/wedding-grand.svg`), never a full URL

This means the API host can change without touching any data, and no image
request ever depends on the backend.

Placeholder images are **locally generated SVGs** — nothing is hotlinked from a
third-party host, so nothing can break offline.

If an image is missing or the path is wrong, `SmartImage` swaps in
`/images/placeholder.svg`, so a broken image can never appear.

---

## Team Workflow

### Branch naming

Branch off `main`, `yourname/short-description`:

```bash
git checkout main
git pull
git checkout -b jatin/booking-api
```

Good: `omkar/gallery-endpoint`, `priya/services-page`.
Bad: `fix`, `stuff`, `final-final-v2`.

### Always pull before you push

```bash
git pull --rebase origin main
```

Replays your commits on top of the latest `main` and avoids merge commits.
Resolve conflicts **in your branch** — never by rewriting `main`.

### Never commit directly to `main`

`main` is protected. Every change arrives through a pull request:

1. Commit focused changes with a clear message
2. Push your branch
3. Open a PR and get at least one review
4. Merge only after approval

Keep PRs small and focused. A reviewer should not read 40 changed files to
review a one-line fix.

### Before you push

```bash
git status                     # nothing unexpected staged
git diff                       # read your own changes
```

Confirm no real `.env` is staged — only `.env.example` should ever be committed:

```bash
git status | grep "\.env$"     # should print nothing
```

### Commit messages

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` tooling, dependencies, config

```bash
git commit -m "feat: add POST /api/bookings with validation"
```

### Keep your local `.env` yours

Never commit database passwords. If you stage a `.env` by accident:

```bash
git restore --staged backend/.env
```

and change any password that has been shared.

---

## Screenshots

> Not yet captured. Screenshots of the Home, Events, Event Details, Services,
> Booking and Contact pages should be added here once the pages are reviewed.

---

## Team Responsibilities

- **Member 1 (Full-Stack / Integration Lead):** Project setup, core UI,
  frontend–backend integration, polish, architecture documentation.
- **Member 2 (Database & Backend):** Database design, core APIs, security,
  database documentation.
- **Member 3 (Backend & UI):** Booking and contact APIs, events and gallery
  pages, API documentation.
- **Member 4 (Frontend & QA Lead):** Services and about pages, contact UI, QA
  testing, test documentation.
