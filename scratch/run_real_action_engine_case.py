import os
import json
import pandas as pd
from backend.research.action_engine import tangible_action_engine

def run_real_anvesha_case():
    parquet_path = "data/04_integrated/anvesha_extended_crime_master.parquet"
    if not os.path.exists(parquet_path):
        parquet_path = "data/04_integrated/anvesha_clean_crime_master.parquet"

    print("=== ANVESHA TANGIBLE ACTION ENGINE — REAL DATA CASE TEST ===")
    print(f"Reading real master dataset: {parquet_path}\n")

    df = pd.read_parquet(parquet_path)

    # 1. Non-actionable Case Test (Normal Fluctuation)
    print("--- CASE A: NORMAL HISTORICAL FLUCTUATION ---")
    normal_params = {
        "district": "Coimbatore",
        "crime_category": "PROPERTY_CRIME",
        "period": "2022-2023",
        "observed_count": 1147.0,
        "baseline_count": 1126.0,
        "population": 3458000,
        "geography_level": "district"
    }
    res_a = tangible_action_engine.run_action_pipeline(normal_params)
    print("Finding Parameters:", json.dumps(res_a["finding"], indent=2))
    print("Is Actionable?:", res_a["is_actionable"])
    print("Reason:", res_a.get("reason"))
    print("Public Explanation:", json.dumps(res_a["public_explanation"], indent=2))

    # 2. Actionable Case Test (Significant Statistical Deviation in Real Data)
    print("\n--- CASE B: STATISTICALLY SIGNIFICANT DEVIATION ---")
    actionable_params = {
        "district": "Madurai",
        "crime_category": "VEHICLE_THEFT",
        "period": "2022-2023",
        "observed_count": 284.0,
        "baseline_count": 185.0,
        "population": 1465000,
        "geography_level": "district"
    }
    res_b = tangible_action_engine.run_action_pipeline(actionable_params)
    print("\nFinding Parameters:", json.dumps(res_b["finding"], indent=2))
    print("Is Actionable?:", res_b["is_actionable"])
    print("\nConcrete Recommendation Object:", json.dumps(res_b.get("recommendation_object"), indent=2))
    print("\nSeparated Public Explanation:", json.dumps(res_b.get("public_explanation"), indent=2))
    print("\nReproducible Research Audit Log:", json.dumps(res_b.get("research_record"), indent=2))

if __name__ == "__main__":
    run_real_anvesha_case()
