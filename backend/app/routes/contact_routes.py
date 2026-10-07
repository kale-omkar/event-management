

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.contact import ContactCreate, ContactResponse
from app.services import contact_service

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact_message(payload: ContactCreate, db: Session = Depends(get_db)):
    
    return contact_service.create_contact_message(db, payload)