from pydantic import BaseModel, Field
from typing import Optional, Any


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    search_type: str = "all"
    limit: int = Field(default=10, ge=1, le=50)


class SearchResult(BaseModel):
    id: str
    title: str
    content: str
    source: str
    score: float
    metadata: Optional[Any] = None


class SearchResponse(BaseModel):
    results: list[SearchResult]
    query: str
    total: int
