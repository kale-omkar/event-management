from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# psycopg2 requires the scheme to be "postgresql+psycopg2" for SQLAlchemy.
# Neon gives URLs that start with "postgresql://" which SQLAlchemy accepts directly.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    # Neon's pooler handles connection limits; keep pool small.
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
