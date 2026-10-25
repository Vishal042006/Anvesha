# ANVESHA 2.0 — CRIME-SHIFT GEOGRAPHIC INTELLIGENCE & MAP BACKEND

**Module**: Geographic Analysis & Spatial Intelligence API  
**Engine**: `CRIME-SHIFT` Spatial Intelligence  
**Author**: ANVESHA Geospatial & Backend Engineering Team  
**Status**: Production-Grade / Active  

---

## 1. Overview & Objectives

The ANVESHA 2.0 Geographic Intelligence Backend provides production-grade, research-standard spatial APIs for interactive map visualization and analytical drill-down. It integrates:
- **Canonical GeoJSON Geometries**: Real district and police unit boundary polygons for Tamil Nadu.
- **Longitudinal IPC Panel (2001–2023)**: Official observed crime counts across 17,761 district-year observations.
- **CRIME-SHIFT Regimes & Structural Breaks**: Gaussian HMM latent regimes and BOCPD + PELT change point probabilities.
- **Conformal Multi-Horizon Forecasts**: 95% non-parametric prediction intervals for 2026–2030.

---

## 2. API Endpoints Specification

### 1. `GET /api/v1/spatial/levels`
Dynamically returns available geographic levels based on actual data presence.
- **Response**:
```json
{
  "levels": [
    {"code": "state", "label": "State / UT", "description": "State-level spatial aggregates across India"},
    {"code": "district", "label": "District", "description": "District-level administrative spatial boundaries"},
    {"code": "police_unit", "label": "Police Unit", "description": "District and City Police Commissionerates"},
    {"code": "police_station", "label": "Police Station", "description": "Point location coordinates of individual police stations"}
  ],
  "default_level": "police_unit"
}
```

### 2. `GET /api/v1/spatial/categories`
Returns available crime taxonomy categories from dataset.
- **Response**:
```json
{
  "categories": [
    {"code": "ALL_CRIME", "label": "All IPC Crimes Total"},
    {"code": "MURDER", "label": "Murder & Violent Crimes"},
    {"code": "PROPERTY", "label": "Property Offence"},
    {"code": "WOMEN", "label": "Crimes Against Women"},
    {"code": "CHILDREN", "label": "Crimes Against Children"}
  ],
  "default_category": "ALL_CRIME"
}
```

### 3. `GET /api/v1/spatial/map`
Canonical GeoJSON query endpoint returning a valid `FeatureCollection`.
- **Query Parameters**:
  - `level`: `police_unit`, `district`, `state`, `police_station` (default: `police_unit`)
  - `year`: Target data year (2001–2030, default: `2023`)
  - `crime_category`: `ALL_CRIME`, `MURDER`, `PROPERTY`, etc.
  - `metric`: `crime_count`, `crime_rate_per_100k`, `population`, `regime`, `change_point`, `forecast`
  - `state`: State filter (default: `TAMIL NADU`)
  - `include_crimeshift`: Boolean flag to attach CRIME-SHIFT regime/forecast overlays
- **Feature Properties**:
  - `geography_id`: Canonical ID (`GEO_TN_001` .. `GEO_TN_038`)
  - `name`: Official display name (`Chennai City`, `Ariyalur`)
  - `data_year`: Target year
  - `data_available`: Boolean status
  - `crime_count`: Observed IPC crime count (or `null` if unavailable)
  - `crime_rate_per_100k`: Population-adjusted crime rate
  - `current_regime`: Latent regime (`Stable`, `High / Increasing`)
  - `change_point_detected`: Boolean flag for structural break
  - `change_point_year`: Year of structural break (e.g. 2016)
  - `forecast_value`: Modelled forecast projection
  - `provenance`: Lineage tag (`OBSERVED`, `MODELLED`, `FORECAST`, `ESTIMATED`)

### 4. `GET /api/v1/spatial/summary`
Returns a lightweight statistical summary for selected filters:
- **Response Keys**: `total_units`, `units_with_data`, `units_missing_data`, `mean_crime`, `median_crime`, `highest_unit`, `lowest_unit`, `regime_distribution`, `change_points_count`, `provenance_breakdown`.

### 5. `GET /api/v1/spatial/unit/{geography_id}`
Detailed unit side-panel endpoint.
- **Parameters**: `geography_id` (e.g. `GEO_TN_002` or `Chennai City`), `year_cutoff` (strict cutoff to prevent leakage).
- **Response Object**: Contains `geography`, `current_status`, `crime_history` (2001–2023), `forecast` (multi-horizon prediction), and `provenance`.

---

## 3. Scientific Rules & Provenance Guidelines

1. **Zero Fabricated Risk Scores**: ANVESHA displaying real observed counts, rates, and validated regime classifications. No arbitrary "danger ratings" are generated.
2. **Strict Missingness Handling**: Missing values return `null` with `data_available: false`. Missing data is never silently replaced with `0`.
3. **Strict Temporal Isolation**: Requests for historical years (e.g. `year=2018`) strictly exclude future observations ($2019+$) from unit history blocks.
4. **Explicit Provenance**: All property values carry explicit lineage metadata tags:
   - `OBSERVED`: Official NCRB/SCRB reported figures
   - `MODELLED`: Gaussian HMM regimes & BOCPD change points
   - `FORECAST`: Conformal ML model forecasts
   - `ESTIMATED`: Population baseline metrics

---

## 4. Test Coverage & Verification

- **Test Suite**: `backend/tests/test_canonical_geography_and_map.py`
- **Total Backend Tests**: 31 tests passing (100% pass rate).
- **Key Test Cases**:
  - `test_spatial_levels_endpoint()`
  - `test_spatial_categories_endpoint()`
  - `test_spatial_map_canonical_endpoint()`
  - `test_spatial_summary_endpoint()`
  - `test_spatial_unit_details_endpoint()`
  - `test_spatial_unit_details_404()`
