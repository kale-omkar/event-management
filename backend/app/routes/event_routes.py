"""HTTP endpoints for events."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.event import EventCreate, EventListResponse, EventResponse
from app.services import event_service

router = APIRouter(prefix="/api/events", tags=["Events"])


@router.get("", response_model=EventListResponse)
def read_events(
    category: str | None = Query(default=None, description="Filter by category"),
    search: str | None = Query(default=None, description="Search title, description, location"),
    db: Session = Depends(get_db),
):
    """GET /api/events - list events, soonest first, with optional filters.

    Always returns the full list of available categories so the frontend filter
    chips stay in sync with the data without a second request.
    """
    return {
        "events": event_service.get_filtered_events(db, category=category, search=search),
        "total": len(event_service.get_all_events(db)),
        "categories": event_service.get_categories(db),
    }


@router.get("/{event_id}", response_model=EventResponse)
def read_event(event_id: int, db: Session = Depends(get_db)):
    """GET /api/events/{id} - fetch one event."""
    event = event_service.get_event_by_id(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.get("/{event_id}/related", response_model=list[EventResponse])
def read_related_events(event_id: int, db: Session = Depends(get_db)):
    """GET /api/events/{id}/related - other events in the same category."""
    event = event_service.get_event_by_id(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event_service.get_related_events(db, event)


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    """POST /api/events - create an event."""
    return event_service.create_event(db, payload)