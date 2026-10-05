"""Pydantic schemas for booking requests."""

import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# Indian mobile numbers: 10 digits starting 6-9, optionally +91 prefixed.
PHONE_PATTERN = r"(?:\+?91[- ]?)?[6-9]\d{9}"


class BookingCreate(BaseModel):
    """Payload for POST /api/bookings."""

    event_id: int | None = None
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone: str

    event_type: str = Field(min_length=2, max_length=100)
    event_date: date
    guests: int = Field(ge=1, le=1000)
    message: str | None = Field(default=None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        """Strip spaces/dashes and require a valid 10-digit Indian mobile number."""
        cleaned = value.replace(" ", "").replace("-", "")
        if not re.fullmatch(PHONE_PATTERN, cleaned):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return cleaned

    @field_validator("event_date")
    @classmethod
    def validate_future_date(cls, value: date) -> date:
        """Bookings cannot be in the past."""
        if value < date.today():
            raise ValueError("Event date must be today or in the future")
        return value


class BookingResponse(BaseModel):
    """A saved booking as returned by the API."""

    id: int
    event_id: int | None = None
    name: str
    email: EmailStr
    phone: str
    event_type: str
    event_date: date
    guests: int
    message: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)