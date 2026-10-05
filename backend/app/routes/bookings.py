from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import models
from app.schemas import schemas


router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=schemas.BookingResponse, status_code=201)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db)
):
    new_booking = models.Booking(
        full_name=booking.full_name,
        email=booking.email,
        phone=booking.phone,
        event_type=booking.event_type,
        preferred_date=booking.preferred_date,
        guests=booking.guests,
        message=booking.message
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


@router.get("/", response_model=List[schemas.BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    return bookings


@router.get("/{id}", response_model=schemas.BookingResponse)
def get_booking(
    id: int,
    db: Session = Depends(get_db)
):
    booking = (
        db.query(models.Booking)
        .filter(models.Booking.id == id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking