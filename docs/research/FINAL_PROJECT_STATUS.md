# ANVESHA Final Project Status & Research Verification
**Date:** September 30, 2026  
**Status:** READY_FOR_RESEARCH  
**Version:** v2.0.0-anvesha-master  

---

## 1. What Was Implemented
- **Full Data Engineering Pipeline:** Processed 216 primary & extracted tables (2.4M+ records).
- **Fact & Dimension Modeling:** Normalized fact tables (`fact_crime`, `fact_victim`, `fact_arrest`, `fact_police_disposal`, `fact_court_disposal`, `fact_missing_person`, `fact_cybercrime`, `fact_economic_offence`, `fact_property`) and dimension tables (`dim_geography`, `dim_time`, `dim_crime`, `dim_law`) under `data/03_normalized/` in both CSV and `.parquet`.
- **Chronological Validation Split:** Strict temporal firewall splitting Train (2001–2017), Validation (2018–2019), and Test (2020–2022). Zero future data leakage or shuffle contamination.
- **Model Suite Trained & Evaluated:**
  - **Baselines:** Last-Year Naive (`MAE=5.53M`, `R2=0.118`), 3-Year Moving Average (`MAE=5.55M`, `R2=0.204`), Ridge Regression (`MAE=14.15M`).
  - **Tabular Tree Ensembles:** Random Forest (`MAE=7.47M`), Extra Trees (`MAE=5.85M`, `R2=-0.51`), HistGradientBoosting (`MAE=8.76M`).
  - **Trend Classifier:** Random Forest Classifier (Accuracy 94.0%, Macro F1 0.92).
  - **Statistical Anomaly Detector:** Isolation Forest (5.0% contamination rate).
  - **NLP Evidence Search:** Chunked text vector search over PDF extractions with source/page/year/citation metadata.
- **FastAPI Python Backend:** Endpoints for health, model registry, single/bulk forecasting, anomalies, trends, district analytics, spatial GeoJSON, model explainability, and evidence search. 100% test pass rate (`pytest`).
- **Research Documentation Suite:** 8 comprehensive markdown reports.

---

## 2. Model Performance Summary Table
| Model Name | Task | MAE | RMSE | R² | sMAPE (%) | WAPE (%) | Training Period | Test Period | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline_LastYear** | Forecasting | 5,531,907.73 | 10,311,614.01 | 0.1181 | 55.50 | 69.90 | 2001–2017 | 2020–2022 | Benchmark |
| **Baseline_3YrAvg** | Forecasting | 5,556,878.80 | 9,796,976.50 | 0.2040 | 86.86 | 70.21 | 2001–2017 | 2020–2022 | Benchmark |
| **ExtraTreesRegressor** | Forecasting | 5,850,434.71 | 13,497,348.00 | -0.5109 | 66.85 | 73.92 | 2001–2017 | 2020–2022 | Verified |
| **RandomForestRegressor**| Forecasting | 7,474,457.82 | 33,321,705.41 | -8.2087 | 59.93 | 94.44 | 2001–2017 | 2020–2022 | Verified |
| **HistGradientBoosting** | Forecasting | 8,763,313.35 | 22,412,918.19 | -3.1662 | 66.01 | 110.73 | 2001–2017 | 2020–2022 | Verified |
| **RidgeRegression** | Forecasting | 14,151,800.77 | 30,216,509.74 | -6.5723 | 114.35 | 178.82 | 2001–2017 | 2020–2022 | Baseline |
| **IsolationForest** | Anomaly | Contamination=0.05 | - | - | - | - | 2001–2017 | 2020–2022 | Verified |
| **RandomForestClassifier**| Trend Class | Acc=0.940 | - | - | - | F1=0.92 | 2001–2017 | 2020–2022 | Verified |

---

## 3. What Was Not Trained & Rationale
- **Deep Learning (LSTM / GRU / Temporal Transformer):** Marked `NOT_TRAINED_INSUFFICIENT_DATA`. Annual temporal resolution (23 time steps, 2001–2023) does not provide the tens of thousands of time sequences required to prevent severe overfitting in high-capacity neural network architectures.
- **Graph Neural Networks (GNN / GraphSAGE / GAT):** Spatial lag features were explicitly calculated from `16_graph_edges.csv` and evaluated in tabular models. Full GNN message passing was withheld due to static administrative boundary graph topology with annual aggregated nodes.

---

## 4. API Endpoints Status
- `GET /api/v1/health` — **200 OK**
- `GET /api/v1/models` — **200 OK**
- `GET/POST /api/v1/forecast` — **200 OK**
- `POST /api/v1/forecast/bulk` — **200 OK**
- `GET /api/v1/anomalies` — **200 OK**
- `GET /api/v1/trends` — **200 OK**
- `GET /api/v1/districts/{district}/analytics` — **200 OK**
- `GET /api/v1/spatial/crime` — **200 OK**
- `GET /api/v1/explain/{prediction_id}` — **200 OK**
- `GET /api/v1/evidence/search` — **200 OK**

---

## 5. Next Research Steps
1. Incorporate quarterly or monthly SCRB crime statistics where available to expand time steps from 23 to 276+.
2. Evaluate spatial GNN models once monthly spatiotemporal data is accessible.
3. Integrate Sentence Transformer dense vector embeddings for semantic legal search.
