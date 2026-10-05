"""Business logic for events.

Routes stay thin by delegating all database work to these functions. Keeping
the logic here means the same code can be reused by a CLI script or a
background job later without going through HTTP.
"""

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.event import Event
from app.schemas.event import EventCreate


def get_all_events(db: Session) -> list[Event]:
    """Return every event, soonest first."""
    return list(db.scalars(select(Event).order_by(Event.date.asc())).all())


def get_filtered_events(
    db: Session,
    category: str | None = None,
    search: str | None = None,
) -> list[Event]:
    """Return events, optionally narrowed by category and/or a text search."""
    query = select(Event).order_by(Event.date.asc())

    if category and category.lower() != "all":
        query = query.where(Event.category == category)

    if search:
        # Search titles, descriptions and locations, case-insensitively.
        pattern = f"%{search.strip()}%"
        query = query.where(
            or_(
                Event.title.ilike(pattern),
                Event.description.ilike(pattern),
                Event.location.ilike(pattern),
            )
        )

    return list(db.scalars(query).all())


def get_event_by_id(db: Session, event_id: int) -> Event | None:
    """Return a single event, or None if there is no event with that id."""
    return db.get(Event, event_id)


def get_related_events(db: Session, event: Event, limit: int = 3) -> list[Event]:
    """Other events in the same category, soonest first."""
    query = (
        select(Event)
        .where(Event.category == event.category, Event.id != event.id)
        .order_by(Event.date.asc())
        .limit(limit)
    )
    return list(db.scalars(query).all())


def get_categories(db: Session) -> list[str]:
    """Distinct categories present in the table, for the filter chips."""
    rows = db.scalars(select(Event.category).distinct().order_by(Event.category)).all()
    return list(rows)


def create_event(db: Session, payload: EventCreate) -> Event:
    """Insert a new event and return the saved row."""
    event = Event(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event