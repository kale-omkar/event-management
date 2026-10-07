

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

class ContactCreate(BaseModel):

    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    subject: str | None = Field(default=None, max_length=255)
    message: str = Field(min_length=10, max_length=5000)

class ContactResponse(ContactCreate):

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)