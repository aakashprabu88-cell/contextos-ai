"""Base agent classes and shared state for LangGraph orchestration."""
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Any, TypedDict, Annotated
from langgraph.graph import add_messages
import operator


class AgentState(TypedDict):
    """Shared state across all agents in the workflow."""
    query: str
    emails: list[dict]
    calendar_events: list[dict]
    notes: list[dict]
    files: list[dict]
    vector_results: list[dict]
    meeting_summary: str
    agenda: list[str]
    action_items: list[str]
    questions: list[str]
    email_draft: str
    ppt_outline: str
    messages: Annotated[list, add_messages]
    agent_trace: list[dict]
    current_agent: str
    error: str


def create_initial_state(query: str) -> AgentState:
    return {
        "query": query,
        "emails": [],
        "calendar_events": [],
        "notes": [],
        "files": [],
        "vector_results": [],
        "meeting_summary": "",
        "agenda": [],
        "action_items": [],
        "questions": [],
        "email_draft": "",
        "ppt_outline": "",
        "messages": [],
        "agent_trace": [],
        "current_agent": "",
        "error": "",
    }


def add_trace(state: AgentState, agent_name: str, action: str, details: dict = None) -> list[dict]:
    trace_entry = {
        "agent": agent_name,
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if details:
        trace_entry["details"] = details
    return state["agent_trace"] + [trace_entry]
