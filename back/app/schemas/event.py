from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)
    date: datetime
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    capacity: Optional[int] = Field(0, ge=0)
    is_active: Optional[bool] = True

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)
    date: Optional[datetime] = None
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    capacity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class Event(EventBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 