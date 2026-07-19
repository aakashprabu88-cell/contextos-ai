from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentList(BaseModel):
    documents: list[DocumentResponse]
    total: int
