from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])

@router.get("/", response_model=List[schemas.GalleryBase])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(models.Gallery).all()
