"""FastAPI entrypoint for the Event Management API.

Run from the `backend/` folder:

    python -m uvicorn app.main:app --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Booking, ContactMessage, Event, Gallery, Service
from app.routes import (
    booking_routes,
    contact_routes,
    event_routes,
    gallery_routes,
    service_routes,
)
from app.seed import seed_if_empty

logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once when the server starts and once when it shuts down."""
    try:
        # Create database tables that do not exist yet.
        Base.metadata.create_all(bind=engine)

        # Insert demo data if enabled.
        if settings.SEED_DEMO_DATA:
            with SessionLocal() as db:
                inserted = seed_if_empty(db)

            if inserted:
                logger.info("Seeded %s demo events.", inserted)

        logger.info("Database ready.")

    except Exception as exc:
        # Keep the API running even if the database is unavailable.
        logger.warning("Could not prepare the database: %s", exc)

    yield


app = FastAPI(
    title="Event Management API",
    description="API for the Event Management website.",
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------

app.include_router(event_routes.router)
app.include_router(booking_routes.router)
app.include_router(contact_routes.router)
app.include_router(service_routes.router)
app.include_router(gallery_routes.router)


# ---------------------------------------------------------
# DATABASE ERROR HANDLER
# ---------------------------------------------------------

@app.exception_handler(SQLAlchemyError)
async def handle_database_error(
    request: Request,
    exc: SQLAlchemyError,
):
    """Return a clear response when a database error occurs."""

    logger.exception(
        "Database error while handling %s %s",
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": (
                "Could not reach the database. Check that MySQL is running "
                "and that DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME "
                "in backend/.env are correct, and that the database was "
                "created from database/schema.sql."
            )
        },
    )


# ---------------------------------------------------------
# ROOT ENDPOINT
# ---------------------------------------------------------

@app.get("/")
def read_root():
    """Simple endpoint to confirm that the API is running."""

    return {
        "message": "Welcome to the Event Management API"
    }


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/api/health")
def health_check():
    """Check whether the API and database are reachable."""

    try:
        with engine.connect() as connection:
            connection.exec_driver_sql("SELECT 1")

    except SQLAlchemyError as exc:
        logger.warning(
            "Health check could not reach the database: %s",
            exc,
        )

        return {
            "status": "ok",
            "database": "unreachable",
        }

    return {
        "status": "ok",
        "database": "ok",
    }