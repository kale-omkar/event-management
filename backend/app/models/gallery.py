from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.database import Base

class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(
        Integer,
        ForeignKey("events.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    image_url = Column(String(500), nullable=False)

    caption = Column(String(255), nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )