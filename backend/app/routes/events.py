from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("/", response_model=List[schemas.EventBase])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    return events

@router.get("/{id}", response_model=schemas.EventBase)
def get_event(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
