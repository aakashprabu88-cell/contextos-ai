"""Tests for mock data services and AI agents."""
import pytest
from app.services.mock_data import MockDataService


@pytest.fixture
def mock_service():
    return MockDataService()


class TestMockDataSearch:
    def test_search_emails_by_subject(self, mock_service):
        results = mock_service.search_emails("roadmap")
        assert len(results) > 0
        assert any("roadmap" in r["subject"].lower() for r in results)

    def test_search_emails_by_body(self, mock_service):
        results = mock_service.search_emails("LangGraph")
        assert len(results) > 0

    def test_search_emails_no_results(self, mock_service):
        results = mock_service.search_emails("xyznonexistent")
        assert len(results) == 0

    def test_search_calendar_by_title(self, mock_service):
        results = mock_service.search_calendar("standup")
        assert len(results) > 0
        assert any("standup" in r["title"].lower() for r in results)

    def test_search_calendar_by_description(self, mock_service):
        results = mock_service.search_calendar("LangGraph")
        assert len(results) > 0

    def test_search_notes_by_title(self, mock_service):
        results = mock_service.search_notes("meeting preparation")
        assert len(results) > 0

    def test_search_notes_by_content(self, mock_service):
        results = mock_service.search_notes("vector search")
        assert len(results) > 0

    def test_search_files_by_name(self, mock_service):
        results = mock_service.search_files("roadmap")
        assert len(results) > 0

    def test_search_files_by_content(self, mock_service):
        results = mock_service.search_files("agent framework")
        assert len(results) > 0

    def test_search_all(self, mock_service):
        results = mock_service.search_all("meeting")
        assert "emails" in results
        assert "calendar" in results
        assert "notes" in results
        assert "files" in results

    def test_get_upcoming_events(self, mock_service):
        events = mock_service.get_upcoming_events(hours=100)
        assert len(events) > 0

    def test_get_recent_emails(self, mock_service):
        emails = mock_service.get_recent_emails(3)
        assert len(emails) <= 3
        assert len(emails) > 0

    def test_search_limit(self, mock_service):
        results = mock_service.search_emails("a", limit=2)
        assert len(results) <= 2


class TestMockDataIntegrity:
    def test_email_structure(self, mock_service):
        emails = mock_service.get_recent_emails(1)
        email = emails[0]
        assert "id" in email
        assert "from" in email
        assert "subject" in email
        assert "body" in email
        assert "date" in email
        assert "labels" in email

    def test_calendar_structure(self, mock_service):
        events = mock_service.get_upcoming_events(hours=100)
        event = events[0]
        assert "id" in event
        assert "title" in event
        assert "start_time" in event
        assert "end_time" in event
        assert "attendees" in event


class TestAgentWorkflow:
    def test_create_initial_state(self):
        from app.agents.base import create_initial_state
        state = create_initial_state("test query")
        assert state["query"] == "test query"
        assert state["emails"] == []
        assert state["calendar_events"] == []
        assert state["notes"] == []
        assert state["files"] == []
        assert state["agent_trace"] == []

    def test_planner_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.planner_agent import planner_agent
        state = create_initial_state("Prepare tomorrow's meeting")
        result = planner_agent(state)
        assert result["current_agent"] == "planner_agent"
        assert len(result["agent_trace"]) > 0

    def test_mail_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.mail_agent import mail_agent
        state = create_initial_state("meeting")
        result = mail_agent(state)
        assert len(result["emails"]) > 0
        assert result["current_agent"] == "mail_agent"

    def test_calendar_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.calendar_agent import calendar_agent
        state = create_initial_state("meeting")
        result = calendar_agent(state)
        assert len(result["calendar_events"]) > 0
        assert result["current_agent"] == "calendar_agent"

    def test_notes_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.notes_agent import notes_agent
        state = create_initial_state("meeting preparation")
        result = notes_agent(state)
        assert len(result["notes"]) > 0
        assert result["current_agent"] == "notes_agent"

    def test_file_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.file_agent import file_agent
        state = create_initial_state("roadmap")
        result = file_agent(state)
        assert len(result["files"]) > 0
        assert result["current_agent"] == "file_agent"

    def test_summary_agent(self):
        from app.agents.base import create_initial_state
        from app.agents.summary_agent import summary_agent
        state = create_initial_state("Prepare tomorrow's meeting")
        state["emails"] = [{"subject": "Test", "body": "Test body", "from": "test@test.com"}]
        state["calendar_events"] = [{"title": "Test Meeting", "description": "Test desc"}]
        state["notes"] = [{"title": "Test Note", "content": "Test content", "tags": ["test"]}]
        state["files"] = [{"name": "test.pdf", "content": "Test file content"}]
        result = summary_agent(state)
        assert result["meeting_summary"] != ""
        assert len(result["agenda"]) > 0
        assert len(result["action_items"]) > 0
        assert len(result["questions"]) > 0
        assert result["email_draft"] != ""
        assert result["ppt_outline"] != ""

    def test_workflow_build(self):
        from app.agents.workflow import build_workflow
        workflow = build_workflow()
        assert workflow is not None

    def test_workflow_execution(self):
        from app.agents.workflow import execute_workflow
        import asyncio
        result = asyncio.run(execute_workflow("Prepare tomorrow's meeting"))
        assert "meeting_summary" in result
        assert "agenda" in result
        assert "action_items" in result
        assert "questions" in result
        assert "email_draft" in result
        assert "ppt_outline" in result
        assert "agent_trace" in result
        assert "context" in result
        assert len(result["agent_trace"]) > 0
