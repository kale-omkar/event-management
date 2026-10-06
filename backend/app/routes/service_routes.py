"""HTTP endpoints for services."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.service import ServiceResponse
from app.services import service_service

router = APIRouter(prefix="/api/services", tags=["Services"])


@router.get("", response_model=list[ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    """Return all available services."""
    return service_service.get_all_services(db)