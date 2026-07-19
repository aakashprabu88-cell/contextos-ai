# ContextOS AI

> AI-powered productivity operating layer that coordinates information across multiple sources.

ContextOS AI is a full-stack application that uses multiple AI agents orchestrated via LangGraph to search, synthesize, and act on information from emails, calendar, notes, and documents. For the MVP, all services use rich mock data.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                  │
│  ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌─────────┐  │
│  │Dashboard │ │ Chat │ │ Search │ │Tasks │ │  Docs   │  │
│  └──────────┘ └──────┘ └────────┘ └──────┘ └─────────┘  │
│              Glassmorphism UI • Dark/Light Mode           │
└───────────────────────┬──────────────────────────────────┘
                        │ REST API
┌───────────────────────┴──────────────────────────────────┐
│                   Backend (FastAPI)                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Auth  │ │Tasks │ │Notes │ │ Docs │ │Search│ │ Chat │  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           LangGraph Agent Orchestration              │  │
│  │  Planner → Mail → Calendar → Notes → Files → Summary │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────┬──────────────────┬────────────────────────────┘
           │                  │
    ┌──────┴──────┐    ┌──────┴──────┐
    │ PostgreSQL  │    │  ChromaDB   │
    │ (Relational)│    │  (Vectors)  │
    └─────────────┘    └─────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL 16 (asyncpg + SQLAlchemy) |
| Vector DB | ChromaDB |
| AI Orchestration | LangGraph (StateGraph) |
| AI Provider | OpenAI / Gemini (configurable) |
| Auth | Custom JWT (bcrypt + python-jose) |
| Deployment | Docker Compose |

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Python 3.12+ (for local dev)
- Node.js 20+ (for local dev)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repo-url>
cd contextos-ai

# Copy environment file
cp .env.example .env

# Edit .env with your API keys (optional for MVP - mock data is used)
# Set OPENAI_API_KEY or GEMINI_API_KEY if you want real AI responses

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Database:**

```bash
# Start PostgreSQL and ChromaDB via Docker
docker-compose up postgres chromadb
```

## Project Structure

```
contextos-ai/
├── docker-compose.yml          # Multi-service orchestration
├── .env.example                # Environment template
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── config.py           # Pydantic settings
│   │   ├── database.py         # Async SQLAlchemy
│   │   ├── models/             # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── note.py
│   │   │   ├── document.py
│   │   │   ├── activity.py
│   │   │   └── chat.py
│   │   ├── schemas/            # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── note.py
│   │   │   ├── document.py
│   │   │   ├── activity.py
│   │   │   ├── chat.py
│   │   │   └── search.py
│   │   ├── api/                # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   │   ├── notes.py
│   │   │   ├── documents.py
│   │   │   ├── search.py
│   │   │   ├── chat.py
│   │   │   ├── agents.py
│   │   │   └── activities.py
│   │   ├── services/           # Business logic
│   │   │   ├── user_service.py
│   │   │   ├── task_service.py
│   │   │   ├── note_service.py
│   │   │   ├── document_service.py
│   │   │   ├── activity_service.py
│   │   │   ├── chat_service.py
│   │   │   ├── mock_data.py    # Mock Gmail/Calendar/Notes/Files
│   │   │   └── vector_service.py
│   │   ├── agents/             # LangGraph AI agents
│   │   │   ├── base.py         # Shared state & utilities
│   │   │   ├── planner_agent.py
│   │   │   ├── mail_agent.py
│   │   │   ├── calendar_agent.py
│   │   │   ├── notes_agent.py
│   │   │   ├── file_agent.py
│   │   │   ├── summary_agent.py
│   │   │   └── workflow.py     # LangGraph StateGraph
│   │   └── utils/
│   │       └── security.py     # JWT + bcrypt
│   └── tests/
│       ├── conftest.py
│       ├── test_agents.py
│       └── test_api.py
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── (auth)/
        │   │   ├── login/page.tsx
        │   │   └── signup/page.tsx
        │   └── (dashboard)/
        │       ├── dashboard/page.tsx
        │       ├── chat/page.tsx
        │       ├── search/page.tsx
        │       ├── tasks/page.tsx
        │       ├── documents/page.tsx
        │       └── settings/page.tsx
        ├── components/
        │   ├── ui/              # Reusable primitives
        │   ├── layout/          # Sidebar, header, layout
        │   ├── dashboard/       # Dashboard widgets
        │   └── chat/            # Chat components
        ├── hooks/
        │   ├── useAuth.ts       # Auth context + provider
        │   └── useApi.ts        # Typed API wrapper
        ├── lib/
        │   ├── api.ts           # API client
        │   └── utils.ts         # Utility functions
        ├── types/
        │   └── index.ts         # TypeScript types
        └── styles/
            └── globals.css      # Tailwind + glassmorphism
```

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| POST | `/api/tasks/:id/execute` | Execute AI workflow |
| DELETE | `/api/tasks/:id` | Delete task |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Get note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List documents |
| POST | `/api/documents/upload` | Upload document |
| GET | `/api/documents/:id` | Get document |
| DELETE | `/api/documents/:id` | Delete document |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Semantic search |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/sessions` | List sessions |
| POST | `/api/chat/sessions` | Create session |
| GET | `/api/chat/sessions/:id` | Get session with messages |
| POST | `/api/chat/sessions/:id/messages` | Send message |
| DELETE | `/api/chat/sessions/:id` | Delete session |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agents/execute` | Execute agent workflow |
| GET | `/api/agents/status` | Get agent status |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | List activity timeline |

## AI Agent Workflow

The LangGraph workflow executes as a linear pipeline:

```
User Query
    │
    ▼
┌──────────────┐
│ Planner Agent │  Analyzes query, determines routing
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Mail Agent  │  Searches mock emails
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Calendar Agent   │  Searches mock calendar
└──────┬───────────┘
       │
       ▼
┌──────────────┐
│ Notes Agent  │  Semantic search on notes
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  File Agent  │  Searches mock files
└──────┬───────┘
       │
       ▼
┌───────────────┐
│ Summary Agent │  Generates all outputs
└───────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Output:                                 │
│  • Meeting Summary                      │
│  • Agenda                               │
│  • Action Items                         │
│  • Questions                            │
│  • Email Draft                          │
│  • PowerPoint Outline                   │
│  • Full Agent Trace (explainability)    │
└─────────────────────────────────────────┘
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts with hashed passwords |
| `tasks` | AI task records with results and traces |
| `notes` | User notes with tags |
| `documents` | Uploaded file metadata |
| `activities` | Activity timeline events |
| `chat_sessions` | Chat conversation sessions |
| `chat_messages` | Individual chat messages |

## Testing

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_agents.py -v
pytest tests/test_api.py -v
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection |
| `CHROMA_HOST` | `localhost` | ChromaDB host |
| `CHROMA_PORT` | `8001` | ChromaDB port |
| `AI_PROVIDER` | `openai` | AI provider (openai/gemini) |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `GEMINI_API_KEY` | - | Google Gemini API key |
| `JWT_SECRET` | - | JWT signing secret |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins |

## Deployment

### Docker Compose (Recommended)

```bash
docker-compose up -d --build
```

### Manual Deployment

1. Deploy PostgreSQL and ChromaDB
2. Set environment variables
3. Run backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Build frontend: `npm run build && npm start`

## License

MIT
