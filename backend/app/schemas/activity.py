from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any


class ActivityResponse(BaseModel):
    id: str
    activity_type: str
    title: str
    description: Optional[str] = None
    metadata: Optional[Any] = Field(None, validation_alias="extra_data")
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivityList(BaseModel):
    activities: list[ActivityResponse]
    total: int
