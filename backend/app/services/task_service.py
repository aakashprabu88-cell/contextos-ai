from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate


class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, data: TaskCreate) -> Task:
        task = Task(
            user_id=user_id,
            title=data.title,
            description=data.description,
            task_type=data.task_type,
            input_query=data.input_query,
        )
        self.db.add(task)
        await self.db.flush()
        await self.db.refresh(task)
        return task

    async def get_by_id(self, task_id: UUID, user_id: UUID) -> Task | None:
        result = await self.db.execute(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_tasks(self, user_id: UUID, skip: int = 0, limit: int = 20) -> tuple[list[Task], int]:
        count_result = await self.db.execute(
            select(func.count(Task.id)).where(Task.user_id == user_id)
        )
        total = count_result.scalar()

        result = await self.db.execute(
            select(Task)
            .where(Task.user_id == user_id)
            .order_by(Task.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def update_status(self, task: Task, status: TaskStatus, result: dict = None, error: str = None) -> Task:
        task.status = status
        if result:
            task.result = result
        if error:
            task.error_message = error
        if status in (TaskStatus.COMPLETED, TaskStatus.FAILED):
            task.completed_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(task)
        return task

    async def update_result(self, task: Task, result: dict, agent_trace: list = None) -> Task:
        task.result = result
        if agent_trace:
            task.agent_trace = agent_trace
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(task)
        return task

    async def delete(self, task_id: UUID, user_id: UUID) -> bool:
        task = await self.get_by_id(task_id, user_id)
        if task:
            await self.db.delete(task)
            return True
        return False
