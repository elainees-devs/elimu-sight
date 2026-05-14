# ElimuSight API

> AI-Powered School Intelligence Platform Backend

---

## 🧠 Overview

ElimuSight API is the backend service powering the ElimuSight platform — an AI-driven school intelligence system focused on transforming raw school data into actionable intelligence.

The platform helps schools:

- Analyze student performance
- Detect learning gaps
- Generate AI-powered insights
- Improve CBC tracking
- Support teacher interventions
- Build data-driven learning environments

---

## 🌍 Vision

Many schools collect large amounts of academic data but lack systems that transform that data into actionable intelligence.

ElimuSight bridges that gap by combining educational analytics with AI-powered insights to help teachers, schools, and administrators make smarter academic decisions.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe backend development |
| Node.js | Runtime environment |
| Express.js | API framework |
| PostgreSQL | Primary database |
| Prisma ORM | Database access |
| JWT | Authentication |
| Joi | Validation |
| Winston | Logging |
| Morgan | HTTP request logging |
| OpenAI API | AI-generated insights |

---

## 🏗️ System Design

[View System Design Analysis](docs/system_design.md)

---

## 📁 Project Structure

```bash
apps/api/
│
├── prisma/                     # Database schema & migrations
│
├── src/
│   │
│   ├── ai/                     # AI services
│   │   └── ai.service.ts
│   │
│   ├── config/                 # Application configuration
│   │
│   ├── controllers/            # Request handlers
│   │
│   ├── mappers/                # DTO transformation layer
│   │
│   ├── middlewares/            # Express middlewares
│   │
│   ├── routes/                 # API routes
│   │
│   ├── schemas/                # Joi validation schemas
│   │
│   ├── services/               # Business logic layer
│   │   ├── assessment.service.ts
│   │   ├── auth.service.ts
│   │   ├── class-subject.service.ts
│   │   ├── class.service.ts
│   │   ├── insight.service.ts
│   │   ├── school.service.ts
│   │   ├── student.service.ts
│   │   ├── subject.service.ts
│   │   ├── user.service.ts
│   │   └── index.ts
│   │
│   ├── tests/                  # Tests
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/                  # Shared utilities
│   │   ├── analytics.ts
│   │   ├── app-error.ts
│   │   ├── constants.ts
│   │   ├── hash.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   ├── prisma.ts
│   │   ├── response.ts
│   │   └── index.ts
│   │
│   ├── app.ts
│   │
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🧠 Architecture Style

ElimuSight follows a:

- Layered Modular Monolith Architecture
- Service-Layer Pattern
- DTO / Mapper Pattern
- Middleware Pipeline Pattern

The system is designed for scalability, maintainability, and future AI-driven educational analytics.

---

## 🗄️ Database Design

ElimuSight uses a relational database built with:

- PostgreSQL
- Prisma ORM

The database is designed for:

- Multi-school management
- CBC assessment tracking
- AI-powered insights
- Fast querying
- Future scalability

---

## 🧠 Design Approach

The database follows a:

> Multi-Tenant SaaS Architecture

Each school is isolated using:

```txt
school_id
```

This ensures secure school-level data separation.

---

## 🧩 Core Tables

| Table | Purpose |
|---|---|
| schools | Stores school information |
| users | Stores system users |
| teachers | Teacher profiles |
| classes | Academic classes |
| students | Student records |
| subjects | School subjects |
| class_subjects | Links classes and subjects |
| assessments | Student marks and grades |
| insights | AI-generated insights |
| ai_logs | AI request and response logs |
| refresh_tokens | JWT refresh token rotation |

---

## ⚡ Performance Optimization

The database is optimized using indexes.

### Indexed Fields

- school_id
- student_id
- class_id
- subject_id
- email

### Benefits

- Faster filtering
- Better dashboard performance
- Improved analytics queries

---

## 🧠 UUID IDs

All tables use UUIDs.

### Benefits

- Better scalability
- Safer APIs
- Easier distributed systems support

---

# 🚀 Quick Start

## Option 1 — Docker

```bash
# 1. Copy environment config
cp .env.example .env

# 2. Edit .env with your credentials

# 3. Start all services
docker compose up
```

The API starts at:

```txt
http://localhost:5000
```

---

## Option 2 — Local Development

### Prerequisites

- Node.js v18+
- PostgreSQL 15+

```bash
# 1. Navigate to API
cd apps/api

# 2. Install dependencies
npm install

# 3. Copy environment config
cp .env.example .env

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate dev

# 6. Seed database
npm run seed:sql

# 7. Start development server
npm run dev
```

---

# 🌱 Seed Data

```bash
npm run seed:sql
```

## Seeded Records

| Table | Records |
|---|---|
| schools | 1 |
| users | 5 |
| teachers | 2 |
| classes | 3 |
| subjects | 4 |
| class_subjects | 4 |
| students | 6 |
| assessments | 5 |

---

## 🔐 Demo Login Credentials

| Email | Password | Role |
|---|---|---|
| `admin@elimuheights.school` | `admin123` | ADMIN |
| `headteacher@elimuheights.school` | `headteacher123` | HEADTEACHER |
| `teacher1@elimuheights.school` | `teacher123` | TEACHER |
| `teacher2@elimuheights.school` | `teacher123` | TEACHER |
| `accountant@elimuheights.school` | `accountant123` | ACCOUNTANT |

---

# 🤖 Running AI Service

```bash
cd apps/ai-service

source venv/bin/activate

uvicorn app.main:app --reload --port 8000
```

---

# 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm test` | Run tests |
| `npm run test:coverage` | Coverage report |
| `npm run test:watch` | Watch tests |

---

# 🧠 Backend Architecture

```txt
Routes
  ↓
Middlewares
  ↓
Controllers
  ↓
Services
  ↓
Prisma ORM
  ↓
PostgreSQL
```

---

# 📦 Standard API Response Format

## Successful Response

```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 🔌 API Testing

## 🔐 Authentication

### Login Endpoint

```http
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "admin@elimuheights.school",
  "password": "admin123"
}
```

---

## Thunder Client Example

![Thunder Client Login Response](docs/images/auth-login-response.png)

---

## Successful Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "8d45b4ff2a9d46b4ecdfde21d09e40aec5b57cc6bb8877bb90165b8cd..."
  }
}
```

---

## cURL Example

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elimuheights.school",
    "password": "admin123"
  }'
```

---

## Using JWT Token

```bash
curl -H "Authorization: Bearer <token>" \
http://localhost:5000/api/v1/schools
```

---

# 🔌 Core Modules

## 🔐 Authentication

Handles:

- User login
- JWT authentication
- Refresh token rotation
- Role-based access control

### Endpoints

```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

---

## 👨‍🎓 Students

Handles:

- Student profiles
- Student management
- Academic records

### Endpoints

```http
GET    /api/v1/students
GET    /api/v1/students/:id
POST   /api/v1/students
PATCH  /api/v1/students/:id
DELETE /api/v1/students/:id
```

---

## 📊 Assessments

Handles:

- CBC assessments
- Student marks
- Performance analytics

### Endpoints

```http
GET    /api/v1/assessments/school/:schoolId
GET    /api/v1/assessments/school/:schoolId/count
GET    /api/v1/assessments/school/:schoolId/exam-type/:examType
POST   /api/v1/assessments
PATCH  /api/v1/assessments/school/:schoolId/:id
DELETE /api/v1/assessments/school/:schoolId/:id
```

---

## 🧠 AI Insights

Handles:

- Student insight generation
- Subject insight generation
- Class analytics
- Bulk AI processing

### Endpoints

```http
POST /api/v1/ai/generate/class
POST /api/v1/ai/generate/student
POST /api/v1/ai/generate/subject
POST /api/v1/ai/refresh
POST /api/v1/ai/bulk
GET  /api/v1/ai/health
```

---

## 💡 Insights

Handles:

- AI-generated recommendations
- Learning analytics
- Student intelligence reports

### Endpoints

```http
GET    /api/v1/insights/crud/:id
POST   /api/v1/insights/crud
PATCH  /api/v1/insights/crud/:id
DELETE /api/v1/insights/crud/:id
GET    /api/v1/insights/query/school/:schoolId
POST   /api/v1/insights/query/archive
POST   /api/v1/insights/query/bulk-generate
GET    /api/v1/insights/analytics/class/:classId
GET    /api/v1/insights/analytics/student/:studentId
GET    /api/v1/insights/analytics/subject/:subjectId
GET    /api/v1/insights/analytics/type/:type
GET    /api/v1/insights/analytics/period/:period
```

---

# 📋 Key Endpoints Summary

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| POST | `/api/v1/auth/login` | No | — |
| POST | `/api/v1/auth/refresh` | No | — |
| POST | `/api/v1/auth/logout` | Yes | All |
| GET | `/api/v1/schools` | Yes | All |
| GET | `/api/v1/students` | Yes | All |
| POST | `/api/v1/assessments` | Yes | ADMIN, HEADTEACHER, TEACHER |
| POST | `/api/v1/ai/generate/class` | Yes | ADMIN, HEADTEACHER, TEACHER |
| GET | `/api/v1/ai/health` | Yes | ADMIN |
| GET | `/health` | No | — |

---

# 🔄 System Workflow

```txt
Teacher submits assessment data
        ↓
API validates request
        ↓
Data stored in PostgreSQL
        ↓
AI analysis pipeline triggered
        ↓
Insights generated
        ↓
Insights persisted
        ↓
Dashboard visualizes intelligence
```

---

# 🛡️ Security

The API includes:

- JWT authentication
- bcrypt password hashing
- Helmet middleware
- Joi request validation
- Environment variable protection
- CORS configuration
- Refresh token rotation

---

# 📜 Logging

Logging stack:

- Winston
- Morgan
- Winston Daily Rotate File

Logs include:

- Requests
- Errors
- System events

---

# 🧩 Validation

Validation uses:

```txt
Joi
```

Schemas are located in:

```bash
src/schemas/
```

---

# ⚙️ Infrastructure Features

- Centralized error handling
- Async request handling
- Environment configuration
- Validation middleware
- JWT middleware
- Request logging

---

# 🧪 Testing

```bash
npm test
npm run test:coverage
npm run test:watch
```

---

# 🚦 Rate Limiting

| Tier | Limit |
|---|---|
| Global | 100 requests / 15 min |
| Auth | 10 requests / 15 min |
| AI | 20 requests / 15 min |

---

# 🚀 MVP Goals

- CBC analytics
- Student intelligence
- AI-powered recommendations
- Teacher intervention insights

---

# ⚖️ Architectural Trade-Offs

[View Architectural Trade-Offs](docs/architectural_trade_offs.md)

---

# 📈 Scalability Strategy

## Phase 1 — MVP

- Single PostgreSQL database
- Supports 10–50 schools

## Phase 2 — Growth

Add:

- Redis caching
- Read replicas
- Query optimization

Supports:

- Hundreds of schools

## Phase 3 — Enterprise SaaS

Add:

- Table partitioning
- Tenant sharding
- Background workers

Supports:

- Thousands of schools

---

# 🔮 Future Architecture Evolution

Planned improvements:

- Feature-based modularization
- Redis caching
- Background workers
- Event-driven architecture
- AI worker services
- Read replicas

---

# 🛣️ Product Roadmap

- Multi-school SaaS architecture
- Parent portal
- AI tutoring assistant
- School analytics dashboards
- WhatsApp notifications
- SMS integration
- Mobile app
- Real-time analytics

---

# 👤 Author

Elaine Muhombe

Built to advance data-driven education intelligence across African schools.

---

# ElimuSight

> Transforming school data into actionable intelligence.