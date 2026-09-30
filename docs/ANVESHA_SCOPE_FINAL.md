# ANVESHA Final Scope Definition

**System Name:** ANVESHA (AI-Powered Crime Intelligence & Evidence-Based Decision-Support Platform)  
**Geographic Focus:** Tamil Nadu, India (Primary) & All-India (Secondary)  
**Primary Architecture:** Spatio-Temporal Crime Forecasting Model (ST-CFM) + Document Evidence Retrieval  

---

## 1. IN SCOPE MODULES

1. **Spatio-Temporal Crime Forecasting (ST-CFM):**
   - Next-year crime count and population-normalized crime rate forecasting at district $\times$ year $\times$ crime_category grain using chronological temporal splits.
2. **Crime Anomaly Detection:**
   - Statistical anomaly identification using Isolation Forest, Local Outlier Factor (LOF), and Z-score baselines over historical crime series.
3. **Crime Trend Classification:**
   - Categorization of district trajectories into `INCREASING`, `STABLE`, `DECREASING` based on configurable percentage change thresholds ($>+5\%$, $-5\%$ to $+5\%$, $<-5\%$).
4. **Spatial Crime Analysis:**
   - Spatial lag calculation, district adjacency matrices, and GeoJSON spatiotemporal mapping.
5. **Evidence / Document Intelligence (NLP / RAG):**
   - PDF chunking, TF-IDF / embedding semantic search, metadata tagging, and source citation provenance over SCRB/NCRB document extractions.
6. **Entity Resolution & Graph Analysis:**
   - Case relationship modeling and entity resolution strictly where genuine structured case-level data exists.
7. **Model Explainability:**
   - SHAP values, permutation importance, and feature contribution breakdowns (e.g. `lag_1_crime_count`, `rolling_3yr_mean`).
8. **Data Provenance & Auditability:**
   - End-to-end lineage tracking from raw source files to model outputs with data quality scores and leakage firewalls.

---

## 2. OUT OF SCOPE MODULES

- **Computer Vision (CV)**
- **Roboflow Integrations**
- **Vehicle Detection / Visual Car Recognition**
- **License Plate Detection / Automatic Number Plate Recognition (ANPR)**
- **Person Detection / Facial Recognition**
- **CCTV Video Analysis / Video Stream Processing**
- **Visual Suspect Identification**
- **CV-Based Image OCR**

---

## 3. IMPORTANT ARCHITECTURAL DISTINCTION

> [!NOTE]
> **Document Processing vs Computer Vision:**  
> PDF document text and table extraction (`pdfplumber`, `PyPDF2`, PDF parsing) is **DOCUMENT PROCESSING** and remains **IN SCOPE** for the Evidence Explorer / NLP subsystem.  
> Computer vision image object detection, video stream analysis, and Roboflow models are **OUT OF SCOPE** and completely excluded from ANVESHA.

---

## 4. ANVESHA ARCHITECTURE FLOWCHART

```
Crime & Demographic Data (CSV / PDF Reports)
                   ↓
         Data Harmonization & Fact/Dim Modeling
                   ↓
         Spatio-Temporal Feature Store & Leakage Firewall
                   ↓
         Spatio-Temporal Crime Forecasting (ST-CFM)
                   ↓
         Statistical Anomaly & Trend Classification
                   ↓
         Spatial Lag & GeoJSON Mapping
                   ↓
         Evidence / Document NLP Retrieval
                   ↓
         Explainability + Provenance Engine
                   ↓
         FastAPI Backend → React Research Interface
```
