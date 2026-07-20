from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any


class ChatSessionCreate(BaseModel):
    title: str = "New Chat"


class ChatSessionResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageCreate(BaseModel):
    content: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    metadata: Optional[Any] = Field(None, validation_alias="extra_data")
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionWithMessages(ChatSessionResponse):
    messages: list[ChatMessageResponse] = []


class ChatSessionList(BaseModel):
    sessions: list[ChatSessionResponse]
    total: int
