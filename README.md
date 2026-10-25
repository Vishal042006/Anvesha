# ANVESHA 3.0
## Evidence-Grounded Crime Investigation, Regime Intelligence & Uncertainty-Aware Forecasting

[![Python 3.10-3.13](https://img.shields.io/badge/python-3.10%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Ollama Qwen 2.5](https://img.shields.io/badge/Ollama-Qwen%202.5-purple.svg)](https://ollama.com/)
[![Test Suite](https://img.shields.io/badge/tests-47%20passed%20(100%25)-brightgreen.svg)]()
[![API Routes](https://img.shields.io/badge/api%20routes-52%20verified%20(100%25)-brightgreen.svg)]()

**Research Engine:** `CRIME-SHIFT` (Crime Regime Detection, Transition Analysis and Uncertainty-Aware Forecasting)  
**Primary Geographic Scope:** Tamil Nadu, India (38 Canonical Police Administrative Units, 2001–2023)  
**Baseline Geographic Scope:** All-India Longitudinal Panel (17,761 Audited Observations)

---

## 1. Scientific & Ethical Principles

1. **Zero Data Fabrication:** Every statistic, change point, regime probability, and conformal interval is computed from audited government records (NCRB and Tamil Nadu SCRB). Zero synthetic data is used in production.
2. **Reporting Volume $\neq$ True Incidence:** Official crime records reflect cases registered by police (First Information Reports / FIRs), not total unobserved crime incidence. Registration varies with reporting willingness, police proactive enforcement, and statutory amendments.
3. **Strict Statistical Firewall:** The local language model (Ollama / Qwen 2.5) is strictly restricted to natural-language translation of structured evidence. The LLM is never permitted to calculate statistics or predict numbers.
4. **No Profiling:** Statistical patterns describe aggregate administrative jurisdictions. They must never be used to profile individuals, infer personal criminality, or justify punitive actions against communities.
5. **Fair Comparison:** Jurisdictions with different population sizes are never compared using raw crime counts. Standardized rates per 100,000 population are mandatory for comparative analysis.

---

## 2. The 5 Core Computational Tasks (CRIME-SHIFT)

### Task 1: Bayesian & Pruned Change Point Detection (PELT + BOCPD)
- **PELT:** Minimizes penalized negative log-likelihood with BIC penalty ($\beta = 2\ln n$).
- **BOCPD:** Evaluates posterior run-length distributions using conjugate Student-$t$ predictive priors.
- **Key Finding:** **82.16% concordance** between PELT and BOCPD across Tamil Nadu's 38 police units with a mean divergence of $1.29$ years. Detects the 2013–2015 administrative level-shift caused by the statewide rollout of CCTNS digital police logging.

### Task 2: Latent Crime Regime Discovery (Gaussian HMM)
- Models operational dynamics as a 4-state Gaussian Hidden Markov Model (`Stable`, `Increasing`, `High`, `Declining`).
- Fitted via Expectation-Maximization (Baum-Welch algorithm) with strict temporal isolation ($\le 2017$).
- Transition persistence $1 / (1 - P_{ii})$ quantifies regime stability (up to 14.8 years).

### Task 3: Supervised Regime Transition Prediction
- Frames prospective transition classification: $T_{d,t} = \mathbb{I}(S_{d,t+1} \neq S_{d,t})$ using features strictly known at or before time $t$.
- Balanced Random Forest Classifier achieves **88.46% Macro Precision** and **93.75% Recall** under expanding-window temporal validation.

### Task 4: 10-Model Spatio-Temporal Forecasting Benchmark
Strict chronological holdout evaluation protocol:
- **Training Period:** 2001–2017 (Historical fit)
- **Validation / Calibration Period:** 2018–2020 (Hyperparameter tuning and conformal calibration)
- **Out-of-Sample Holdout Period:** 2021–2023 (Untouched test split)

#### Empirical Out-of-Sample Results (Holdout 2021–2023)
| Model Architecture | MAE (Cases) | RMSE | WAPE (%) | MASE | sMAPE (%) | $R^2$ | Certified Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Naïve T-1 (Persistence)** | **269.76** | **629.15** | **6.12%** | **0.542** | **5.94%** | **0.9899** | **RECOMMENDED (Best)** |
| ARIMA (1,1,0) | 278.10 | 613.03 | 6.30% | 0.559 | 12.85% | 0.9904 | EVALUATED |
| PyTorch MLP Regressor (50 Epochs) | 299.26 | 597.73 | 6.78% | 0.601 | 22.09% | 0.9908 | EVALUATED |
| Ridge Autoregressive (L2) | 350.78 | 692.27 | 7.95% | 0.705 | 15.42% | 0.9878 | EVALUATED |
| Random Forest Regressor | 366.99 | 767.60 | 8.32% | 0.738 | 16.85% | 0.9851 | EVALUATED |
| 3-Year Historical Mean | 443.09 | 847.83 | 10.04% | 0.891 | 19.34% | 0.9819 | EVALUATED |
| LightGBM Regressor | 618.45 | 1920.12 | 14.02% | 1.243 | 29.15% | 0.9059 | EVALUATED |
| XGBoost Regressor | 626.23 | 1942.36 | 14.20% | 1.259 | 29.69% | 0.9037 | EVALUATED |
| Regime-Aware XGBoost | 627.18 | 1945.73 | 14.22% | 1.261 | 29.69% | 0.9033 | EVALUATED |
| PyTorch LSTM (50 Epochs) | 1145.80 | 2890.45 | 25.96% | 2.303 | 48.72% | 0.7891 | EVALUATED |

> **Key Research Finding:** The persistence baseline (Naïve T-1) achieves the lowest out-of-sample error (WAPE 6.12%), confirmed by Diebold-Mariano tests ($p < 0.001$). Complex recurrent neural networks (LSTM) overfit on annual aggregates (WAPE 25.96%).

### Task 5: Distribution-Free Conformal Uncertainty Quantification
- Non-parametric Inductive Conformal Prediction (ICP) using non-exchangeable calibration residuals.
- Generates 95% finite-sample prediction intervals for 2026–2030 projections.
- Achieves **92.75% empirical Prediction Interval Coverage Probability (PICP)**.

---

## 3. Quick Start & Execution

### Prerequisites
- Python 3.10–3.13 (`.venv`)
- Node.js 20+ & npm
- Ollama (Optional, for local AI explanation): `brew install ollama && ollama serve && ollama pull qwen2.5:0.5b`

### 1. Start Backend API Server
```bash
# Activate virtual environment
source .venv/bin/activate

# Launch FastAPI on port 8000
python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173/ in your browser
```

### 3. Run Automated Tests
```bash
# PyTest test suite (47 tests across all analytical modules)
python3 -m pytest tests/

# Frontend production compilation
cd frontend && npm run build
```

### 4. Run Full Research Pipeline
```bash
python3 scripts/execute_crimeshift_research_pipeline.py
```

---

## 4. Documentation Index

- [Repository Audit Report](docs/AUDIT_REPORT.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Data Sources & Provenance](docs/DATA_SOURCES.md)
- [Data Dictionary & Schemas](docs/DATA_DICTIONARY.md)
- [Geographic Crosswalk (38 Units)](docs/GEOGRAPHIC_CROSSWALK.md)
- [Research Methodology & Formulations](docs/RESEARCH_METHODOLOGY.md)
- [REST API Reference (52 Endpoints)](docs/API_REFERENCE.md)
- [Ollama Setup & AI Firewall](docs/OLLAMA_SETUP.md)
- [Reproducibility Protocol](docs/REPRODUCIBILITY.md)
- [Test Execution Report](reports/TEST_REPORT.md)
- [Data Quality Report](reports/DATA_QUALITY_REPORT.md)

---

## 5. License & Governance

ANVESHA 3.0 is distributed under the Apache 2.0 License. All official crime panel statistics originate from published NCRB annual gazettes and Tamil Nadu SCRB administrative compendiums.
