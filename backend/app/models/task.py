import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SAEnum, JSON
import enum
from app.database import Base


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskType(str, enum.Enum):
    PLANNER = "planner"
    EMAIL = "email"
    CALENDAR = "calendar"
    NOTES = "notes"
    FILES = "files"
    SUMMARY = "summary"
    SEARCH = "search"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(SAEnum(TaskType), default=TaskType.PLANNER)
    status = Column(SAEnum(TaskStatus), default=TaskStatus.PENDING)
    input_query = Column(Text, nullable=False)
    result = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    agent_trace = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
