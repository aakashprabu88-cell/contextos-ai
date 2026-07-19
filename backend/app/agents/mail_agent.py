"""Mail Agent - Searches and analyzes mock emails."""
from app.agents.base import AgentState, add_trace
from app.services.mock_data import MockDataService


mock_service = MockDataService()


async def mail_agent(state: AgentState) -> AgentState:
    query = state["query"]
    emails = mock_service.search_emails(query, limit=5)

    if not emails:
        emails = mock_service.get_recent_emails(3)

    trace = add_trace(state, "mail_agent", "searched_emails", {"count": len(emails), "query": query})

    return {
        **state,
        "emails": emails,
        "agent_trace": trace,
        "current_agent": "mail_agent",
    }
