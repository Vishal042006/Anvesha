# ANVESHA 3.0 — Comprehensive Data Dictionary & Schema Specification

This document provides complete, column-by-column specifications for all canonical datasets, feature matrices, and analytical outputs within the ANVESHA platform.

---

## 1. Canonical Longitudinal Master Panel (`data/canonical/anvesha_india_crime_master.parquet` & `data/tamil_nadu/01_tn_crime_master.csv`)

| Column Name | Data Type | Nullable | Unit / Domain | Description & Provenance |
| :--- | :--- | :---: | :--- | :--- |
| `record_id` | String | No | UUIDv4 / Canonical hash | Unique primary key identifying the observation record. |
| `state_ut` | String | No | e.g., `"TAMIL NADU"` | State or Union Territory name (harmonized to uppercase). |
| `district` | String | No | 38 TN Police Units, 700+ All-India | District or Police Commissionerate name. |
| `year` | Integer | No | `2001` – `2023` | Observation reporting year. |
| `crime_category` | String | No | Normalized taxonomy | Standardized crime category (`ALL_CRIME`, `PROPERTY_CRIME`, `VIOLENT_CRIME`, `WOMEN_AND_CHILDREN`, etc.). |
| `crime_count` | Integer | No | Positive integer ($\ge 0$) | Total officially recorded cognizable FIR counts for the unit and year. |
| `population` | Float | Yes | Headcount | Decennial Census count or geometric intercensal projection for the reporting unit. |
| `crime_rate_per_100k` | Float | Yes | Rate per 100,000 citizens | Standardized rate: $(\text{crime\_count} / \text{population}) \times 100,000$. |
| `data_class` | String | No | `"OFFICIAL_OBSERVED"` | Provenance classification verifying audited government data origin. |
| `source_agency` | String | No | `"NCRB"`, `"SCRB_TN"` | Reporting agency responsible for the primary publication. |
| `publication_year` | Integer | No | `2002` – `2024` | Year the official report was gazetted or published. |
| `verification_status`| String | No | `"GOVERNMENT_AUDITED"`, `"CONTINUITY_SERIES"` | Quality status reflecting audit and reconciliation completion. |

---

## 2. Model Feature Matrix (`data/tamil_nadu/04_tn_crime_ml_features.csv` & `data/canonical/india_model_ready_ipc_panel_2001_2023.parquet`)

| Feature Column | Data Type | Nullable | Window / Transformation | Description |
| :--- | :--- | :---: | :--- | :--- |
| `lag_1_crime_count` | Float | No | $t-1$ autoregressive term | Recorded crime volume in the immediately preceding year. |
| `lag_2_crime_count` | Float | No | $t-2$ autoregressive term | Recorded crime volume two years prior. |
| `lag_3_crime_count` | Float | No | $t-3$ autoregressive term | Recorded crime volume three years prior. |
| `rolling_mean_3yr` | Float | No | $\frac{1}{3} \sum_{k=1}^3 y_{t-k}$ | 3-year trailing moving average volume. |
| `rolling_std_3yr` | Float | No | Trailing standard deviation | 3-year volatility/dispersion measure. |
| `yoy_growth_rate` | Float | No | $\frac{y_{t-1} - y_{t-2}}{y_{t-2} + \epsilon}$ | Trailing year-over-year rate of change. |
| `pelt_breakpoint_flag`| Integer | No | Binary $\{0, 1\}$ | Indicator whether a structural break was detected prior to time $t$. |
| `latent_regime_state`| Integer | No | $\{0, 1, 2, 3\}$ | HMM latent regime label estimated strictly from observations $\le t$. |
| `regime_persistence` | Float | No | Years ($\ge 1.0$) | Markov transition persistence parameter $1 / (1 - P_{ii})$. |
| `target_next_year` | Float | No | $y_{t}$ (Lead target) | Ground-truth crime volume for evaluation (masked during inference). |

---

## 3. Empirical Model Comparison Schema (`anvesha_outputs/crimeshift_model_comparison.csv`)

| Column Name | Data Type | Nullable | Units | Description |
| :--- | :--- | :---: | :--- | :--- |
| `Model` | String | No | Model Architecture Name | Name of evaluated model (e.g., `"Naïve T-1"`, `"ARIMA"`, `"50-Epoch MLP"`). |
| `MAE` | Float | No | Cases (FIR count) | Mean Absolute Error on held-out test split (2021–2023). |
| `RMSE` | Float | No | Cases (FIR count) | Root Mean Squared Error on held-out test split. |
| `WAPE` | Float | No | Percentage ($\%$) | Weighted Absolute Percentage Error: $\frac{\sum |y - \hat{y}|}{\sum y} \times 100$. |
| `MASE` | Float | No | Dimensionless ratio | Mean Absolute Scaled Error relative to Naïve persistence baseline. |
| `sMAPE` | Float | No | Percentage ($\%$) | Symmetric Mean Absolute Percentage Error. |
| `R2` | Float | No | Ratio ($\le 1.0$) | Coefficient of Determination on held-out split. |
| `Status` | String | No | `"RECOMMENDED"`, `"EVALUATED"` | Production recommendation certification based on WAPE minimization. |

---

## 4. Conformal Forecast Schema (`anvesha_outputs/crimeshift_conformal_forecasts.csv`)

| Column Name | Data Type | Nullable | Domain | Description |
| :--- | :--- | :---: | :--- | :--- |
| `district` | String | No | District Name | Target police administrative jurisdiction. |
| `crime_category` | String | No | Category Code | Crime category modeled. |
| `forecast_year` | Integer | No | `2026` – `2030` | Forward projection horizon year. |
| `point_forecast` | Float | No | Predicted FIR volume | Primary point projection generated by the recommended persistence model. |
| `lower_95_conformal` | Float | No | Lower bound (cases) | Distribution-free finite-sample 95% conformal lower limit. |
| `upper_95_conformal` | Float | No | Upper bound (cases) | Distribution-free finite-sample 95% conformal upper limit. |
| `picp_empirical` | Float | No | Percentage ($\%$) | Empirically verified coverage probability (92.75% across test units). |
| `calibration_method` | String | No | Algorithm name | Non-exchangeable conformal residual quantile calibration. |
