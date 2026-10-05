# ANVESHA V4.0 — End-to-End Research Demo Flow

This guide walks through the canonical V4.0 demonstration flow across all 10 views:

1. **OPEN ANVESHA COMMAND CENTER** (`/overview`)
   - View top bar with global controls: Selected Unit (`CHENNAI`), Category (`PROPERTY_CRIME`), Year (`2024`).
   - Observe real-time API status indicator (`API ONLINE`).
   - Inspect dual-track telemetry: Track A (2001–2014 NCRB Ground Truth) vs Track B (2015–2023 Candidate Panel).

2. **CRIME ANALYSIS** (`/crime_analysis`)
   - Inspect historical FIR volume line chart and YoY percentage change bar chart for Chennai.
   - Note the `[OFFICIAL OBSERVED]` badge on historical counts and `[DERIVED STATISTIC]` badge on YoY change.
   - Export CSV data using the "Export Data CSV" button.

3. **FORECASTING LAB** (`/forecasting`)
   - Select model: `Previous-Year Persistence (T-1)`.
   - View 2024 out-of-sample point prediction (e.g. 2,431 predicted FIR incidents).
   - Inspect lag inputs ($T-1, T-2, T-3$) and Track A benchmark metrics ($\text{MAE}=171.50$, $\text{WAPE}=16.58\%$, $R^2=0.9142$).
   - Switch unit to a sparse unit to demonstrate the `INSUFFICIENT HISTORICAL DATA` state.

4. **TREND ANALYSIS** (`/trends`)
   - View predicted trend direction (`INCREASING`, `STABLE`, or `DECREASING`).
   - Click "Explain Model Output" to open feature contribution drawer (`/api/v1/explain/{prediction_id}`).
   - Review canonical audited Target-A benchmark metrics (80.59% accuracy, 0.6367 Macro-F1).

5. **ANOMALY ANALYSIS** (`/anomalies`)
   - Inspect IsolationForest statistical outliers.
   - Review the mandatory non-misconduct disclaimer: "Aggregate anomalies are statistical flags, not evidence of individual wrongdoing or misconduct."

6. **SPATIAL INTELLIGENCE** (`/spatial`)
   - Interact with the MapLibre GL map showing reporting unit centroids.
   - Click a reporting unit node (e.g., Coimbatore) to open the District Intelligence Drawer.
   - View population rate derived from Census 2011.

7. **EVIDENCE EXPLORER** (`/evidence`)
   - Search query: "Crime against women".
   - View BGE semantic vector search results with similarity scores.
   - Click an evidence card to view citation details, page number, and non-causal provenance chain.

8. **DATA & PROVENANCE** (`/provenance`)
   - Inspect verified SHA256 checksum (`768a899b7c5e1df41ce2cd2a90bfe4470c45f9785bd2246e08596c83d610a5b0`).
   - View visual timeline (2001–2014 Benchmark vs 2015–2016 Gap vs 2017–2023 Documentary vs Synthetic).

9. **MODEL LAB** (`/model_lab`)
   - Inspect backend model registry table listing registered model artifacts and Track A / Track B evaluations.

10. **RESEARCH REPORT** (`/research_report`)
    - Review publication summary, 13 sections, and 3 defensible V3.5 research contributions.
