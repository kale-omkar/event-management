"""SQLAlchemy model for the `events` table."""

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Free-text category used by the frontend filter chips, e.g. "Wedding",
    # "Corporate", "Birthday", "Concert".
    category: Mapped[str] = mapped_column(String(100), nullable=False, default="General", index=True)

    # `date` holds the full date and time the event starts.
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)

    # Price in Indian Rupees. Defaults to 0 so free events need no value.
    price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # What's included, one item per line. The frontend splits this into a list.
    inclusions: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relative path only, e.g. "/images/events/wedding-grand.svg". Resolved by
    # the frontend against frontend/public/, so images never depend on the API.
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())