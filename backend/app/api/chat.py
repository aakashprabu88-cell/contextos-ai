from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.chat import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionWithMessages,
    ChatMessageCreate, ChatMessageResponse, ChatSessionList,
)
from app.services.chat_service import ChatService
from app.utils.security import get_current_user
from app.models.user import User
from app.models.chat import MessageRole
from app.agents.workflow import execute_workflow

router = APIRouter(prefix="/api/chat", tags=["Chat"])

_DATA_KEYWORDS = [
    "email", "calendar", "meeting", "task", "note", "document", "file",
    "schedule", "summarize", "search", "find", "what do i", "show me",
    "list", "review", "inbox", "event", "reminder", "deadline", "upload",
]


def needs_workflow(query: str) -> bool:
    q = query.lower()
    return any(kw in q for kw in _DATA_KEYWORDS)


def conversational_response(query: str) -> str:
    q = query.lower().strip()
    greetings = {"hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup"}
    if any(g in q for g in greetings):
        return "Hey! How can I help you today? I can look up emails, calendar events, notes, files, or help you prepare for meetings."
    if "how are you" in q or "how's it going" in q:
        return "I'm doing great, thanks for asking! I'm ready to help you with your emails, calendar, notes, or any meeting preparation you need."
    if "thank" in q:
        return "You're welcome! Let me know if there's anything else I can help with."
    if "who are you" in q or "what are you" in q:
        return "I'm ContextOS AI, your personal assistant. I can search through your emails, calendar, notes, and files to help you prepare for meetings and stay organized."
    if "?" in q:
        return "That's a great question! For now, I'm best at helping with emails, calendar events, notes, and meeting prep. Try asking me something like 'show me my upcoming meetings' or 'what emails do I have about the project?'"
    return "I'm here to help! Try asking me about your emails, calendar, notes, or files. For example: 'summarize my emails about the project' or 'what meetings do I have this week?'"


@router.get("/sessions", response_model=ChatSessionList)
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ChatService(db)
    sessions = await service.list_sessions(current_user.id)
    return ChatSessionList(
        sessions=[ChatSessionResponse.model_validate(s) for s in sessions],
        total=len(sessions),
    )


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ChatService(db)
    session = await service.create_session(current_user.id, data.title)
    return ChatSessionResponse.model_validate(session)


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ChatService(db)
    session = await service.get_session(session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = [ChatMessageResponse.model_validate(m) for m in session.messages] if session.messages else []
    return ChatSessionWithMessages(
        id=session.id, title=session.title,
        created_at=session.created_at, updated_at=session.updated_at,
        messages=messages,
    )


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    session_id: str,
    data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ChatService(db)
    session = await service.get_session(session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    user_msg = await service.add_message(session_id, MessageRole.USER, data.content)

    try:
        if not needs_workflow(data.content):
            assistant_content = conversational_response(data.content)
            assistant_msg = await service.add_message(
                session_id, MessageRole.ASSISTANT, assistant_content,
            )
        else:
            result = await execute_workflow(data.content)
            assistant_content = f"""## Meeting Preparation Results

### Meeting Summary
{result.get('meeting_summary', '')}

### Agenda
{chr(10).join(f'- {item}' for item in result.get('agenda', []))}

### Action Items
{chr(10).join(f'- {item}' for item in result.get('action_items', []))}

### Questions to Address
{chr(10).join(f'- {q}' for q in result.get('questions', []))}

### Email Draft
{result.get('email_draft', '')}

### Presentation Outline
{result.get('ppt_outline', '')}

---
*Sources: {result.get('context', {}).get('emails_found', 0)} emails, {result.get('context', {}).get('events_found', 0)} events, {result.get('context', {}).get('notes_found', 0)} notes, {result.get('context', {}).get('files_found', 0)} files analyzed*"""

            assistant_msg = await service.add_message(
                session_id, MessageRole.ASSISTANT, assistant_content,
                extra_data={"agent_trace": result.get("agent_trace", [])},
            )
    except Exception as e:
        assistant_msg = await service.add_message(
            session_id, MessageRole.ASSISTANT,
            "I encountered an error processing your request. Please try again later.",
            extra_data={"error": str(e)},
        )

    return ChatMessageResponse.model_validate(assistant_msg)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ChatService(db)
    deleted = await service.delete_session(session_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
