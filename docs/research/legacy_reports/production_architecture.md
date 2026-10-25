# ANVESHA — Production Architecture Specification

## Overview & Philosophy
ANVESHA is an **evidence-grounded, research-oriented crime intelligence platform** designed for Tamil Nadu.

The system is organized around four core conceptual modules:

```
    DATA (Canonical Integrated Panel)
      ↓
    ANALYSIS (Trend, Baseline Comparison, 3-Yr Mean Forecast, Anomaly)
      ↓
    EVIDENCE (OpenAlex, Semantic Scholar, Crossref, BGE-M3, BGE Reranker)
      ↓
    GUIDANCE (Tangible Action Engine & Grounded Qwen3-8B Synthesis)
```

---

## 🏛️ The Four Core Modules

### Module 1: Data Architecture
- **Canonical Dataset**: [`data/04_integrated/anvesha_extended_crime_master.parquet`](file:///Users/vishal/Documents/Police/data/04_integrated/anvesha_extended_crime_master.parquet) (4,558 observations, 2001–2023 across 36 TN police units).
- **Geographic Dimensions**: `dim_geography.csv` (36 TN units with lat/lon centroids; 0 AP/Telangana contamination).
- **Population Layer**: `tn_population_clean.csv` (used for per-100k population rates).
- **Domain Isolation**: FIR crimes, complaints, road crashes, and suicides remain in isolated domain files.

### Module 2: Crime Analysis Engine
- **Trend Calculation**: Identifies direction (Increasing $\ge +5\%$, Decreasing $\le -5\%$, Stable).
- **Baseline Comparison**: Evaluates current observation against recent 3-year historical average.
- **Default Forecast**: **3-Year Rolling Mean Baseline** ($R^2 = 0.9984$, MAE = 31.21).
- **Anomaly Detection**: **Isolation Forest** (contamination = 0.05). Flags upper 5% statistical spikes.
- **Trend Classification**: **Random Forest Classifier** (Accuracy: 81.25%, Macro F1: 0.6942).
- **Benchmark Models**: Ridge Regression, HistGradientBoosting (kept cleanly in benchmark tier).

### Module 3: Research Evidence Engine
- **Multi-Source Retrieval**: OpenAlex, Semantic Scholar (with exponential backoff & caching), Crossref (polite mailto access).
- **Normalizer & Deduplicator**: Unifies records and merges duplicates by DOI, title, and author-year.
- **Dense Semantic Retrieval**: **BAAI/bge-m3** (HF Inference API / fallback).
- **Reranker**: **BAAI/bge-reranker-v2-m3** (HF Inference API / fallback).
- **Synthesizer**: **Qwen/Qwen3-8B** (HF Inference API / fallback).

### Module 4: Explanation & Guidance (Action Engine)
- **Tangible Action Engine**: Transforms findings into structured, non-vague recommendation objects.
- **Actionability Levels**:
  - `LEVEL 1 — GENERAL EVIDENCE`: General intervention class supported by literature.
  - `LEVEL 2 — AREA-TARGETED`: Target area is a specific district in Tamil Nadu.
  - `LEVEL 3 — LOCATION-TARGETED`: Used ONLY if sub-district station records exist.
- **Vague Phrase Rejection**: Automatically rejects generic advice ("improve security", "increase awareness") unless backed by a specific paper DOI.
- **Separation of Concerns**: Output explicitly presents 5 clear sections:
  1. `OBSERVED`: Direct measurement
  2. `INTERPRETATION`: Statistical trend notice
  3. `EVIDENCE`: Published research paper & DOI
  4. `ACTION`: Concrete intervention, actor, & expected indicator
  5. `LIMITATIONS`: Data boundary notice

---

## 🔒 Security & Scientific Integrity
- Secrets stored server-side in `.env` (git-ignored).
- Zero individual profiling or risk scoring.
- Non-causal language enforced ("may be associated with", "suggests").
- Complete research audit logging (`ResearchRecord`) for reproducibility.
