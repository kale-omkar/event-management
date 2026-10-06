from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import Event
from app.models.gallery import Gallery

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])


@router.get("")
def get_gallery(
    event_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = (
        db.query(
            Gallery.id,
            Gallery.image_url,
            Gallery.caption,
            Gallery.event_id,
            Gallery.created_at,
            Event.title.label("event_title"),
            Event.category.label("category"),
        )
        .outerjoin(Event, Gallery.event_id == Event.id)
    )

    if event_id is not None:
        query = query.filter(Gallery.event_id == event_id)

    results = query.order_by(Gallery.created_at.desc()).all()

    return [
        {
            "id": row.id,
            "image_url": row.image_url,
            "caption": row.caption,
            "event_id": row.event_id,
            "created_at": row.created_at,
            "event_title": row.event_title,
            "category": row.category,
        }
        for row in results
    ]