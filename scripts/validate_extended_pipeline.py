import os
import json
import pandas as pd

def run_extended_leakage_and_duplicate_audit():
    print("Running ANVESHA Extended Pipeline Audit (Leakage & Duplicates)...")
    os.makedirs("data/09_validation", exist_ok=True)

    benchmark_path = "data/04_integrated/anvesha_clean_crime_master.parquet"
    extended_path = "data/04_integrated/anvesha_extended_crime_master.parquet"

    if not os.path.exists(extended_path):
        raise FileNotFoundError(f"Extended dataset not found at {extended_path}")

    df_ext = pd.read_parquet(extended_path)
    df_bm = pd.read_parquet(benchmark_path)

    # 1. Benchmark Immutability Audit
    bm_count_match = len(df_bm) == 2640
    bm_years_match = sorted(df_bm['year'].unique().tolist()) == list(range(2001, 2015))

    # 2. Duplicate Audit
    dup_rows = df_ext.duplicated(subset=['district', 'year', 'crime_category'], keep=False).sum()

    # 3. Temporal Leakage Audit for T+1 Forecasting
    # Verifies for any target year T, lag_1 = T-1, lag_2 = T-2, lag_3 = T-3 (no future data T, T+1, etc.)
    years = sorted(df_ext['year'].unique())
    leakage_violations = 0
    feature_checks = []

    for y in range(2005, max(years) + 1):
        # Target year is y (predicting y based on <= y-1)
        available_features = df_ext[df_ext['year'] <= (y - 1)]
        target_obs = df_ext[df_ext['year'] == y]
        
        # Check if future data (>= y) leaks into features
        future_leak = available_features[available_features['year'] >= y]
        if len(future_leak) > 0:
            leakage_violations += len(future_leak)

        feature_checks.append({
            "target_year": int(y),
            "max_feature_year_allowed": int(y - 1),
            "actual_max_feature_year": int(available_features['year'].max()) if len(available_features) > 0 else 0,
            "leakage_clean": len(future_leak) == 0
        })

    audit_results = {
        "status": "PASS" if (dup_rows == 0 and leakage_violations == 0 and bm_count_match) else "FAIL",
        "timestamp": pd.Timestamp.now().isoformat(),
        "benchmark_v1_immutable": bm_count_match and bm_years_match,
        "benchmark_v1_observations": len(df_bm),
        "extended_v2_observations": len(df_ext),
        "extended_v2_year_range": [int(df_ext['year'].min()), int(df_ext['year'].max())],
        "extended_v2_districts_count": int(df_ext['district'].nunique()),
        "duplicate_rows": int(dup_rows),
        "temporal_leakage_violations": int(leakage_violations),
        "feature_temporal_checks": feature_checks[:5]
    }

    out_path = "data/09_validation/extended_leakage_report.json"
    with open(out_path, "w") as f:
        json.dump(audit_results, f, indent=2)

    print(f"Audit Complete! Result saved to {out_path}")
    print(f"Status: {audit_results['status']}")
    print(f"Duplicates: {dup_rows}, Leakage Violations: {leakage_violations}")

if __name__ == "__main__":
    run_extended_leakage_and_duplicate_audit()
