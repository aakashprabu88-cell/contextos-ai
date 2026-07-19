"""Notes Agent - Semantic search across notes."""
from app.agents.base import AgentState, add_trace
from app.services.mock_data import MockDataService

mock_service = MockDataService()


async def notes_agent(state: AgentState) -> AgentState:
    query = state["query"]
    notes = mock_service.search_notes(query, limit=5)

    if not notes:
        notes = mock_service.search_notes("meeting preparation", limit=3)

    trace = add_trace(state, "notes_agent", "searched_notes", {"count": len(notes), "query": query})

    return {
        **state,
        "notes": notes,
        "agent_trace": trace,
        "current_agent": "notes_agent",
    }
