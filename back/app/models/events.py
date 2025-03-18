from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.schemas import event

from app.crud import events
from app import database

router = APIRouter(
    prefix="/events",
    tags=["events"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=event.Event)
def create_event(
    event: event.EventCreate,
    db: Session = Depends(database.get_db)
):
    """Create a new event"""
    return events.create_event(db=db, event=event)

@router.get("/", response_model=List[event.Event])
def list_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(False, description="Filter only active events"),
    db: Session = Depends(database.get_db)
):
    """List all events with pagination"""
    return events.get_events(db, skip=skip, limit=limit, active_only=active_only)

@router.get("/{event_id}", response_model=event.Event)
def get_event(event_id: int, db: Session = Depends(database.get_db)):
    """Get a specific event by ID"""
    db_event = events.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.patch("/{event_id}", response_model=event.Event)
def update_event(
    event_id: int,
    event_update: event.EventUpdate,
    db: Session = Depends(database.get_db)
):
    """Update an event"""
    db_event = events.update_event(db, event_id=event_id, event_update=event_update)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(database.get_db)):
    """Delete an event"""
    success = events.delete_event(db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"} 