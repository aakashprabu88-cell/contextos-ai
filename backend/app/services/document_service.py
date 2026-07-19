import os
import uuid
import asyncio
import aiofiles
from uuid import UUID
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.document import Document
from app.config import get_settings

settings = get_settings()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    async def upload(self, user_id: UUID, file: UploadFile) -> Document:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds 10MB limit")

        file_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1]
        saved_name = f"{file_id}{ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, saved_name)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)

        file_size = len(content)
        content_text = None
        if file.content_type in ("text/plain", "text/markdown"):
            content_text = content.decode("utf-8", errors="ignore")

        doc = Document(
            user_id=user_id,
            filename=saved_name,
            original_filename=file.filename,
            file_type=file.content_type or "application/octet-stream",
            file_size=file_size,
            content_text=content_text,
        )
        self.db.add(doc)
        await self.db.flush()
        await self.db.refresh(doc)
        return doc

    async def get_by_id(self, doc_id: UUID, user_id: UUID) -> Document | None:
        result = await self.db.execute(
            select(Document).where(Document.id == doc_id, Document.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_documents(self, user_id: UUID, skip: int = 0, limit: int = 50) -> tuple[list[Document], int]:
        count_result = await self.db.execute(
            select(func.count(Document.id)).where(Document.user_id == user_id)
        )
        total = count_result.scalar()
        result = await self.db.execute(
            select(Document)
            .where(Document.user_id == user_id)
            .order_by(Document.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def delete(self, doc_id: UUID, user_id: UUID) -> bool:
        doc = await self.get_by_id(doc_id, user_id)
        if doc:
            file_path = os.path.join(settings.UPLOAD_DIR, doc.filename)
            await asyncio.to_thread(self._remove_file, file_path)
            await self.db.delete(doc)
            return True
        return False

    @staticmethod
    def _remove_file(path: str):
        if os.path.exists(path):
            os.remove(path)
