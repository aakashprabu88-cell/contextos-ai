from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class ActivityResponse(BaseModel):
    id: UUID
    activity_type: str
    title: str
    description: Optional[str] = None
    extra_data: Optional[Any] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivityList(BaseModel):
    activities: list[ActivityResponse]
    total: int
