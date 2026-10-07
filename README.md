# Event Management Platform

A full-stack event management website built with React and FastAPI. Users can browse upcoming events, view details, and book them online.

## Tech Stack
- Frontend: React 19, Vite, React Router 7, framer-motion
- Backend: FastAPI, SQLAlchemy 2, Pydantic
- Database: MySQL 8

## Setup Instructions

### 1. Database
First, create the database and tables using the provided SQL file:
```bash
mysql -u root -p < database/schema.sql
```
This will create the `event_management` database and insert some sample events to get you started.

### 2. Backend API
Open a terminal and navigate to the backend folder:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # on Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and add your MySQL password.
Then start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
The API will run on http://localhost:8000. You can check the docs at http://localhost:8000/docs.

### 3. Frontend App
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The React app will be available at http://localhost:5173.

## Environment Variables

### Backend (.env)
- `DB_HOST`: localhost
- `DB_USER`: root
- `DB_PASSWORD`: your password here
- `DB_NAME`: event_management

### Frontend (.env)
- `VITE_API_BASE_URL`: http://localhost:8000

## Notes
- Images are stored in `frontend/public/images/`. The database only stores the relative path (like `/images/events/wedding.svg`).
- Make sure both the frontend and backend servers are running at the same time to test the booking and contact forms properly.
