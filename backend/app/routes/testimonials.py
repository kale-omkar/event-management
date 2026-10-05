from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])

@router.get("/", response_model=List[schemas.TestimonialBase])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).all()
