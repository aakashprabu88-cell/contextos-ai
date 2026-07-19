from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.search import SearchRequest, SearchResponse, SearchResult
from app.services.mock_data import MockDataService
from app.services.activity_service import ActivityService
from app.models.activity import ActivityType
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/search", tags=["Search"])

mock_service = MockDataService()


@router.post("", response_model=SearchResponse)
async def search(
    data: SearchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    results = []

    if data.search_type in ("all", "email"):
        emails = mock_service.search_emails(data.query, data.limit)
        for e in emails:
            results.append(SearchResult(
                id=e["id"], title=e["subject"], content=e["body"],
                source="email", score=e.get("_score", 0) / 4.0,
                metadata={"from": e["from"], "date": e["date"]},
            ))

    if data.search_type in ("all", "calendar"):
        events = mock_service.search_calendar(data.query, data.limit)
        for e in events:
            results.append(SearchResult(
                id=e["id"], title=e["title"], content=e["description"],
                source="calendar", score=e.get("_score", 0) / 4.0,
                metadata={"start_time": e["start_time"], "location": e.get("location")},
            ))

    if data.search_type in ("all", "notes"):
        notes = mock_service.search_notes(data.query, data.limit)
        for n in notes:
            results.append(SearchResult(
                id=n["id"], title=n["title"], content=n["content"][:500],
                source="notes", score=n.get("_score", 0) / 4.0,
                metadata={"tags": n["tags"]},
            ))

    if data.search_type in ("all", "files"):
        files = mock_service.search_files(data.query, data.limit)
        for f in files:
            results.append(SearchResult(
                id=f["id"], title=f["name"], content=f["content"][:500],
                source="files", score=f.get("_score", 0) / 4.0,
                metadata={"type": f["type"], "size": f["size"]},
            ))

    results.sort(key=lambda x: x.score, reverse=True)
    results = results[:data.limit]

    activity_service = ActivityService(db)
    await activity_service.create(
        current_user.id, ActivityType.SEARCH,
        f"Search: {data.query}", f"Found {len(results)} results",
    )

    return SearchResponse(results=results, query=data.query, total=len(results))
