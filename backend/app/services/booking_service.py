"""Business logic for bookings."""

from datetime import datetime, time

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.schemas.booking import BookingCreate


def create_booking(db: Session, payload: BookingCreate) -> Booking:
    """Save a new booking request and return the stored row.

    The event_date arrives as a plain date from the client; combine it with
    midnight so it fits the DATETIME column.
    """
    data = payload.model_dump()
    if data.get("event_date") is not None:
        data["event_date"] = datetime.combine(data["event_date"], time.min)

    booking = Booking(**data)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_all_bookings(db: Session) -> list[Booking]:
    """Return every booking, newest first. Used by the team dashboard."""
    return list(db.query(Booking).order_by(Booking.created_at.desc()).all())