from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.schemas import event
from app.models import event as models

def create_event(db: Session, event: event.EventCreate) -> models.Event:
    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    active_only: bool = False
) -> List[models.Event]:
    query = db.query(models.Event)
    if active_only:
        query = query.filter(models.Event.is_active == True)
    return query.order_by(desc(models.Event.date)).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: int) -> Optional[models.Event]:
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def update_event(
    db: Session, 
    event_id: int, 
    event_update: event.EventUpdate
) -> Optional[models.Event]:
    db_event = get_event(db, event_id)
    if db_event:
        update_data = event_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_event, field, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int) -> bool:
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False 