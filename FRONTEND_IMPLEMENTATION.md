# ANVESHA Frontend Implementation Report

## Architecture Overview
The ANVESHA research frontend is built with:
- **Framework:** React 18, Vite, TypeScript
- **State Management & Data Fetching:** TanStack Query (React Query) & Axios
- **Routing:** React Router v6
- **UI Components & Charts:** Recharts, MapLibre GL, TailwindCSS
- **Design Aesthetic:** Intelligence & research-grade dark navy palette (`#0B132B`, `#1C2541`, `#3A506B`), restrained teal accents (`#48CAE4`, `#00B4D8`), white/gray typography.

## 9 Research Pages
1. **Command Dashboard:** Overview metrics, total districts, available years, crime categories, dataset coverage, model status, anomaly counts, and historical crime trajectory.
2. **Forecasting Lab:** District/category selection, year selector, model selection, historical vs forecast chart, model metrics, feature contributions, and data provenance.
3. **Model Lab:** Model benchmarking table (MAE, RMSE, R2, sMAPE, WAPE), actual vs predicted comparison, error distribution, and evaluation period filters.
4. **Anomaly Analysis:** Statistical anomaly timeline, method selector (Isolation Forest, LOF, Z-Score), score distributions, and supporting feature breakdowns.
5. **Trend Analysis:** Trend classification table (`INCREASING`, `STABLE`, `DECREASING`), percentage change filters, and threshold settings.
6. **Spatial Intelligence:** Interactive map showing district-level crime counts, crime rates, and spatial lag features.
7. **Evidence Explorer:** RAG evidence retrieval search bar with snippet citations, document source, page number, and "Why?" explanation modal.
8. **Data Quality:** Missingness reports, taxonomy mappings, geographic normalization status, outlier audits, and leakage firewall verification.
9. **Research / Model Report:** Complete research methodology, research questions (RQ1–RQ8), limitations, and responsible AI guidelines.
