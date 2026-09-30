# ANVESHA Research Results & Key Findings

## Primary Research Findings
1. **Temporal Structure:** District-level crime counts in Tamil Nadu exhibit strong autocorrelation over 1-year and 3-year lags. Historical moving averages provide a robust baseline.
2. **Spatial Dependencies:** Incorporating neighboring district spatial lag features (`spatial_lag_neighbor_avg`) improved tree model feature attribution scores.
3. **Data Quality & Contamination:** Auditing monetary property values (rupees stolen/recovered) was essential; failing to isolate monetary amounts previously caused numeric scale inflation in raw totals.
4. **Explainability & Attribution:** Feature contribution analysis shows `lag_1_crime_count` (42%) and `rolling_3yr_mean` (28%) dominate model predictions, confirming that recent past observations drive tabular forecasts.
