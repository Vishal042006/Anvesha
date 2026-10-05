# ANVESHA V4.0 — Implementation Architecture & Engineering Guide

## 1. Overview
ANVESHA V4.0 integrates the React single-page frontend application with the production FastAPI backend. The frontend acts as a pure client, fetching verified research telemetry, model predictions, spatial coordinates, and semantic evidence over HTTP endpoints.

## 2. Directory & Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # 10-item desktop research navigation & API status
│   │   │   └── Topbar.tsx           # Global unit/category/year controls & status drawer
│   │   ├── provenance/
│   │   │   └── ProvenanceBadge.tsx  # Reusable lineage badge & tooltip for 8 provenance types
│   │   ├── ui/
│   │   │   └── ApiStateHandlers.tsx # Loading, Error, Empty, & InsufficientHistory components
│   │   ├── AboutModal.tsx           # Methodology & data product registry modal
│   │   └── MapLibreView.tsx         # MapLibre GL map view with OpenFreeMap tiles
│   ├── pages/
│   │   ├── OverviewPage.tsx         # Command Center & dual-track telemetry
│   │   ├── CrimeAnalysisPage.tsx    # Recharts FIR volume & YoY trajectory
│   │   ├── ForecastingPage.tsx      # T-1 Persistence & Ridge point forecasting
│   │   ├── TrendAnalysisPage.tsx    # YoY trend direction classifier & explainability
│   │   ├── AnomalyAnalysisPage.tsx  # IsolationForest outlier detection
│   │   ├── SpatialIntelligencePage.tsx # Centroids map & district drawer
│   │   ├── EvidencePage.tsx         # BGE semantic vector search & citation drawer
│   │   ├── DataProvenancePage.tsx   # Cryptographic SHA256 audit & timeline
│   │   ├── ModelLabPage.tsx         # Model registry table & benchmark metrics
│   │   └── ResearchReportPage.tsx   # 13 publication sections & defensible contributions
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.ts         # Central HTTP client with error handling
│   │   │   └── index.ts             # Strongly typed API service methods
│   │   └── api.ts                   # Export wrapper
│   └── types/
│       └── index.ts                 # Full TypeScript interfaces matching FastAPI schemas
```

## 3. Key Design Choices
- **Theme**: Research workstation aesthetic with Deep Navy (`#07111F`), Dark Slate Surface (`#0D1B2A`), Border (`#24384D`), Muted Teal (`#16B8A6`), and Muted Blue (`#3B82F6`).
- **No Mock Fallbacks**: When backend endpoints return empty or error responses, explicit `ApiErrorState`, `ApiEmptyState`, or `InsufficientHistoryState` views are rendered rather than fake data.
- **Strict Typing**: All responses are typed according to `frontend/src/types/index.ts`.
