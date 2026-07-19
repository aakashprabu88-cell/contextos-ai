from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskList
from app.services.task_service import TaskService
from app.services.activity_service import ActivityService
from app.models.activity import ActivityType
from app.models.task import TaskStatus
from app.utils.security import get_current_user
from app.models.user import User
from app.agents.workflow import execute_workflow

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TaskService(db)
    task = await service.create(current_user.id, data)
    activity_service = ActivityService(db)
    await activity_service.create(
        current_user.id, ActivityType.TASK_CREATED,
        f"Task created: {task.title}", f"Type: {task.task_type.value}",
    )
    return TaskResponse.model_validate(task)


@router.get("", response_model=TaskList)
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TaskService(db)
    tasks, total = await service.list_tasks(current_user.id, skip, limit)
    return TaskList(tasks=[TaskResponse.model_validate(t) for t in tasks], total=total)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TaskService(db)
    task = await service.get_by_id(task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskResponse.model_validate(task)


@router.post("/{task_id}/execute", response_model=TaskResponse)
async def execute_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TaskService(db)
    task = await service.get_by_id(task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task = await service.update_status(task, TaskStatus.RUNNING)
    activity_service = ActivityService(db)
    await activity_service.create(
        current_user.id, ActivityType.AGENT_EXECUTED,
        f"Executing: {task.title}", f"Query: {task.input_query}",
    )

    try:
        result = await execute_workflow(task.input_query)
        task = await service.update_result(task, result, result.get("agent_trace", []))
        await activity_service.create(
            current_user.id, ActivityType.TASK_COMPLETED,
            f"Completed: {task.title}", None,
        )
    except Exception as e:
        task = await service.update_status(
            task,
            TaskStatus.FAILED,
            error=str(e),
        )
        await activity_service.create(
            current_user.id, ActivityType.TASK_FAILED,
            f"Failed: {task.title}", str(e),
        )
        raise HTTPException(status_code=500, detail="Agent execution failed")

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TaskService(db)
    deleted = await service.delete(task_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
