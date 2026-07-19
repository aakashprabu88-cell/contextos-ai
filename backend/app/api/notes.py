from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteList
from app.services.note_service import NoteService
from app.services.activity_service import ActivityService
from app.models.activity import ActivityType
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/notes", tags=["Notes"])


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.create(current_user.id, data)
    activity_service = ActivityService(db)
    await activity_service.create(
        current_user.id, ActivityType.NOTE_CREATED,
        f"Note created: {note.title}", None,
    )
    return NoteResponse.model_validate(note)


@router.get("", response_model=NoteList)
async def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    notes, total = await service.list_notes(current_user.id, skip, limit)
    return NoteList(notes=[NoteResponse.model_validate(n) for n in notes], total=total)


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.get_by_id(note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteResponse.model_validate(note)


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    data: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.get_by_id(note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note = await service.update(note, data)
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    deleted = await service.delete(note_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
