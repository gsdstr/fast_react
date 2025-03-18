from fastapi import APIRouter

from app.routes import events, health

api_router = APIRouter()
api_router.include_router(events.router)

def healthy_condition():
    return {"database": "online" , "version": 1}

# Include routers
api_router.include_router(health.get_router(healthy_condition))