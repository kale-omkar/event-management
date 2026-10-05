from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import models
from app.routes import events, services, testimonials, gallery, bookings


# Auto-create all tables in the database based on SQLAlchemy models
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Event Management API")


# Configure CORS for React frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(events.router)
app.include_router(services.router)
app.include_router(testimonials.router)
app.include_router(gallery.router)
app.include_router(bookings.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Event Management API"}