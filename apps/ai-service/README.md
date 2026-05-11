# ElimuSight AI Service

The **ElimuSight AI Service** is the intelligence layer of the ElimuSight platform. It provides data-driven student performance analysis, risk assessment, ML-powered trend prediction, and LLM-generated educational insights.

## System Architecture

```
Node.js API (Express/Primsa)  →  AI Service (FastAPI)
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼            ▼
                     Rule Engine   ML Service    LLM Service
                     (always)    (statistical)  (OpenAI/gated)
                          │            │            │
                          └────────────┴────────────┘
                                       │
                                  Insight Response
                                       │
                              Node.js persists to DB
```

### 3-Layer Intelligence System

1. **Rule Engine** — Deterministic analysis based on academic thresholds. Always runs.
   - Risk scoring (HIGH_RISK, AT_RISK, ON_TRACK)
   - Performance averaging and flagging (LOW_DATA, NO_GUARDIAN_CONTACT)
   - Multi-persona insight generation (teacher, parent, student)

2. **ML Service** — Statistical trend analysis using linear regression.
   - Performance direction prediction (improving/declining/stable)
   - Risk projection based on score trajectory
   - Volatility and consistency metrics

3. **LLM Service** — OpenAI-powered natural language insights (feature-gated).
   - Persona-aware prompt templates
   - Structured JSON output with validation
   - Retry with exponential backoff + circuit breaker
   - Token usage tracking and daily budget management

## Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **AI/ML**: OpenAI SDK, scikit-learn-style linear regression
- **Validation**: Pydantic v2 with strict mode
- **Server**: Uvicorn (production: multi-worker)
- **Observability**: Structured JSON logging, Sentry, Prometheus metrics
- **Infrastructure**: Dockerized (multi-stage), K8s-ready

## Quick Start

### Prerequisites

- Python 3.10+
- OpenAI API Key (for LLM features)

### Local Setup

```bash
cd apps/ai-service

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000/api/v1`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check with dependency status |
| `GET` | `/api/v1/metrics` | Prometheus metrics |
| `POST` | `/api/v1/analyze` | **Deprecated** — use `/insights/student` |
| `POST` | `/api/v1/insights/student` | Analyze individual student performance |
| `POST` | `/api/v1/insights/class` | Analyze class-level performance |
| `POST` | `/api/v1/insights/subject` | Analyze subject-level performance |
| `POST` | `/api/v1/insights/refresh` | Refresh an existing insight |
| `POST` | `/api/v1/insights/bulk` | Queue bulk insight generation |

### Response Format

All insight endpoints return a consistent response:

```json
{
  "title": "Student Performance Analysis",
  "summary": "John is performing at 80.0% average. Risk level: low.",
  "data": {
    "student_id": "...",
    "average": 80.0,
    "risk_score": 0.1,
    "flags": [],
    "insight": {
      "teacher": "...",
      "parent": "...",
      "student": "..."
    },
    "trend_direction": "improving",
    "ml_analysis": {
      "current_average": 80.0,
      "projected_average": 85.0,
      "projected_risk": "low",
      "trend": "improving",
      "needs_intervention": false
    }
  },
  "confidenceScore": 95.0
}
```

## Project Structure

```
apps/ai-service/
├── app/
│   ├── api/
│   │   └── routes.py          # API endpoint definitions
│   ├── core/
│   │   ├── config.py          # Pydantic Settings with env validation
│   │   ├── logging.py         # Structured JSON logging
│   │   └── security.py        # Rate limiting, security headers
│   ├── schemas/
│   │   ├── ai.py              # Insight request/response models
│   │   └── student.py         # Student and assessment schemas
│   ├── services/
│   │   ├── ai_engine.py       # Core analysis pipeline
│   │   ├── cache.py           # TTL-based LRU cache
│   │   ├── llm_service.py     # OpenAI integration with circuit breaker
│   │   ├── ml_service.py      # Trend analysis and risk projection
│   │   └── prompts.py         # LLM prompt templates
│   └── utils/
│       ├── helper.py          # Utility functions
│       ├── http.py            # Retry decorator, circuit breaker
│       └── sanitize.py        # Input sanitization, injection detection
├── tests/
│   ├── conftest.py            # Test fixtures
│   ├── test_ai_engine.py      # Rule engine unit tests
│   ├── test_api.py            # API integration tests
│   ├── test_ml_service.py     # ML service unit tests
│   └── test_schemas.py        # Schema validation tests
├── Dockerfile                 # Multi-stage production build
├── requirements.txt
└── .env.example
```

## Configuration

All configuration is via environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | OpenAI API key (LLM features) |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model name |
| `ENABLE_LLM` | `true` | Feature flag for LLM |
| `ENABLE_ML` | `true` | Feature flag for ML |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Allowed CORS origins |
| `RATE_LIMIT_PER_MINUTE` | `30` | Requests per minute per IP |
| `SENTRY_DSN` | — | Sentry error tracking DSN |
| `MAX_DAILY_TOKENS` | `1000000` | Daily LLM token budget |
| `MAX_DAILY_COST_USD` | `5.0` | Daily LLM cost budget |

## Docker

```bash
# Build
docker build -t elimu-sight-ai .

# Run
docker run -p 8000:8000 --env-file .env elimu-sight-ai

# Or use root docker-compose
docker-compose up ai-service
```

## Testing

```bash
pytest tests/ -v
```

## Resilience Features

- **Circuit Breaker**: Prevents cascading failures to OpenAI (5 failures → 30s cooldown)
- **Retry with Backoff**: Exponential backoff + jitter for transient failures
- **Fallback Strategy**: LLM failure → rule engine fallback with feature flag
- **Budget Controls**: Daily token and cost limits prevent cost spikes
- **Rate Limiting**: Per-IP sliding window rate limiter

## Security

- Rate limiting on all endpoints (except health check)
- Security headers: HSTS, X-Frame-Options, XSS Protection, Referrer-Policy
- CORS with configurable allowed origins
- Prompt injection detection patterns
- Input sanitization (HTML tag stripping, length limits)
- Request body size limits
- Non-root user in Docker container

## Integration with Node.js API

The AI service is designed to be consumed by the Node.js API at `apps/api/`. The Node.js `AIService` class orchestrates:

1. Fetches student/class/subject data from PostgreSQL via Prisma
2. Sends structured payloads `{type, context}` to the Python AI Service
3. Validates AI response with Joi schema
4. Uses circuit breaker + exponential backoff for resilience
5. Persists generated insights to the database

---

Part of the ElimuSight Ecosystem.
