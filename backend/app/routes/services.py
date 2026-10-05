from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api/services", tags=["Services"])

@router.get("/", response_model=List[schemas.ServiceBase])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@router.get("/{id}", response_model=schemas.ServiceBase)
def get_service(id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.id == id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
