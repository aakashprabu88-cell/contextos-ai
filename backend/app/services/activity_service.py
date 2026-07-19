from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.activity import Activity, ActivityType


class ActivityService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, activity_type: ActivityType, title: str, description: str = None, extra_data: dict = None) -> Activity:
        activity = Activity(
            user_id=user_id,
            activity_type=activity_type,
            title=title,
            description=description,
            extra_data=extra_data,
        )
        self.db.add(activity)
        await self.db.flush()
        await self.db.refresh(activity)
        return activity

    async def list_activities(self, user_id: UUID, limit: int = 20) -> list[Activity]:
        result = await self.db.execute(
            select(Activity)
            .where(Activity.user_id == user_id)
            .order_by(Activity.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
