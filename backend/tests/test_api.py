"""API integration tests for ContextOS AI backend."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_token(client: AsyncClient):
    response = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpassword123",
    })
    assert response.status_code == 201
    data = response.json()
    return data["access_token"]


class TestHealthCheck:
    @pytest.mark.anyio
    async def test_health(self, client: AsyncClient):
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestAuth:
    @pytest.mark.anyio
    async def test_register(self, client: AsyncClient):
        response = await client.post("/api/auth/register", json={
            "email": "new@example.com",
            "name": "New User",
            "password": "password123",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "new@example.com"

    @pytest.mark.anyio
    async def test_register_duplicate(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "email": "dup@example.com",
            "name": "Dup User",
            "password": "password123",
        })
        response = await client.post("/api/auth/register", json={
            "email": "dup@example.com",
            "name": "Dup User 2",
            "password": "password123",
        })
        assert response.status_code == 409

    @pytest.mark.anyio
    async def test_login(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "email": "login@example.com",
            "name": "Login User",
            "password": "password123",
        })
        response = await client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "password123",
        })
        assert response.status_code == 200
        assert "access_token" in response.json()

    @pytest.mark.anyio
    async def test_login_wrong_password(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "email": "wrong@example.com",
            "name": "Wrong User",
            "password": "password123",
        })
        response = await client.post("/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    @pytest.mark.anyio
    async def test_get_me(self, client: AsyncClient, auth_token: str):
        response = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
        assert response.json()["email"] == "test@example.com"


class TestTasks:
    @pytest.mark.anyio
    async def test_create_task(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/tasks", json={
            "title": "Test Task",
            "input_query": "Prepare meeting",
            "task_type": "planner",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 201
        assert response.json()["title"] == "Test Task"

    @pytest.mark.anyio
    async def test_list_tasks(self, client: AsyncClient, auth_token: str):
        await client.post("/api/tasks", json={
            "title": "Task 1",
            "input_query": "query 1",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        response = await client.get("/api/tasks", headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
        assert response.json()["total"] >= 1

    @pytest.mark.anyio
    async def test_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/tasks")
        assert response.status_code in (401, 403)


class TestSearch:
    @pytest.mark.anyio
    async def test_search(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/search", json={
            "query": "meeting",
            "search_type": "all",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
        assert "results" in response.json()

    @pytest.mark.anyio
    async def test_search_specific_type(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/search", json={
            "query": "roadmap",
            "search_type": "email",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200


class TestAgents:
    @pytest.mark.anyio
    async def test_agent_status(self, client: AsyncClient):
        response = await client.get("/api/agents/status")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "operational"
        assert len(data["agents"]) == 6

    @pytest.mark.anyio
    async def test_execute_agent(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/agents/execute", json={
            "query": "Prepare tomorrow's meeting",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
        data = response.json()
        assert "meeting_summary" in data
        assert "agenda" in data
        assert "action_items" in data
        assert "email_draft" in data
        assert "ppt_outline" in data


class TestNotes:
    @pytest.mark.anyio
    async def test_create_note(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/notes", json={
            "title": "Test Note",
            "content": "Test content here",
            "tags": ["test"],
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 201

    @pytest.mark.anyio
    async def test_list_notes(self, client: AsyncClient, auth_token: str):
        response = await client.get("/api/notes", headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200


class TestChat:
    @pytest.mark.anyio
    async def test_create_session(self, client: AsyncClient, auth_token: str):
        response = await client.post("/api/chat/sessions", json={
            "title": "Test Chat",
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 201

    @pytest.mark.anyio
    async def test_list_sessions(self, client: AsyncClient, auth_token: str):
        response = await client.get("/api/chat/sessions", headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
