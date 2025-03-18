from fastapi import APIRouter
from typing import Callable, Dict, Any
from datetime import datetime, UTC

def get_router(health_condition: Callable[[], Dict[str, Any]]) -> APIRouter:
    """
    Creates and returns a router for health check endpoints.
    
    Args:
        health_condition: A callback function that returns the current health status
        
    Returns:
        APIRouter: Configured router with health check endpoints
    """
    router = APIRouter(
        prefix="/health",
        tags=["health"]
    )

    # @router.get("")
    # async def health_check():
    #     """
    #     Basic health check endpoint that returns a simple status.
    #     """
    #     return {
    #         "status": "healthy",
    #         "timestamp": datetime.now(UTC).isoformat()
    #     }

    @router.get("/details")
    async def health_details():
        """
        Detailed health check endpoint that includes system status and version information.
        """
        try:
            condition_result = health_condition()
            return {
                "status": "healthy",
                "timestamp": datetime.now(UTC).isoformat(),
                **condition_result,
                "uptime": "available"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "timestamp": datetime.now(UTC).isoformat(),
                "error": str(e),
                "uptime": "unavailable"
            }

    return router 