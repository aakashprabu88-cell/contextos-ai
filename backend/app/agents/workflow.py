"""LangGraph workflow orchestrating all agents with caching."""
import hashlib
import time
from typing import Any
from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, create_initial_state
from app.agents.planner_agent import planner_agent
from app.agents.mail_agent import mail_agent
from app.agents.calendar_agent import calendar_agent
from app.agents.notes_agent import notes_agent
from app.agents.file_agent import file_agent
from app.agents.summary_agent import summary_agent

_result_cache: dict[str, tuple[float, dict]] = {}
CACHE_TTL = 300


def _cache_key(query: str) -> str:
    return hashlib.md5(query.lower().strip().encode()).hexdigest()


def get_cached_result(query: str) -> dict | None:
    key = _cache_key(query)
    if key in _result_cache:
        ts, result = _result_cache[key]
        if time.time() - ts < CACHE_TTL:
            return result
        del _result_cache[key]
    return None


def set_cached_result(query: str, result: dict):
    key = _cache_key(query)
    _result_cache[key] = (time.time(), result)


def build_workflow() -> StateGraph:
    workflow = StateGraph(AgentState)

    workflow.add_node("planner", planner_agent)
    workflow.add_node("mail", mail_agent)
    workflow.add_node("calendar", calendar_agent)
    workflow.add_node("notes", notes_agent)
    workflow.add_node("files", file_agent)
    workflow.add_node("summary", summary_agent)

    workflow.set_entry_point("planner")

    workflow.add_edge("planner", "mail")
    workflow.add_edge("mail", "calendar")
    workflow.add_edge("calendar", "notes")
    workflow.add_edge("notes", "files")
    workflow.add_edge("files", "summary")
    workflow.add_edge("summary", END)

    return workflow.compile()


_compiled_workflow = None


def get_workflow():
    global _compiled_workflow
    if _compiled_workflow is None:
        _compiled_workflow = build_workflow()
    return _compiled_workflow


async def execute_workflow(query: str) -> dict:
    cached = get_cached_result(query)
    if cached is not None:
        return cached

    workflow = get_workflow()
    initial_state = create_initial_state(query)
    final_state = await workflow.ainvoke(initial_state)

    result = {
        "query": final_state["query"],
        "meeting_summary": final_state["meeting_summary"],
        "agenda": final_state["agenda"],
        "action_items": final_state["action_items"],
        "questions": final_state["questions"],
        "email_draft": final_state["email_draft"],
        "ppt_outline": final_state["ppt_outline"],
        "agent_trace": final_state["agent_trace"],
        "context": {
            "emails_found": len(final_state["emails"]),
            "events_found": len(final_state["calendar_events"]),
            "notes_found": len(final_state["notes"]),
            "files_found": len(final_state["files"]),
        },
    }

    set_cached_result(query, result)
    return result
