from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any
from enum import Enum


class TaskStatusEnum(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskTypeEnum(str, Enum):
    PLANNER = "planner"
    EMAIL = "email"
    CALENDAR = "calendar"
    NOTES = "notes"
    FILES = "files"
    SUMMARY = "summary"
    SEARCH = "search"


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    task_type: TaskTypeEnum = TaskTypeEnum.PLANNER
    input_query: str = Field(..., min_length=1)


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    task_type: TaskTypeEnum
    status: TaskStatusEnum
    input_query: str
    result: Optional[Any] = None
    error_message: Optional[str] = None
    agent_trace: Optional[list] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TaskList(BaseModel):
    tasks: list[TaskResponse]
    total: int
