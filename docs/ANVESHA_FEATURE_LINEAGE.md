# ANVESHA Feature Lineage & Prediction-Time Availability Matrix

**Date:** September 30, 2026  
**Status:** Gate 3 Verified  

| Feature Name | Source Column | Temporal Cutoff | Formula | Leakage Risk |
| :--- | :--- | :--- | :--- | :--- |
| `previous_year_crime` | `crime_count` | Time T-1 | `shift(1)` | NONE (Valid) |
| `lag_2` | `crime_count` | Time T-2 | `shift(2)` | NONE (Valid) |
| `lag_3` | `crime_count` | Time T-3 | `shift(3)` | NONE (Valid) |
| `rolling_mean_3` | `crime_count` | Time T-1 to T-3 | `shift(1).rolling(3).mean()` | NONE (Valid) |
| `rolling_mean_5` | `crime_count` | Time T-1 to T-5 | `shift(1).rolling(5).mean()` | NONE (Valid) |
| `year_over_year_change`| `crime_count` | Time T-1 & T-2 | `(lag_1 - lag_2)/(lag_2+1)*100` | NONE (Valid) |
| `district_baseline_rate`| `crime_count` | Time T-1 & earlier | `shift(1).expanding().mean()` | NONE (Valid) |
| `spatial_lag_neighbor_avg`| `crime_count` | Time T-1 | `mean(neighbor_lag_1)` | NONE (Valid) |
