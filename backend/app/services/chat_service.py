from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from sqlalchemy.orm import selectinload
from app.models.chat import ChatSession, ChatMessage, MessageRole


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_session(self, user_id: UUID, title: str = "New Chat") -> ChatSession:
        session = ChatSession(user_id=user_id, title=title)
        self.db.add(session)
        await self.db.flush()
        await self.db.refresh(session)
        return session

    async def get_session(self, session_id: UUID, user_id: UUID) -> ChatSession | None:
        result = await self.db.execute(
            select(ChatSession)
            .options(selectinload(ChatSession.messages))
            .where(ChatSession.id == session_id, ChatSession.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_sessions(self, user_id: UUID) -> list[ChatSession]:
        result = await self.db.execute(
            select(ChatSession)
            .where(ChatSession.user_id == user_id)
            .order_by(ChatSession.updated_at.desc())
        )
        return list(result.scalars().all())

    async def add_message(self, session_id: UUID, role: MessageRole, content: str, extra_data: dict = None) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            extra_data=extra_data,
        )
        self.db.add(message)

        count_result = await self.db.execute(
            select(func.count(ChatMessage.id)).where(ChatMessage.session_id == session_id)
        )
        existing_count = count_result.scalar()

        if existing_count == 0:
            result = await self.db.execute(
                select(ChatSession).where(ChatSession.id == session_id)
            )
            session = result.scalar_one_or_none()
            if session:
                session.title = content[:100] if len(content) > 100 else content

        await self.db.flush()
        await self.db.refresh(message)
        return message

    async def delete_session(self, session_id: UUID, user_id: UUID) -> bool:
        result = await self.db.execute(
            select(ChatSession).where(ChatSession.id == session_id, ChatSession.user_id == user_id)
        )
        session = result.scalar_one_or_none()
        if session:
            await self.db.execute(
                delete(ChatMessage).where(ChatMessage.session_id == session_id)
            )
            await self.db.delete(session)
            return True
        return False
