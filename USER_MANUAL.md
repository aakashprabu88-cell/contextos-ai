# ContextOS AI — User Manual

**Version 1.0.0**

An AI-powered productivity operating layer that coordinates information across emails, calendar, notes, and documents using a multi-agent orchestration system.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Dashboard](#3-dashboard)
4. [AI Chat](#4-ai-chat)
5. [Smart Search](#5-smart-search)
6. [Tasks](#6-tasks)
7. [Documents](#7-documents)
8. [Settings](#8-settings)
9. [Navigation](#9-navigation)
10. [Tips & Tricks](#10-tips--tricks)
11. [Troubleshooting](#11-troubleshooting)
12. [API Reference](#12-api-reference)

---

## 1. Overview

ContextOS AI is a full-stack application that acts as an intelligent productivity layer on top of your work data. It orchestrates multiple AI agents — Planner, Mail, Calendar, Notes, Files, and Summary — via LangGraph to search, synthesize, and act on information from across your digital workspace.

**Key capabilities:**
- **AI Chat** — Conversational interface with context-aware responses
- **Smart Search** — Semantic search across emails, calendar events, notes, and files
- **AI Tasks** — Execute multi-agent workflows that research and summarize topics
- **Document Management** — Upload and manage reference files for AI context
- **Activity Timeline** — Track all actions and agent executions

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL 16 (asyncpg + SQLAlchemy) |
| Vector DB | ChromaDB (semantic search) |
| AI Orchestration | LangGraph (StateGraph) |
| AI Provider | OpenAI / Google Gemini (configurable) |
| Authentication | JWT (bcrypt + python-jose) |

---

## 2. Getting Started

### Sign Up

1. Navigate to the application URL (default: `http://localhost:3000`)
2. Click **Sign up** on the login page
3. Enter your **Full Name**, **Email**, and **Password** (minimum 6 characters)
4. Click **Create Account**
5. You will be automatically redirected to the Dashboard

> **Demo note:** During MVP, any email/password combination can be used to register.

### Log In

1. Click **Sign in** on the welcome page
2. Enter your **Email** and **Password**
3. Click **Sign In**
4. You will be redirected to the Dashboard

### Log Out

- Click the logout icon (arrow) in the bottom-left corner of the sidebar

---

## 3. Dashboard

The Dashboard is your central hub. It loads automatically after sign-in and shows a summary of your entire workspace.

### Stats Cards

Four cards at the top display quick metrics:

| Card | Description |
|------|-------------|
| **Total Tasks** | Number of AI tasks created |
| **Completed** | Tasks successfully executed |
| **Active** | Tasks currently running |
| **Failed** | Tasks that encountered errors |
| **Documents** | Uploaded files |
| **Notes** | Created notes |
| **Searches** | Number of searches performed |

### Quick Actions

A row of shortcut buttons for common workflows:
- **New Chat** — Opens the AI Chat page
- **New Task** — Opens the task creation form on the Tasks page
- **Upload Document** — Opens the Documents page for file upload
- **Search** — Opens the Search page

### Recent Tasks

Shows the most recently created tasks with their status indicators. Click any task to navigate to the Tasks page for full details.

### Activity Timeline

A chronological feed of all activity in the system, including:
- Task created / completed / failed events
- Search executions
- Document uploads
- Agent executions

Each entry shows the activity type, title, and timestamp.

### AI Status

A panel showing the current status of the AI agent system, including each agent's operational state.

---

## 4. AI Chat

The AI Chat provides a conversational interface to interact with ContextOS AI. It maintains session history and can answer questions by searching across your connected data sources.

### Creating a Chat Session

1. Navigate to **AI Chat** from the sidebar
2. Click **New Chat** button in the sessions panel (left side)
3. A new session is created automatically

### Sending Messages

- Type your message in the input bar at the bottom of the chat area
- Press **Enter** or click the send button to submit
- The AI processes your message and returns a response with context from your data

### Suggested Prompts

When no messages exist in a session, suggested prompts are displayed to help you get started. Click any prompt to send it immediately:

- "Summarize my emails from this week"
- "What meetings do I have today?"
- "Find documents about project planning"
- "Create a task to prepare for Q4 review"

### Session Management

- **Switch sessions** — Click any session in the left panel
- **Delete a session** — Hover over a session and click the trash icon
- **Session titles** — Sessions are automatically titled based on the conversation content

### Message Types

- **User messages** — Shown aligned right with your avatar
- **Assistant messages** — Shown aligned left with the AI bot icon
- **System messages** — Reserved for system notifications
- **Loading indicator** — An animated bouncing dots indicator appears while the AI is generating a response

### What the AI Can Do

The AI assistant leverages the LangGraph agent pipeline to:
- Search and summarize emails
- Look up calendar events and meetings
- Retrieve notes with semantic search
- Access uploaded documents
- Generate meeting summaries, agendas, action items, and email drafts

---

## 5. Smart Search

The Search page uses semantic (vector) search to find relevant information across all connected data sources.

### Performing a Search

1. Navigate to **Search** from the sidebar
2. Enter your query in the search bar (e.g., "project timeline updates")
3. Press **Enter** or click **Search**
4. Results are displayed ranked by relevance score

### Filtering Results

Use the filter buttons below the search bar to narrow results:

| Filter | Sources Searched |
|--------|-----------------|
| All Sources | Emails, calendar, notes, files |
| Emails | Mock email messages only |
| Calendar | Calendar events only |
| Notes | User notes only |
| Files | Uploaded documents only |

### Understanding Results

Each result card shows:
- **Title** — Name of the matched item
- **Source badge** — Which data source it came from (Email, Calendar, Notes, Files)
- **Match percentage** — Semantic relevance score (0–100%)
- **Content preview** — Truncated text excerpt with the matching context
- **Metadata** — Additional properties when available

### URL Query Parameter

You can pass search queries via URL: `/search?q=your+query`. This allows linking to search results from other pages.

---

## 6. Tasks

Tasks are the core of ContextOS AI's agentic workflow system. Each task runs a multi-agent LangGraph pipeline that collects and synthesizes information.

### Creating a Task

1. Navigate to **Tasks** from the sidebar
2. Click **New Task**
3. Fill in the form:
   - **Task Title** — A descriptive name (e.g., "Prepare Q4 Review")
   - **AI Query** — The research question or instruction for the AI agents
4. Click **Create Task**

**Example queries:**
- "Prepare tomorrow's meeting by searching emails, calendar, and notes"
- "Research project X and summarize recent communications"
- "Find all documents related to the Q3 quarterly report"

### Executing a Task

1. Find your task in the list (status will show as "pending")
2. Click the **Execute** button on the task card
3. The agent pipeline runs sequentially through:
   - **Planner Agent** — Analyzes the query and determines routing
   - **Mail Agent** — Searches emails for relevant information
   - **Calendar Agent** — Looks up calendar events
   - **Notes Agent** — Performs semantic search on notes
   - **File Agent** — Searches uploaded documents
   - **Summary Agent** — Generates structured output
4. The task status updates to "running" during execution and "completed" when done

### Viewing Results

Click a task card to expand it and view full results:

**Result sections:**
- **Meeting Summary** — A synthesized narrative of findings
- **Agenda** — Structured agenda points derived from the research
- **Action Items** — Specific actionable tasks extracted
- **Questions** — Open questions identified during analysis
- **Email Draft** — A pre-written email summarizing the findings
- **PowerPoint Outline** — Slide-by-slide presentation outline

### Agent Trace

Each completed task includes a full agent trace for explainability. The trace shows:
- Which agent was invoked at each step
- What action each agent performed
- Timestamps for each agent's execution

Click the expanded task card to view the trace steps under the **Agent Trace** section.

### Task Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| Pending | Clock | Task created, not yet executed |
| Running | Spinner | Agents are currently processing |
| Completed | Green check | Pipeline finished successfully |
| Failed | Red X | Pipeline encountered an error |

### Managing Tasks

- **Delete** — Click the trash icon on any task to remove it
- **Re-execute** — Create a new task with the same query for fresh results
- **Error handling** — Failed tasks show the error message in an expanded view

---

## 7. Documents

Upload reference files to give the AI agents additional context about your projects and work.

### Supported Formats

| Format | Extension |
|--------|-----------|
| Plain Text | `.txt` |
| Markdown | `.md` |
| PDF | `.pdf` |
| JSON | `.json` |
| CSV | `.csv` |
| Word Document | `.doc`, `.docx` |

### Uploading Files

1. Navigate to **Documents** from the sidebar
2. You can upload in two ways:
   - **Click the upload area** to open the file browser
   - **Drag and drop** files onto the upload area
3. Select one or more files (multi-upload supported)
4. Files upload sequentially and appear in the document grid

### Managing Documents

Each document card displays:
- **File icon** — Color-coded by type (PDF = red, Image = purple, Text = blue, Code = green)
- **Filename** — Original file name
- **File type badge** — Extension indicator (e.g., `pdf`, `txt`)
- **File size** — Human-readable size (KB/MB)
- **Upload date** — Relative timestamp ("5m ago", "2d ago")

To delete a document, click the trash icon on its card.

---

## 8. Settings

Manage your profile and view system information.

### Profile

- **Name** — Edit your display name and click **Save Changes**
- **Email** — View your registered email (read-only)

### AI Configuration

View the status of each AI agent in the LangGraph pipeline:

| Agent | Model | Status |
|-------|-------|--------|
| Planner Agent | GPT-4o / Gemini Pro | Active |
| Mail Agent | GPT-4o Mini | Active |
| Calendar Agent | GPT-4o Mini | Active |
| Notes Agent | GPT-4o Mini | Active |
| File Agent | GPT-4o Mini | Active |
| Summary Agent | GPT-4o / Gemini Pro | Active |

### Vector Store

Displays the status of database connections:
- **ChromaDB** — Semantic vector search engine (status: Connected)
- **PostgreSQL** — Primary relational database (status: Connected)

### Appearance

- **Theme toggle** — Switch between dark and light mode using the sun/moon icon in the header bar

---

## 9. Navigation

### Sidebar Guide

The sidebar provides primary navigation with the following links:

| Icon | Page | Description |
|------|------|-------------|
| LayoutDashboard | Dashboard | Main overview with stats and timeline |
| MessageSquare | AI Chat | Conversational AI assistant |
| Search | Search | Semantic search across data sources |
| ListTodo | Tasks | AI agent task management |
| FileText | Documents | File upload and management |
| Settings | Settings | Profile and system configuration |

**Sidebar features:**
- **Collapse/Expand** — Click the arrow button at the top of the sidebar to collapse it to icons only (saves screen space)
- **User section** — Bottom of the sidebar shows your avatar, name, email, and logout button
- **Collapsed mode** — Hover over icon-only items to see tooltips with the page name

### Header Bar

Each page displays a header with:
- **Page title** — Current section name
- **Subtitle** — Brief description of the section's purpose
- **Theme toggle** — Switch between dark and light mode

### Responsive Design

The application uses a responsive grid layout that adapts to screen sizes:
- **Desktop (lg+)** — Multi-column layouts, full sidebar
- **Tablet (md)** — Two-column grids where applicable
- **Mobile** — Single-column layouts with adjusted spacing

---

## 10. Tips & Tricks

### Power User Features

- **Collapse the sidebar** for more content area when working on a single task
- **Use URL search queries** — Bookmark `/search?q=your+term` to save common searches
- **Batch upload documents** before running tasks to provide maximum context to agents
- **Reuse successful queries** — When a task yields great results, note the query for future use

### Best Practices

- **Be specific in task queries** — The more detailed your AI Query, the better the agents can target their search. Instead of "prepare meeting," try "prepare the quarterly review with timeline updates, budget notes, and team feedback."
- **Run tasks before meetings** — Execute a task 5-10 minutes before a meeting to get a synthesized briefing from emails, calendar, and notes.
- **Review agent traces** — When results are unexpected, expand the task and check the Agent Trace to understand what each agent did and what it found.
- **Use suggested prompts** in AI Chat to discover the types of queries the system handles well.
- **Upload key documents** that the AI should reference — meeting notes, project plans, and requirements documents provide the richest context.

### Workflow Ideas

| Goal | How |
|------|-----|
| Morning briefing | AI Chat: "Summarize what happened yesterday and today's meetings" |
| Meeting prep | Task: "Research the weekly sync — find relevant emails, past notes, and calendar context" |
| Project catch-up | Task: "Get me up to speed on Project Omega from all sources" |
| Document Q&A | AI Chat after uploading a PDF: "What are the key requirements in the uploaded spec?" |

---

## 11. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Login fails | Wrong credentials or server not running | Check backend is running on `http://localhost:8000`. Use the sign-up flow to create a new account. |
| Chat returns an error | Backend AI service unavailable | Ensure the backend is running. If using real AI, verify your API key in `.env`. |
| Search returns no results | Query too specific or no data indexed | Try broader terms. For MVP, ensure mock data is seeded. |
| Task execution stuck on "running" | Agent pipeline timeout | Refresh the page. If still stuck, delete and recreate the task. |
| Document upload fails | File format not supported | Check the supported formats list. Files over 10 MB may take longer. |
| "Some data failed to load" on Dashboard | One or more API endpoints unreachable | Verify PostgreSQL and ChromaDB are running. |

### Server Not Running

If you cannot connect:
1. Verify Docker containers are running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Ensure frontend build completed: `npm run build` in the `frontend/` directory

### Slow Performance

- Task execution involves multiple AI agent calls — allow up to 30-60 seconds for completion
- Large document uploads may take a few seconds per file
- Initial page load fetches data from multiple endpoints simultaneously

---

## 12. API Reference

The backend exposes a REST API at `http://localhost:8000/api/`. Interactive documentation is available at `http://localhost:8000/docs`.

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive JWT | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/me` | Update user profile | Yes |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/{id}` | Get a single task with results |
| POST | `/api/tasks/{id}/execute` | Execute the AI agent workflow |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/{id}` | Get a note |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List all documents |
| POST | `/api/documents/upload` | Upload a document (multipart/form-data) |
| GET | `/api/documents/{id}` | Get document metadata |
| DELETE | `/api/documents/{id}` | Delete a document |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Perform semantic search (`?source=all` filter optional) |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/sessions` | List all chat sessions |
| POST | `/api/chat/sessions` | Create a new session |
| GET | `/api/chat/sessions/{id}` | Get session with messages |
| POST | `/api/chat/sessions/{id}/messages` | Send a message in a session |
| DELETE | `/api/chat/sessions/{id}` | Delete a session |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agents/execute` | Execute the full agent workflow |
| GET | `/api/agents/status` | Get agent system status |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | List activity timeline entries |

### Agent Workflow Pipeline

The LangGraph pipeline executes in sequence:

```
User Query
    |
    v
Planner Agent  -- Analyzes query, determines routing
    |
    v
Mail Agent  -- Searches emails
    |
    v
Calendar Agent  -- Searches calendar events
    |
    v
Notes Agent  -- Semantic search on notes
    |
    v
File Agent  -- Searches uploaded documents
    |
    v
Summary Agent  -- Generates structured output:
                   Meeting Summary, Agenda, Action Items,
                   Questions, Email Draft, PowerPoint Outline
```

---

*For developer setup instructions, environment variables, and deployment, refer to the project README.*
