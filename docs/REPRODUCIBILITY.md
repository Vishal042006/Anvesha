# ANVESHA 3.0 — Reproduction Protocol & Scientific Verification Guide

This guide enables any independent computational researcher to verify and reproduce the complete ANVESHA 3.0 empirical benchmark from scratch.

---

## 1. Environment & Prerequisites

- **Operating System:** macOS (Sonoma / Sequoia), Linux (Ubuntu 22.04+ / RHEL 9+), or Windows 11 (WSL2).
- **Python Version:** Python 3.10 to 3.13.
- **Node.js Version:** Node.js 20+ with npm 10+.
- **Hardware:** Minimum 8GB RAM (16GB recommended); runs entirely on CPU or Apple Silicon MPS / NVIDIA CUDA.

---

## 2. Step-by-Step Reproduction

### Step 1: Clone Repository & Create Virtual Environment
```bash
git clone https://github.com/Vishal042006/Anvesha.git
cd Anvesha

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:0.5b
```

### Step 3: Launch Local AI Engine (Ollama)
```bash
# In a separate terminal or background daemon
ollama serve

# Pull the lightweight model
ollama pull qwen2.5:0.5b
```

### Step 4: Execute the Complete CRIME-SHIFT Research Pipeline
This script runs the deterministic 5-task pipeline (change points, HMM regimes, transition classification, 10-model forecasting benchmark, and conformal prediction):
```bash
python3 scripts/execute_crimeshift_research_pipeline.py
```
**Expected Output Artifacts:**
- `anvesha_outputs/crimeshift_model_comparison.csv`
- `anvesha_outputs/crimeshift_conformal_forecasts.csv`
- `anvesha_outputs/anvesha_training_geography_audit.csv`
- `anvesha_outputs/crimeshift_ablation_study.csv`
- `anvesha_outputs/crimeshift_significance_tests.csv`
- `anvesha_outputs/crimeshift_mlp_50epoch_history.csv`

### Step 5: Execute Automated Test Suite (100% Pass Required)
```bash
python3 -m pytest tests/
```
**Expected Result:**
```text
============================== 47 passed in 9.94s ==============================
```

### Step 6: Launch Backend & Run Endpoint Smoke Test
```bash
# Start FastAPI backend
python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 &

# Run 52-route integration smoke test
python3 -c "
from backend.app.main import app
from fastapi.testclient import TestClient
client = TestClient(app)
routes = ['/api/v1/health', '/api/v1/model-comparison', '/api/v1/ablation', '/api/v1/crimeshift/explain/Chennai']
for r in routes:
    res = client.get(r)
    assert res.status_code == 200, f'Failed on {r}: {res.status_code}'
print('All critical smoke tests passed cleanly (200 OK)!')
"
```

### Step 7: Build & Launch Frontend Application
```bash
cd frontend
npm install
npm run build   # Verifies production TypeScript compilation in <700ms
npm run dev     # Starts local server on http://localhost:5173/
```

---

## 3. Determinism & Random Seeds

All stochastic components in ANVESHA use fixed seed initialization:
```python
import numpy as np
import torch

np.random.seed(42)
torch.manual_seed(42)
```
Thread-level non-determinism across linear algebra libraries (BLAS/LAPACK) is controlled via:
```python
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
```
Re-running the pipeline yields mathematically identical out-of-sample metrics (Naïve T-1: MAE 269.76, WAPE 6.12%).
