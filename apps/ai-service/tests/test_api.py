import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


class TestHealthEndpoint:
    async def test_health_returns_ok(self, client):
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "ai_engine"
        assert "dependencies" in data

    async def test_health_has_dependency_info(self, client):
        response = await client.get("/api/v1/health")
        data = response.json()
        deps = data["dependencies"]
        assert "llm" in deps
        assert "ml" in deps

    async def test_has_security_headers(self, client):
        response = await client.get("/api/v1/health")
        assert "x-content-type-options" in response.headers
        assert response.headers["x-content-type-options"] == "nosniff"
        assert "x-frame-options" in response.headers
        assert "strict-transport-security" in response.headers

    async def test_has_correlation_id(self, client):
        response = await client.get("/api/v1/health", headers={"X-Request-ID": "test-123"})
        assert response.headers.get("x-request-id") == "test-123"

    async def test_process_time_header(self, client):
        response = await client.get("/api/v1/health")
        assert "x-process-time-ms" in response.headers


class TestStudentInsightEndpoint:
    async def test_valid_student_insight(self, client, student_request):
        payload = student_request.model_dump()
        response = await client.post("/api/v1/insights/student", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Student Performance Analysis"
        assert "confidenceScore" in data
        assert "data" in data

    async def test_insight_has_ml_analysis(self, client, student_request):
        payload = student_request.model_dump()
        response = await client.post("/api/v1/insights/student", json=payload)
        data = response.json()
        assert "ml_analysis" in data["data"]

    async def test_invalid_request_returns_422(self, client):
        response = await client.post("/api/v1/insights/student", json={})
        assert response.status_code == 422


class TestClassInsightEndpoint:
    async def test_valid_class_insight(self, client):
        payload = {
            "type": "CLASS",
            "context": {
                "id": "c1",
                "name": "Grade 5",
                "level": "5",
                "stream": "East",
                "studentCount": 30,
                "subjectCount": 8,
            },
        }
        response = await client.post("/api/v1/insights/class", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Class Performance Overview"


class TestSubjectInsightEndpoint:
    async def test_valid_subject_insight(self, client):
        payload = {
            "type": "SUBJECT",
            "context": {"id": "sub1", "name": "Math", "assessments": []},
        }
        response = await client.post("/api/v1/insights/subject", json=payload)
        assert response.status_code == 200


class TestRefreshEndpoint:
    async def test_refresh_insight(self, client):
        payload = {"type": "STUDENT", "context": {"some": "data"}}
        response = await client.post("/api/v1/insights/refresh", json=payload)
        assert response.status_code == 200
        assert response.json()["title"] == "Refreshed Insight"


class TestBulkEndpoint:
    async def test_bulk_insight(self, client):
        payload = {
            "schoolId": "sch1",
            "studentIds": ["s1", "s2"],
            "classIds": ["c1"],
        }
        response = await client.post("/api/v1/insights/bulk", json=payload)
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["total"] == 3

    async def test_bulk_no_ids_fails(self, client):
        payload = {"schoolId": "sch1"}
        response = await client.post("/api/v1/insights/bulk", json=payload)
        assert response.status_code == 422


