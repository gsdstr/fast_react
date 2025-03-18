from datetime import datetime
from pydantic import BaseModel, Field

class ItemBase(BaseModel):
    """Base schema for Item."""
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    price: float = Field(..., gt=0)

class ItemCreate(ItemBase):
    """Schema for creating a new Item."""
    pass

class ItemUpdate(ItemBase):
    """Schema for updating an existing Item."""
    name: str | None = Field(None, min_length=1, max_length=100)
    price: float | None = Field(None, gt=0)

class Item(ItemBase):
    """Schema for Item response."""
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True 