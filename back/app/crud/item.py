from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate

def get_item(db: Session, item_id: int) -> Item | None:
    """Get a single item by ID."""
    return db.get(Item, item_id)

def get_items(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
) -> list[Item]:
    """Get a list of items with pagination."""
    query = select(Item).offset(skip).limit(limit)
    return list(db.scalars(query))

def create_item(db: Session, item: ItemCreate) -> Item:
    """Create a new item."""
    db_item = Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(
    db: Session, 
    item_id: int, 
    item: ItemUpdate
) -> Item | None:
    """Update an existing item."""
    db_item = get_item(db, item_id)
    if not db_item:
        return None
    
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int) -> bool:
    """Delete an item by ID."""
    db_item = get_item(db, item_id)
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True 