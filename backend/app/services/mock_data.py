"""Mock data services simulating Gmail, Calendar, Notes, and Files."""
from datetime import datetime, timedelta
from typing import Any


MOCK_EMAILS = [
    {
        "id": "email-001",
        "from": "sarah.chen@techcorp.com",
        "to": "me@contextos.ai",
        "subject": "Q4 Product Roadmap Review",
        "body": "Hi team, let's sync on the Q4 roadmap. Key topics: AI integration timeline, resource allocation, and customer feedback priorities. Please review the attached documents before the meeting.",
        "date": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "labels": ["work", "meetings"],
        "is_read": False,
        "attachments": ["q4-roadmap.pdf"],
    },
    {
        "id": "email-002",
        "from": "alex.wright@designstudio.io",
        "to": "me@contextos.ai",
        "subject": "Re: UI Mockups for Dashboard",
        "body": "I've updated the dashboard mockups based on your feedback. The glassmorphism design looks great! Let me know if you want any changes before we proceed to development.",
        "date": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
        "labels": ["design", "work"],
        "is_read": True,
        "attachments": ["dashboard-v3.fig"],
    },
    {
        "id": "email-003",
        "from": "newsletter@techdigest.com",
        "to": "me@contextos.ai",
        "subject": "Weekly AI Newsletter - Top Stories",
        "body": "This week in AI: New LangGraph features, OpenAI releases GPT-5 preview, ChromaDB performance improvements, and more. Read the full digest below.",
        "date": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "labels": ["newsletter", "ai"],
        "is_read": True,
        "attachments": [],
    },
    {
        "id": "email-004",
        "from": "priya.kumar@startup.co",
        "to": "me@contextos.ai",
        "subject": "Partnership Proposal - AI Integration",
        "body": "Hi! We're interested in integrating ContextOS AI into our workflow. Could we schedule a call to discuss the technical requirements and pricing? Looking forward to hearing from you.",
        "date": (datetime.utcnow() - timedelta(days=1, hours=3)).isoformat(),
        "labels": ["business", "partnership"],
        "is_read": False,
        "attachments": [],
    },
    {
        "id": "email-005",
        "from": "james.martin@hr.company.com",
        "to": "me@contextos.ai",
        "subject": "Team Building Event - Next Friday",
        "body": "Hi everyone! We're organizing a team building event next Friday at 3 PM. Please confirm your attendance by replying to this email. Activities include laser tag and dinner.",
        "date": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "labels": ["hr", "social"],
        "is_read": True,
        "attachments": [],
    },
    {
        "id": "email-006",
        "from": "security@github.com",
        "to": "me@contextos.ai",
        "subject": "Security Alert: New sign-in from Windows",
        "body": "A new sign-in to your GitHub account was detected from Windows in San Francisco, CA. If this was you, no further action is required.",
        "date": (datetime.utcnow() - timedelta(days=3)).isoformat(),
        "labels": ["security", "github"],
        "is_read": True,
        "attachments": [],
    },
    {
        "id": "email-007",
        "from": "david.lee@research.edu",
        "to": "me@contextos.ai",
        "subject": "Research Paper Collaboration",
        "body": "I'd like to invite you to collaborate on a research paper about AI-powered productivity tools. The deadline for submission is next month. Let me know if you're interested.",
        "date": (datetime.utcnow() - timedelta(days=4)).isoformat(),
        "labels": ["research", "collaboration"],
        "is_read": True,
        "attachments": ["research-proposal.pdf"],
    },
    {
        "id": "email-008",
        "from": "support@cloudhost.com",
        "to": "me@contextos.ai",
        "subject": "Server Maintenance Scheduled",
        "body": "We'll be performing scheduled maintenance on Saturday from 2 AM to 6 AM UTC. Your services may experience brief downtime during this window.",
        "date": (datetime.utcnow() - timedelta(days=5)).isoformat(),
        "labels": ["infrastructure", "maintenance"],
        "is_read": True,
        "attachments": [],
    },
]

MOCK_CALENDAR = [
    {
        "id": "cal-001",
        "title": "Q4 Roadmap Review Meeting",
        "description": "Review Q4 product roadmap with the team. Discuss AI integration timeline, resource allocation, and customer feedback priorities.",
        "start_time": (datetime.utcnow() + timedelta(hours=18)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(hours=19)).isoformat(),
        "location": "Conference Room A / Zoom",
        "attendees": ["sarah.chen@techcorp.com", "alex.wright@designstudio.io", "team@contextos.ai"],
        "recurring": False,
        "reminder_minutes": 30,
    },
    {
        "id": "cal-002",
        "title": "Daily Standup",
        "description": "Quick sync on daily progress, blockers, and priorities.",
        "start_time": (datetime.utcnow() + timedelta(days=1, hours=9)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=1, hours=9, minutes=30)).isoformat(),
        "location": "Slack Huddle",
        "attendees": ["team@contextos.ai"],
        "recurring": True,
        "reminder_minutes": 10,
    },
    {
        "id": "cal-003",
        "title": "Design Review - Dashboard V3",
        "description": "Review the latest dashboard design iterations with the design team.",
        "start_time": (datetime.utcnow() + timedelta(days=1, hours=14)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=1, hours=15)).isoformat(),
        "location": "Figma Meeting Room",
        "attendees": ["alex.wright@designstudio.io"],
        "recurring": False,
        "reminder_minutes": 15,
    },
    {
        "id": "cal-004",
        "title": "AI Agent Planning Session",
        "description": "Deep dive into LangGraph agent orchestration architecture.",
        "start_time": (datetime.utcnow() + timedelta(days=2, hours=10)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=2, hours=12)).isoformat(),
        "location": "Virtual - Google Meet",
        "attendees": ["priya.kumar@startup.co", "me@contextos.ai"],
        "recurring": False,
        "reminder_minutes": 15,
    },
    {
        "id": "cal-005",
        "title": "Sprint Retrospective",
        "description": "Review the last sprint - what went well, what could be improved.",
        "start_time": (datetime.utcnow() + timedelta(days=3, hours=16)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=3, hours=17)).isoformat(),
        "location": "Conference Room B",
        "attendees": ["team@contextos.ai", "manager@company.com"],
        "recurring": True,
        "reminder_minutes": 30,
    },
    {
        "id": "cal-006",
        "title": "Team Building Event",
        "description": "Laser tag and dinner with the team.",
        "start_time": (datetime.utcnow() + timedelta(days=5, hours=15)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=5, hours=20)).isoformat(),
        "location": "Fun Zone Arcade",
        "attendees": ["team@contextos.ai", "james.martin@hr.company.com"],
        "recurring": False,
        "reminder_minutes": 60,
    },
]

MOCK_NOTES = [
    {
        "id": "note-001",
        "title": "Q4 Meeting Preparation Notes",
        "content": """Meeting preparation for Q4 Roadmap Review:

Key Discussion Points:
1. AI Integration Timeline - Need to present updated roadmap for LangGraph integration
2. Resource Allocation - Backend team needs 2 more engineers for Q4
3. Customer Feedback - 87% positive on AI features, top request is better search
4. Revenue Impact - AI features driving 23% increase in user engagement

Action Items from last meeting:
- Finalize AI agent architecture (due: Oct 15)
- Complete ChromaDB integration testing (due: Oct 20)
- Draft Q4 OKRs with team leads (due: Oct 25)

Technical Notes:
- Vector search latency target: <100ms
- Embedding model: text-embedding-3-small
- ChromaDB collections: documents, notes, emails""",
        "tags": ["meeting", "q4", "preparation", "roadmap"],
    },
    {
        "id": "note-002",
        "title": "AI Agent Architecture",
        "content": """ContextOS AI Agent Architecture:

Orchestration: LangGraph StateGraph

Agents:
1. Planner Agent - Main orchestrator, breaks down user queries
2. Mail Agent - Searches and analyzes emails
3. Calendar Agent - Handles scheduling and meeting prep
4. Notes Agent - Semantic search across notes
5. File Agent - Document retrieval and analysis
6. Summary Agent - Generates comprehensive summaries

Flow:
User Query -> Planner Agent -> [Fan-out to relevant agents] -> Summary Agent -> Output

Vector Store: ChromaDB
- Collection: contextos_main
- Embedding: OpenAI text-embedding-3-small
- Chunk size: 500 tokens, 50 overlap

State Management: LangGraph checkpointing with PostgreSQL backend""",
        "tags": ["architecture", "ai", "agents", "technical"],
    },
    {
        "id": "note-003",
        "title": "Project Ideas",
        "content": """Future Feature Ideas for ContextOS:

Priority High:
- Real-time collaboration on AI-generated documents
- Slack/Teams integration for automatic context gathering
- Voice input for hands-free task creation

Priority Medium:
- Calendar optimization suggestions based on productivity patterns
- Email sentiment analysis dashboard
- Automated meeting notes transcription

Priority Low:
- Gamification of productivity metrics
- Social features for team knowledge sharing
- Plugin marketplace for custom agents

Research Topics:
- Multi-modal AI for image/document understanding
- Federated learning for privacy-preserving context
- Graph neural networks for relationship mapping""",
        "tags": ["ideas", "roadmap", "features"],
    },
    {
        "id": "note-004",
        "title": "Deployment Checklist",
        "content": """Production Deployment Checklist:

Infrastructure:
☐ Set up Docker Compose for local development
☐ Configure PostgreSQL with connection pooling
☐ Deploy ChromaDB cluster
☐ Set up Redis for caching (optional)

Security:
☐ JWT secret rotation policy
☐ Rate limiting configuration
☐ CORS policy review
☐ Input validation on all endpoints
☐ SQL injection prevention verified

Monitoring:
☐ Health check endpoints
☐ Error tracking (Sentry or equivalent)
☐ Performance monitoring
☐ Log aggregation setup

Testing:
☐ Unit tests for all services (>80% coverage)
☐ API integration tests
☐ Load testing for search endpoints
☐ Security audit

Documentation:
☐ API documentation (OpenAPI/Swagger)
☐ Architecture diagram
☐ Deployment guide
☐ User guide""",
        "tags": ["deployment", "checklist", "devops"],
    },
    {
        "id": "note-005",
        "title": "Research Paper Notes",
        "content": """Notes for AI Productivity Tools Research Paper:

Related Work:
- Notion AI (2023) - Context-aware writing assistant
- Copilot for Microsoft 365 (2024) - Multi-app orchestration
- Google Gemini Workspace (2024) - Cross-service AI integration

Our Contribution:
- Novel multi-agent architecture using LangGraph
- Vector-based semantic context retrieval across multiple data sources
- Explainable AI outputs with full agent trace visualization

Methodology:
- Quantitative: Task completion time, accuracy metrics
- Qualitative: User satisfaction surveys, expert reviews
- Dataset: 100 mock enterprise scenarios with ground truth

Timeline:
- Literature review: Due Oct 15
- Implementation: Due Oct 30
- User study: Nov 1-15
- Paper draft: Nov 20
- Submission: Dec 1""",
        "tags": ["research", "paper", "academic"],
    },
]

MOCK_FILES = [
    {
        "id": "file-001",
        "name": "q4-roadmap.pdf",
        "type": "application/pdf",
        "size": 245760,
        "content": "Q4 Product Roadmap 2024 - AI Integration Phase. Key milestones: Week 1-2: Core agent framework, Week 3-4: Vector search integration, Week 5-6: UI dashboard, Week 7-8: Testing and polish.",
        "uploaded_at": (datetime.utcnow() - timedelta(days=7)).isoformat(),
    },
    {
        "id": "file-002",
        "name": "meeting-notes-sept.md",
        "type": "text/markdown",
        "size": 8192,
        "content": "# September Meeting Notes\n\n## Week 1\n- Finalized architecture design\n- Started LangGraph prototype\n\n## Week 2\n- ChromaDB integration working\n- Basic agent flow implemented\n\n## Week 3\n- UI mockups approved\n- API endpoints documented\n\n## Week 4\n- Sprint review completed\n- Backlog groomed for Q4",
        "uploaded_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
    },
    {
        "id": "file-003",
        "name": "api-documentation.txt",
        "type": "text/plain",
        "size": 16384,
        "content": "ContextOS AI API Documentation\n\nEndpoints:\nPOST /api/auth/register - Register new user\nPOST /api/auth/login - Login\nGET /api/tasks - List tasks\nPOST /api/tasks - Create task\nPOST /api/search - Semantic search\nPOST /api/agents/execute - Execute agent workflow\nGET /api/chat/sessions - List chat sessions\nPOST /api/chat/sessions - Create chat session",
        "uploaded_at": (datetime.utcnow() - timedelta(days=10)).isoformat(),
    },
    {
        "id": "file-004",
        "name": "architecture-diagram.txt",
        "type": "text/plain",
        "size": 4096,
        "content": "ContextOS Architecture:\n\nFrontend (Next.js) <-> FastAPI Backend <-> PostgreSQL\n                                  |-> ChromaDB (Vector Store)\n                                  |-> OpenAI/Gemini (AI Provider)\n\nAgent Flow:\nUser Query -> Planner -> [Mail, Calendar, Notes, File Agents] -> Summary -> Output",
        "uploaded_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
    },
]


class MockDataService:
    """Service providing mock data for Gmail, Calendar, Notes, and Files."""

    def search_emails(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for email in MOCK_EMAILS:
            score = 0
            if query_lower in email["subject"].lower():
                score += 3
            if query_lower in email["body"].lower():
                score += 2
            if query_lower in email["from"].lower():
                score += 1
            if any(query_lower in label for label in email["labels"]):
                score += 1
            if score > 0:
                results.append({**email, "_score": score})
        results.sort(key=lambda x: x["_score"], reverse=True)
        return results[:limit]

    def search_calendar(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for event in MOCK_CALENDAR:
            score = 0
            if query_lower in event["title"].lower():
                score += 3
            if query_lower in event["description"].lower():
                score += 2
            if any(query_lower in att.lower() for att in event["attendees"]):
                score += 1
            if score > 0:
                results.append({**event, "_score": score})
        results.sort(key=lambda x: x["_score"], reverse=True)
        return results[:limit]

    def search_notes(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for note in MOCK_NOTES:
            score = 0
            if query_lower in note["title"].lower():
                score += 3
            if query_lower in note["content"].lower():
                score += 2
            if any(query_lower in tag for tag in note["tags"]):
                score += 1
            if score > 0:
                results.append({**note, "_score": score})
        results.sort(key=lambda x: x["_score"], reverse=True)
        return results[:limit]

    def search_files(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for file in MOCK_FILES:
            score = 0
            if query_lower in file["name"].lower():
                score += 3
            if query_lower in file["content"].lower():
                score += 2
            if score > 0:
                results.append({**file, "_score": score})
        results.sort(key=lambda x: x["_score"], reverse=True)
        return results[:limit]

    def search_all(self, query: str, limit: int = 10) -> dict[str, list]:
        return {
            "emails": self.search_emails(query, limit),
            "calendar": self.search_calendar(query, limit),
            "notes": self.search_notes(query, limit),
            "files": self.search_files(query, limit),
        }

    def get_upcoming_events(self, hours: int = 24) -> list[dict[str, Any]]:
        now = datetime.utcnow()
        cutoff = now + timedelta(hours=hours)
        events = []
        for event in MOCK_CALENDAR:
            event_time = datetime.fromisoformat(event["start_time"])
            if now <= event_time <= cutoff:
                events.append(event)
        events.sort(key=lambda x: x["start_time"])
        return events

    def get_recent_emails(self, limit: int = 5) -> list[dict[str, Any]]:
        emails = sorted(MOCK_EMAILS, key=lambda x: x["date"], reverse=True)
        return emails[:limit]
