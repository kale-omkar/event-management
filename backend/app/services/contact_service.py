"""Business logic for contact messages."""

from sqlalchemy.orm import Session

from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate


def create_contact_message(db: Session, payload: ContactCreate) -> ContactMessage:
    """Save a new contact enquiry and return the stored row."""
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message