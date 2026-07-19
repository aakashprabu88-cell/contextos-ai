from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.activity import ActivityResponse, ActivityList
from app.services.activity_service import ActivityService
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("", response_model=ActivityList)
async def list_activities(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ActivityService(db)
    activities = await service.list_activities(current_user.id, limit)
    return ActivityList(
        activities=[ActivityResponse.model_validate(a) for a in activities],
        total=len(activities),
    )
