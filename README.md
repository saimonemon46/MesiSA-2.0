# MediSA - AI-Powered Conversational Triage & Healthcare Platform

MediSA is an enterprise healthcare platform structured as a clean, unified **Monorepo** governing conversational AI triage, medical document OCR, clinical report governance, and appointment scheduling across 5 strict role tiers.

---

## 🏛️ Monorepo Architecture

```
MediSA/                     # Unified Monorepo Root
├── frontend/               # [Layer 1] Next.js 16 (App Router / TypeScript / Presentation)
│   ├── app/                # Pages, layout, globals.css
│   ├── components/         # Patient, Doctor, Admin UI views, native Icons
│   └── lib/                # Typed API clients & mock data
│
├── backend/                # [Layer 2] Laravel 13 Core Application API
│   ├── app/                # Models, Services, Controllers, RBAC Middlewares
│   ├── database/           # 15 Migrations & Comprehensive Seeders
│   ├── routes/             # REST /api/v1/* and protected /api/v1/internal/*
│   └── tests/              # Feature & Unit PHPUnit test suites
│
├── ai_service/             # [Layer 3] FastAPI + LangGraph AI Reasoning Engine
│   ├── app/graph/          # LangGraph State Machine (Red-flag, Contradiction, Synthesis)
│   ├── app/core/           # Circuit Breaker & Controlled Laravel Client
│   ├── app/services/       # Multi-LLM provider & OCR confidence gatekeeper (< 0.85)
│   └── tests/              # 5 Pytest test suites (10 passing tests)
│
├── docker-compose.yml      # Multi-container orchestration (Postgres, Redis, Backend, AI, Frontend)
└── README.md
```

---

## 🔒 20 Core Architectural & Clinical Rules Enforced

1. **Rule 1**: Next.js contains UI/presentation logic only.
2. **Rule 2**: Laravel is the primary business/application API.
3. **Rule 3**: FastAPI is responsible for AI functionality.
4. **Rule 4**: LangGraph owns the AI reasoning workflow.
5. **Rule 5**: LangGraph has NO unrestricted direct access to PostgreSQL.
6. **Rule 6**: AI-to-Laravel communication uses controlled APIs (`/api/v1/internal/*`).
7. **Rule 7**: Frontend never directly accesses PostgreSQL, Redis, Qdrant, or MinIO.
8. **Rule 8**: Secrets are never committed to Git.
9. **Rule 9**: All APIs use `/api/v1/` versioning.
10. **Rule 10**: Sensitive administrative actions are authorized and audited in `audit_logs`.
11. **Rule 11**: Clinical triage overrides require appropriate doctor permissions and reason logging.
12. **Rule 12**: Emergency red flags bypass conversational questioning.
13. **Rule 13**: Contradictory symptom answers trigger clarification.
14. **Rule 14**: AI provider failures use circuit breaker fallback.
15. **Rule 15**: Low-confidence OCR ($< 0.85$) blocks blind clinical reasoning ingestion.
16. **Rule 16**: Research Benchmark Suite excluded.
17. **Rule 17**: No premature microservices.
18. **Rule 18**: Modular architecture for future extensibility.
19. **Rule 19**: 5-Tier role separation (`patient`, `doctor`, `nurse`, `hospital_admin`, `super_admin`).
20. **Rule 20**: Business logic isolated in dedicated domain services, not controllers/components.

---

## 🚀 Quick Start

### 1. Backend (Laravel API)
```bash
cd backend
php artisan migrate --seed
php artisan serve --port=8000
```

### 2. AI Reasoning Service (FastAPI)
```bash
cd ai_service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001 --reload
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 🧪 Automated Verification
```bash
# Laravel Backend Tests
cd backend && php artisan test

# AI Reasoning Pytest Suite
cd ai_service && pytest tests/ -v

# Frontend Production Build
cd frontend && npm run build
```
