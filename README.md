# Event Management Platform

A full-stack event management platform built with React, FastAPI, and MySQL. This project is developed by a 4-member team to manage events, services, bookings, and contact inquiries.

## 🚀 Tech Stack

- **Frontend**: React.js (via Vite)
- **Backend API**: FastAPI (Python)
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Data Validation**: Pydantic

## 📂 Project Architecture

```
event-management/
├── frontend/               # React Vite application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Full page views
│       ├── services/       # API calling logic
│       └── hooks/          # Custom React hooks
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic schemas for data validation
│   │   ├── routes/         # API endpoints grouped by feature
│   │   ├── database.py     # Database connection setup
│   │   └── main.py         # FastAPI entrypoint
│   ├── .env                # Secret environment variables (DB credentials)
│   └── requirements.txt    # Python dependencies
└── database/
    └── schema.sql          # Raw SQL schema & sample data
```

## 🛠️ Setup Instructions

### 1. Database Setup
1. Ensure MySQL is running on your machine.
2. The FastAPI backend is configured to automatically create missing tables when it boots up, but you can inject sample data by running the `database/schema.sql` file in your MySQL environment (Workbench, phpMyAdmin, or CLI).

### 2. Backend Setup (FastAPI)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure you have a `.env` file in the `backend` folder containing your MySQL credentials. (e.g., `DATABASE_URL=mysql+pymysql://root:password@localhost:3306/event_management`)
4. Start the backend development server:
   ```bash
   fastapi dev app/main.py
   ```
5. You can view the automatically generated API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Frontend Setup (React)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The React application will typically be available at [http://localhost:5173](http://localhost:5173).

## 🔗 API Endpoints

**Core GET APIs:**
* `GET /api/events` — Retrieve all events
* `GET /api/events/{id}` — Retrieve a specific event
* `GET /api/services` — Retrieve all services
* `GET /api/services/{id}` — Retrieve a specific service
* `GET /api/testimonials` — Retrieve all testimonials
* `GET /api/gallery` — Retrieve all gallery images

**POST APIs:**
* `POST /api/bookings` — Submit a booking request
* `POST /api/contact` — Submit a contact inquiry

## 👥 Team Responsibilities
* **Member 1 (Full-Stack/Integration Lead):** Project Setup, Core UI, Integration, Polish, Tech Architecture Documentation.
* **Member 2 (Database & Backend):** DB Design, Core APIs, Security, DB Documentation.
* **Member 3 (Backend & UI):** Booking/Contact APIs, Events/Gallery Pages, API Documentation.
* **Member 4 (Frontend & QA Lead):** Services/About Pages, Contact UI, QA Testing, Test Documentation.
