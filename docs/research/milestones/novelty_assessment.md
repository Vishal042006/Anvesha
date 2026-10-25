# DEFENSIBLE ANVESHA RESEARCH NOVELTY ASSESSMENT

---

## 1. CORE METHODOLOGICAL & SYSTEM CONTRIBUTIONS

ANVESHA delivers three defensible research contributions for administrative time-series crime intelligence:

1. **Provenance-Aware Dual-Track Architecture:** Systematically segregates official ground truth observations (`Track A`) from controlled synthetic extensions (`Track B`), ensuring zero synthetic leakage into official research evaluation.
2. **Leakage-Safe Chronological Expanding Window Framework:** Rigorous multi-fold temporal backtesting on sparse district administrative panels without future feature leakage.
3. **Evidence-Grounded AI Interpretation with Causality Firewall:** Integrates semantic literature search and LLM contextual reasoning with explicit, automated safeguards preventing correlation-to-causation fallacies.

---

## 2. SYSTEM vs METHODOLOGICAL CONTRIBUTION MATRIX

| Dimension | System Contribution | Methodological Contribution | Defensibility |
| :--- | :--- | :--- | :--- |
| **Data Layer** | Dual-track storage and parquet freezing | Explicit status matrix (`OFFICIAL`, `SYNTHETIC`) | High |
| **Forecasting** | API endpoint serving model predictions | Expanding window backtest with non-parametric persistence baseline | High |
| **RAG / AI** | FastAPI + Qwen reasoning pipeline | Causality Firewall enforcing statistical unusualness semantics | High |
