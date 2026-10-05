"""Pydantic schemas for contact messages."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactCreate(BaseModel):
    """Payload for POST /api/contact."""

    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    subject: str | None = Field(default=None, max_length=255)
    message: str = Field(min_length=10, max_length=5000)


class ContactResponse(ContactCreate):
    """A saved contact message as returned by the API."""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)