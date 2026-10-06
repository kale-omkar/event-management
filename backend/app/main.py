"""FastAPI entrypoint for the Event Management API.

Run from the `backend/` folder:

    uvicorn app.main:app --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Booking, ContactMessage, Event,Service  # noqa: F401  (register tables)
from app.routes import booking_routes, contact_routes, event_routes,service_routes
from app.seed import seed_if_empty

logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once when the server starts and once when it shuts down."""
    try:
        # Create any tables that do not exist yet, then insert demo data the
        # first time. This makes a fresh checkout runnable with no extra steps.
        Base.metadata.create_all(bind=engine)

        if settings.SEED_DEMO_DATA:
            with SessionLocal() as db:
                inserted = seed_if_empty(db)
            if inserted:
                logger.info("Seeded %s demo events.", inserted)

        logger.info("Database ready.")
    except Exception as exc:  # noqa: BLE001
        # A missing/unreachable database should not stop the server from booting:
        # / and /api/health stay useful for checking the API is alive. Set the
        # DB_* variables in backend/.env to actually create and use the tables.
        logger.warning("Could not prepare the database: %s", exc)

    yield


app = FastAPI(
    title="Event Management API",
    description="API for the Event Management website.",
    version="1.0.0",
    lifespan=lifespan,
)

# The React dev server runs on a different origin, so the browser needs CORS
# permission to call this API. Allowed origins come from CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register feature routers
app.include_router(event_routes.router)
app.include_router(booking_routes.router)
app.include_router(contact_routes.router)
app.include_router(service_routes.router)


@app.exception_handler(SQLAlchemyError)
async def handle_database_error(request: Request, exc: SQLAlchemyError):
    """Turn database failures into a clear 503 instead of a 500 stack trace.

    Most of these are setup problems (MySQL not running, wrong password, or the
    database was never created), so the response says exactly what to check. The
    full error is still written to the server log.
    """
    logger.exception("Database error while handling %s %s", request.method, request.url.path)

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": (
                "Could not reach the database. Check that MySQL is running and "
                "that DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME in "
                "backend/.env are correct, and that the database was created "
                "from database/schema.sql."
            )
        },
    )


@app.get("/")
def read_root():
    """Simple landing endpoint, handy for checking the server is up."""
    return {"message": "Welcome to the Event Management API"}


@app.get("/api/health")
def health_check():
    """Health check used by the frontend to confirm it can reach the API.

    Reports `database: ok` only when a real connection succeeds, so this can be
    used to check the database connection as well as the API itself.
    """
    try:
        with engine.connect() as connection:
            connection.exec_driver_sql("SELECT 1")
    except SQLAlchemyError as exc:
        logger.warning("Health check could not reach the database: %s", exc)
        return {"status": "ok", "database": "unreachable"}

    return {"status": "ok", "database": "ok"}