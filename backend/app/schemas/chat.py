from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class ChatSessionCreate(BaseModel):
    title: str = "New Chat"


class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageCreate(BaseModel):
    content: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    extra_data: Optional[Any] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionWithMessages(ChatSessionResponse):
    messages: list[ChatMessageResponse] = []


class ChatSessionList(BaseModel):
    sessions: list[ChatSessionResponse]
    total: int
