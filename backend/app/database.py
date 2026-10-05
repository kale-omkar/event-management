"""Database engine, session factory and the FastAPI `get_db` dependency."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# The MySQL connection URL is assembled from the DB_* environment variables.
# See app/config.py and backend/.env.example.
engine = create_engine(settings.database_url, pool_pre_ping=True)

# Every request gets its own session; autocommit is off so we control commits.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all SQLAlchemy models inherit from. `Base.metadata` is what
# `create_all` uses to work out which tables to create.
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
