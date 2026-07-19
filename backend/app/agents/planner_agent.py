"""Planner Agent - Main orchestrator that routes to sub-agents."""
from app.agents.base import AgentState, add_trace


async def planner_agent(state: AgentState) -> AgentState:
    query = state["query"].lower()
    trace = add_trace(state, "planner_agent", "analyzed_query", {"query": query, "routing": "all_agents"})

    return {
        **state,
        "agent_trace": trace,
        "current_agent": "planner_agent",
    }
