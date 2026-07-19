from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate


class NoteService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, data: NoteCreate) -> Note:
        note = Note(
            user_id=user_id,
            title=data.title,
            content=data.content,
            tags=data.tags,
        )
        self.db.add(note)
        await self.db.flush()
        await self.db.refresh(note)
        return note

    async def get_by_id(self, note_id: UUID, user_id: UUID) -> Note | None:
        result = await self.db.execute(
            select(Note).where(Note.id == note_id, Note.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_notes(self, user_id: UUID, skip: int = 0, limit: int = 50) -> tuple[list[Note], int]:
        count_result = await self.db.execute(
            select(func.count(Note.id)).where(Note.user_id == user_id)
        )
        total = count_result.scalar()
        result = await self.db.execute(
            select(Note)
            .where(Note.user_id == user_id)
            .order_by(Note.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def update(self, note: Note, data: NoteUpdate) -> Note:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(note, field, value)
        await self.db.flush()
        await self.db.refresh(note)
        return note

    async def delete(self, note_id: UUID, user_id: UUID) -> bool:
        note = await self.get_by_id(note_id, user_id)
        if note:
            await self.db.delete(note)
            return True
        return False
