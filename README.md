# MediSA - AI-Powered Healthcare Discovery & Federated RAG Platform

MediSA is an intelligent healthcare discovery platform designed to help users identify the right hospitals, clinical departments, and specialists using natural language query understanding.

The platform concurrently serves as a research benchmark comparing **Traditional RAG (Retrieval-Augmented Generation)** with **Federated RAG (FRAG)** across simulated distributed hospital knowledge bases.

---

## 🏗️ Architecture Overview

```
medisa/
├── frontend/             # Next.js (App Router, TailwindCSS, TypeScript)
├── backend/              # Laravel 11 REST API (PostgreSQL, Auth, CRUD, Core Logic)
├── ai-service/           # FastAPI (Python 3.12, LangChain/Vector Retrieval, FRAG engine)
├── docker/               # Service Dockerfiles, Nginx configurations, PostgreSQL init
├── docker-compose.yml    # Unified multi-service orchestrator
└── .env.example          # Master environment variable template
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PHP 8.3 & Composer
- Python 3.11+

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Spin Up With Docker
```bash
docker compose up --build -d
```

### 4. Service Endpoints
| Service | URL | Notes |
| :--- | :--- | :--- |
| **Next.js Frontend** | `http://localhost:3005` | Modern Healthcare Discovery UI |
| **Laravel Backend API** | `http://localhost:8005` | Core Business Logic & Directory |
| **FastAPI AI Service** | `http://localhost:8006` | FRAG Retrieval Engine (`/docs` for Swagger UI) |
| **PostgreSQL (pgvector)** | `localhost:5455` | Relational & Vector Store (`medisa`) |
| **Redis** | `localhost:6395` | Queue worker & caching layer |

---

## 🔬 Core Research: Traditional RAG vs. Federated RAG (FRAG)

- **Traditional RAG**: Centralized vector pool $\rightarrow$ Top-k retrieval $\rightarrow$ Single prompt context.
- **Federated RAG (FRAG)**: Distributed queries across Hospital A, Hospital B, Hospital C, and National Clinical Guidelines $\rightarrow$ Reciprocal Rank Fusion / Cross-Encoder Reranker $\rightarrow$ Evidence-weighted synthesis with hospital attribution.
