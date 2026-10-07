

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services import booking_service, event_service

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    
    if payload.event_id is not None:
        if event_service.get_event_by_id(db, payload.event_id) is None:
            raise HTTPException(status_code=404, detail="Event not found")

    return booking_service.create_booking(db, payload)

@router.get("", response_model=list[BookingResponse])
def read_bookings(db: Session = Depends(get_db)):
    
    return booking_service.get_all_bookings(db)