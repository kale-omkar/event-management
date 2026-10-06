"""Business logic for services."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.service import Service


def get_all_services(db: Session) -> list[Service]:
    """Return all services ordered by name."""
    return list(db.scalars(select(Service).order_by(Service.name.asc())).all())