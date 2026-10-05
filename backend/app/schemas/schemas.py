from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time, datetime

class GalleryBase(BaseModel):
    id: int
    event_id: int
    image_url: str
    caption: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    id: int
    title: str
    category: str
    description: Optional[str] = None
    event_date: date
    event_time: time
    venue: str
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    gallery_images: List[GalleryBase] = []

    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TestimonialBase(BaseModel):
    id: int
    name: str
    designation: Optional[str] = None
    message: str
    rating: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
