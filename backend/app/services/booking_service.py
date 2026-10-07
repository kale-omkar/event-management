

from datetime import datetime, time

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.schemas.booking import BookingCreate

def create_booking(db: Session, payload: BookingCreate) -> Booking:
    
    data = payload.model_dump()
    if data.get("event_date") is not None:
        data["event_date"] = datetime.combine(data["event_date"], time.min)

    booking = Booking(**data)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_all_bookings(db: Session) -> list[Booking]:
    
    return list(db.query(Booking).order_by(Booking.created_at.desc()).all())