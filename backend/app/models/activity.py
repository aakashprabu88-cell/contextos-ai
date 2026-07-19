import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SAEnum, JSON
import enum
from app.database import Base


class ActivityType(str, enum.Enum):
    TASK_CREATED = "task_created"
    TASK_COMPLETED = "task_completed"
    TASK_FAILED = "task_failed"
    SEARCH = "search"
    DOCUMENT_UPLOADED = "document_uploaded"
    NOTE_CREATED = "note_created"
    AGENT_EXECUTED = "agent_executed"


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    activity_type = Column(SAEnum(ActivityType), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
