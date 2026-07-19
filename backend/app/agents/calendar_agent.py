"""Calendar Agent - Searches calendar and provides scheduling context."""
from app.agents.base import AgentState, add_trace
from app.services.mock_data import MockDataService

mock_service = MockDataService()


async def calendar_agent(state: AgentState) -> AgentState:
    query = state["query"]
    events = mock_service.search_calendar(query, limit=5)

    if not events:
        events = mock_service.get_upcoming_events(48)

    trace = add_trace(state, "calendar_agent", "searched_calendar", {"count": len(events), "query": query})

    return {
        **state,
        "calendar_events": events,
        "agent_trace": trace,
        "current_agent": "calendar_agent",
    }
