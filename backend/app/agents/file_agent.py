"""File Agent - Searches and retrieves relevant files."""
from app.agents.base import AgentState, add_trace
from app.services.mock_data import MockDataService

mock_service = MockDataService()


async def file_agent(state: AgentState) -> AgentState:
    query = state["query"]
    files = mock_service.search_files(query, limit=5)

    if not files:
        files = mock_service.search_files("meeting", limit=3)

    trace = add_trace(state, "file_agent", "searched_files", {"count": len(files), "query": query})

    return {
        **state,
        "files": files,
        "agent_trace": trace,
        "current_agent": "file_agent",
    }
