

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

class EventBase(BaseModel):

    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    category: str = Field(default="General", max_length=100)
    date: datetime
    location: str = Field(min_length=2, max_length=255)

    price: float = Field(default=0.0, ge=0)

    inclusions: str | None = None

    image_url: str | None = None

class EventCreate(EventBase):

class EventResponse(EventBase):

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EventListResponse(BaseModel):

    events: list[EventResponse]
    total: int
    categories: list[str]