# ANVESHA 3.0 — Complete API Reference & Endpoint Inventory

The ANVESHA REST API exposes 52 endpoints partitioned under the `/api/v1` namespace.

---

## 1. System Health & Infrastructure

### `GET /api/v1/health`
Checks the operational readiness of the platform, including dataset availability and local AI reachability.
- **Parameters:** None
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "system": "ANVESHA Research AI Platform",
  "version": "2.0.0",
  "model_status": "MODELS_LOADED",
  "dataset_version": "v2.0.0-anvesha-master"
}
```

---

## 2. CRIME-SHIFT Research & Benchmark Suite

### `GET /api/v1/model-comparison` (Alias: `/api/v1/crimeshift/model-comparison`)
Returns the master empirical benchmark results across all 10 spatio-temporal forecasting architectures evaluated on the held-out test split (2021–2023).
- **Parameters:** None
- **Response (200 OK):**
```json
{
  "metadata": {
    "target": "Recorded Crime Count",
    "geographic_scope": "38-unit canonical historical benchmark",
    "training_period": "2001–2017 (Chronological)",
    "validation_period": "2018–2020 (Calibration)",
    "test_period": "2021–2023 (Out-of-sample holdout)",
    "recommended_model": "Naïve T-1",
    "rationale": "Persistence baseline (Naïve T-1) achieves the lowest out-of-sample MAE (269.76) and lowest WAPE (6.12%) on the held-out test split."
  },
  "models": [
    {
      "model_id": "ANV-FC-NAÏVE-T-1",
      "model": "Naïve T-1",
      "mae": 269.76,
      "rmse": 629.15,
      "wape": 6.12,
      "mase": 0.542,
      "smape": 5.94,
      "r2": 0.9899,
      "status": "RECOMMENDED",
      "is_recommended": true
    },
    {
      "model_id": "ANV-FC-ARIMA",
      "model": "ARIMA",
      "mae": 278.10,
      "rmse": 613.03,
      "wape": 6.30,
      "mase": 0.559,
      "smape": 12.85,
      "r2": 0.9904,
      "status": "EVALUATED",
      "is_recommended": false
    }
  ]
}
```

### `GET /api/v1/change-points` (Alias: `/api/v1/crimeshift/change-points`)
Returns PELT and BOCPD change point detection audit table with concordance metrics.
- **Query Parameters:**
  - `unit` (optional string): Filter by district / police unit.
- **Response (200 OK):**
```json
{
  "bocpd_pelt_agreement_pct": 82.16,
  "mean_year_diff": 1.29,
  "change_points": [
    {
      "district": "Chennai",
      "change_year_pelt": 2014,
      "change_year_bocpd": 2014,
      "agreement": true,
      "significance": "CCTNS Digitalization Rollout"
    }
  ]
}
```

### `GET /api/v1/regimes` (Alias: `/api/v1/crimeshift/regimes`)
Returns latent crime regime assignments and state characterization from the 4-state Gaussian HMM.
- **Query Parameters:** `unit` (optional string).
- **Response (200 OK):** Returns regime records with `Stable`, `Increasing`, `High`, `Declining` labels.

### `GET /api/v1/transitions` (Alias: `/api/v1/crimeshift/transitions`)
Computes context-specific Markov transition probability matrix $P(S_{t+1} \mid S_t)$ with Laplace smoothing ($\alpha = 0.05$).
- **Query Parameters:**
  - `unit` (optional string): District name (default: statewide aggregate).
  - `category` (string, default: `"ALL_CRIME"`): Crime category filter.
  - `year_cutoff` (int, default: `2023`): Historical cutoff year.
- **Response (200 OK):** Returns 4x4 transition probability matrix, persistence windows, and sample transition counts.

### `GET /api/v1/ablation` (Alias: `/api/v1/crimeshift/ablation`)
Returns empirical ablation study results across Experiments A through F.
- **Response (200 OK):** Tabular ablation comparisons.

### `GET /api/v1/walk-forward` (Alias: `/api/v1/crimeshift/walk-forward`)
Returns rolling-origin walk-forward cross-validation performance across 1-year, 2-year, and 3-year forecast horizons.

### `GET /api/v1/significance` (Alias: `/api/v1/crimeshift/significance`)
Returns the Diebold-Mariano paired loss differential matrix evaluating statistical significance between forecasting architectures.

### `POST /api/v1/crimeshift/run-pipeline`
Executes real dynamic recalculation across the active dataset for specified parameters.
- **Request Body:**
```json
{
  "unit": "Chennai",
  "category": "ALL_CRIME",
  "year_cutoff": 2023
}
```
- **Response (200 OK):** Detailed execution summary, detected change point, regime persistence, and conformal forecast horizons.

---

## 3. Local AI & Natural-Language Explainability

### `GET /api/v1/explain/{unit}` (Alias: `/api/v1/crimeshift/explain/{unit}`)
Invokes the local Ollama Qwen 2.5 engine to translate statistical change points, regimes, and conformal intervals into human-readable criminological briefings.
- **Path Parameter:** `unit` (e.g., `"Chennai"`).
- **Query Parameter:** `category` (default: `"ALL_CRIME"`).
- **Response (200 OK):**
```json
{
  "status": "success",
  "context_id": "TN|GEO_CHENNAI|ALL_CRIME|EXPLANATION",
  "what_changed": "The observed pattern of an increasing number of crimes in Chennai...",
  "current_pattern": "Increasing",
  "what_may_happen_next": "The next regime is likely to continue with an increasing number of crimes.",
  "forecast_reading": "61,048.6",
  "uncertainty_limitations": "The forecast reading is based on empirical data...",
  "certainty": "90.9%",
  "evidence_used": [
    "Jurisdiction: Chennai",
    "Structural shift: 2021",
    "Transition probability: 92.0%",
    "Forecast point: 61,049"
  ],
  "engine_status": "OLLAMA_QWEN_ACTIVE",
  "explanation_source": "Qwen 2.5 (qwen2.5:0.5b)"
}
```

---

## 4. Geospatial Intelligence

### `GET /api/v1/spatial/map`
Returns a GeoJSON FeatureCollection dynamically styled with recorded crime counts, rates per 100k, HMM regimes, and conformal forecasts.
- **Query Parameters:**
  - `level` (`"district"`, `"police_unit"`, `"police_station"`).
  - `year` (`2001` – `2030`).
  - `crime_category` (`"ALL_CRIME"`, `"PROPERTY_CRIME"`, etc.).
  - `metric` (`"crime_count"`, `"crime_rate_per_100k"`, `"regime"`, `"forecast"`).
  - `state` (default: `"TAMIL NADU"`).
- **Response (200 OK):** Standard GeoJSON `FeatureCollection` with embedded statistical properties.

---

## 5. Scholarly Literature & District Briefings

### `GET /api/v1/evidence/search`
Searches verified scholarly literature via OpenAlex, Crossref, and Semantic Scholar with BGE-M3 dense retrieval and reranking.
- **Query Parameter:** `query` (string, e.g., `"property crime deterrence"`).

### `GET /api/v1/briefing/district`
Generates a multi-source district intelligence briefing combining observed statistics, local news developments, and verified research evidence.
- **Query Parameters:** `district`, `category`, `year`.
