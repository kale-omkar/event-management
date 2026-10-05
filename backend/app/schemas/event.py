"""Pydantic schemas for events: what goes in, and what comes out."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EventBase(BaseModel):
    """Fields a client is allowed to set on an event."""

    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    category: str = Field(default="General", max_length=100)
    date: datetime
    location: str = Field(min_length=2, max_length=255)

    # Rupees. Use round realistic amounts; the frontend formats them.
    price: float = Field(default=0.0, ge=0)

    # One inclusion per line, or null.
    inclusions: str | None = None

    # Relative path such as "/images/events/wedding-grand.svg".
    image_url: str | None = None


class EventCreate(EventBase):
    """Payload for POST /api/events."""


class EventResponse(EventBase):
    """An event as returned by the API, including server-managed fields."""

    id: int
    created_at: datetime

    # Lets Pydantic read the attributes straight off the SQLAlchemy object.
    model_config = ConfigDict(from_attributes=True)


class EventListResponse(BaseModel):
    """Shape of GET /api/events, so the client knows the categories up front."""

    events: list[EventResponse]
    total: int
    categories: list[str]