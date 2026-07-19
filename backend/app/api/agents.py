from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.agents.workflow import execute_workflow
from app.services.activity_service import ActivityService
from app.models.activity import ActivityType

router = APIRouter(prefix="/api/agents", tags=["Agents"])


class AgentExecuteRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)


class AgentExecuteResponse(BaseModel):
    query: str
    meeting_summary: str
    agenda: list[str]
    action_items: list[str]
    questions: list[str]
    email_draft: str
    ppt_outline: str
    agent_trace: list[dict]
    context: dict


@router.post("/execute", response_model=AgentExecuteResponse)
async def execute_agent(
    data: AgentExecuteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    activity_service = ActivityService(db)
    try:
        result = await execute_workflow(data.query)
    except Exception as e:
        await activity_service.create(
            current_user.id, ActivityType.TASK_FAILED,
            f"Agent failed: {data.query[:100]}", str(e),
        )
        raise HTTPException(status_code=500, detail="Agent execution failed")
    await activity_service.create(
        current_user.id, ActivityType.AGENT_EXECUTED,
        f"Agent executed: {data.query[:100]}",
        f"Trace steps: {len(result.get('agent_trace', []))}",
    )
    return AgentExecuteResponse(**result)


@router.get("/status")
async def agent_status():
    return {
        "status": "operational",
        "agents": [
            {"name": "Planner Agent", "status": "active", "description": "Main orchestrator for query routing"},
            {"name": "Mail Agent", "status": "active", "description": "Email search and analysis"},
            {"name": "Calendar Agent", "status": "active", "description": "Calendar search and scheduling"},
            {"name": "Notes Agent", "status": "active", "description": "Semantic notes search"},
            {"name": "File Agent", "status": "active", "description": "Document retrieval and analysis"},
            {"name": "Summary Agent", "status": "active", "description": "Comprehensive output generation"},
        ],
    }
