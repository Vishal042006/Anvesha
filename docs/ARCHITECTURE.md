# ANVESHA 3.0 — System Architecture & Engineering Blueprint

## 1. System Overview & Architectural Topology

ANVESHA is engineered as an empirical, research-grade spatio-temporal intelligence platform. It maintains strict physical and logical separation between **statistical computation**, **data lineage**, and **natural-language explanation**.

```mermaid
graph TB
    subgraph Client Layer ["Client Layer (React 19 / TypeScript / Vite)"]
        UI_Nav[Top Navigation & Filters]
        UI_Map[MapLibre GL Map Engine]
        UI_Bench[Forecasting & Benchmark Table]
        UI_Research[CRIME-SHIFT Research Lab]
        UI_Prov[Provenance & Traceability Drawer]
    end

    subgraph API Layer ["API Gateway / Routing Layer (FastAPI)"]
        Route_Health["/api/v1/health"]
        Route_CS["/api/v1/crimeshift/* (52 Endpoints)"]
        Route_Spatial["/api/v1/spatial/*"]
        Route_Forecast["/api/v1/forecast/*"]
        Route_Briefing["/api/v1/briefing/*"]
        Route_Scholarly["/api/v1/research/*"]
    end

    subgraph Analytical Core ["Analytical & Statistical Core"]
        Task1_CP[PELT + BOCPD Breakpoint Engine]
        Task2_HMM[Gaussian HMM Regime Discovery]
        Task3_Trans[Supervised Transition Classifier]
        Task4_Models[10-Model Forecasting Suite]
        Task5_Conf[Conformal Quantile Calibrator]
    end

    subgraph AI Subsystem ["Local AI Subsystem (Ollama / Qwen 2.5)"]
        Ollama_Daemon[Local Ollama Server :11434]
        Qwen_Model[Qwen 2.5 :0.5b In-Memory]
        AI_Firewall[Strict Statistical Firewall]
        Fallback_Engine[Deterministic Rule Synthesis Fallback]
    end

    subgraph Data Store ["Data Foundation & Evidence Registry"]
        Panel_Parquet[Master Longitudinal Panel (2001-2023)]
        Spatial_GeoJSON[38-Unit Boundary FeatureCollections]
        Outputs_CSV[Audit Matrices, Ablation & Benchmark CSVs]
        Lit_Cache[Scholarly Metadata Cache]
    end

    UI_Nav --> Route_CS
    UI_Map --> Route_Spatial
    UI_Bench --> Route_Forecast
    UI_Research --> Route_CS
    UI_Prov --> Route_CS

    Route_CS --> Analytical Core
    Route_Spatial --> Data Store
    Route_Forecast --> Analytical Core
    Route_Briefing --> AI Subsystem
    Route_Scholarly --> Data Store

    Analytical Core --> AI_Firewall
    AI_Firewall --> Qwen_Model
    AI_Firewall -. Offline Fallback .-> Fallback_Engine
    Analytical Core --> Outputs_CSV
    Data Store --> Analytical Core
```

---

## 2. Component Breakdown

### 2.1 Client Application (`frontend/`)
- **Framework:** React 19 with Vite 8 and TypeScript 5.8.
- **Geospatial Engine:** MapLibre GL 5.1 supporting dynamic choropleths, district boundaries, and station point layers.
- **State Architecture:** URL query-parameter synchronization ensuring that district selections, crime categories, and historical year cutoffs persist across page reloads.
- **Zero-Mock Policy:** All cards, tables, choropleths, and download buttons bind directly to live backend endpoints.

### 2.2 API & Microservices Gateway (`backend/app/main.py`)
- **Framework:** FastAPI with Uvicorn ASGI server.
- **Cross-Origin Resource Sharing:** Standard CORS middleware allowing local development (`localhost:5173`, `localhost:8000`).
- **Endpoint Coverage:** 52 registered endpoints covering research overview, regimes, change points, transitions, forecasts, ablations, walk-forward validation, Diebold-Mariano tests, and full-pipeline execution.
- **JSON Serialization Guard:** Tabular inputs are sanitized with `.fillna("—")` to prevent IEEE `NaN` or `Infinity` serialization crashes.

### 2.3 Research Analytical Engine (`scripts/execute_crimeshift_research_pipeline.py` & `backend/app/api/routes/crimeshift.py`)
- **Thread Safety:** Enforced via environment variables:
  ```bash
  OMP_NUM_THREADS=1
  OPENBLAS_NUM_THREADS=1
  MKL_NUM_THREADS=1
  VECLIB_MAXIMUM_THREADS=1
  ```
- **Determinism:** Seeded random states (`np.random.seed(42)`, `torch.manual_seed(42)`).
- **Temporal Isolation:** Hard chronological boundaries:
  - In-sample Training: 2001–2017
  - Calibration: 2018–2020
  - Out-of-sample Test: 2021–2023

### 2.4 Local AI & Explainability Firewall (`backend/app/services/explanation_engine.py`)
- **Local Host Execution:** Runs natively via Ollama on port 11434. Zero external API keys or cloud dependencies required for generative explanation.
- **Strict Firewall Constraint:** The LLM receives structured evidence (observed counts, change point years, regime state, conformal interval bounds) and outputs plain-language explanations. The LLM is strictly prohibited from generating numerical forecasts.
- **High-Availability Fallback:** If Ollama is offline or uninstalled, the backend automatically transitions to `ANVESHA_NEURAL_SYNTHESIS_ACTIVE`, executing deterministic rule-based linguistic synthesis without service interruption.

---

## 3. Concurrency, Data Flow & Persistence

- **Stateless Execution:** FastAPI handlers operate statelessly, loading pre-computed benchmark artifacts from `anvesha_outputs/` and executing on-the-fly district trajectory analyses dynamically.
- **Live Pipeline Execution:** The `POST /api/v1/crimeshift/run-pipeline` endpoint enables on-demand dynamic recalculation across the active dataset for specified reporting units and category cutoffs.
- **Export Integrity:** The `GET /api/v1/crimeshift/export` endpoint returns verified JSON and Parquet manifest bundles with dataset SHA-256 hashes.
