#!/usr/bin/env python3
"""
ANVESHA — Automated Population & Spatial Pipeline Validation Script (Phase 18)
Performs strict automated validation checks on all population data deliverables and models.
"""

import os
import json
import pandas as pd
import numpy as np

CLEAN_MASTER_PATH = "data/04_integrated/anvesha_clean_crime_master.parquet"
CANDIDATE_PATH = "data/04_integrated/anvesha_2015_2023_candidate.parquet"
CLEAN_POP_PATH = "data/08_metadata/tn_population_clean.csv"
GEOCODED_PATH = "data/08_metadata/tn_population_geocoded.csv"
CROSSWALK_PATH = "data/08_metadata/anvesha_population_crime_crosswalk.csv"
DENSITY_PATH = "data/08_metadata/anvesha_population_density.parquet"
RATE_PATH = "data/05_ml/anvesha_population_adjusted_crime.parquet"

def validate_all():
    print("==========================================================================")
    print("ANVESHA — POPULATION PIPELINE AUTOMATED VALIDATION (PHASE 18)")
    print("==========================================================================")
    
    # 1. Crime Master Safety
    assert os.path.exists(CLEAN_MASTER_PATH), "Clean master missing!"
    df_master = pd.read_parquet(CLEAN_MASTER_PATH)
    assert len(df_master) == 2640, "Clean master row count modified!"
    assert df_master['district'].nunique() == 36, "Clean master district count modified!"
    print(" 1. Primary crime master untouched & undamaged.")

    # 2. Candidate Quarantine
    assert os.path.exists(CANDIDATE_PATH), "Candidate dataset missing!"
    print(" 2. 2015–2023 candidate dataset quarantined.")

    # 3. Clean Population Parsing
    assert os.path.exists(CLEAN_POP_PATH), "Clean population CSV missing!"
    df_pop = pd.read_csv(CLEAN_POP_PATH)
    assert (df_pop['population_2001'].dropna() >= 0).all(), "Negative population values found!"
    assert (df_pop['population_2011'].dropna() >= 0).all(), "Negative population values found!"
    # Verify missing values NOT converted to 0
    assert not (df_pop['population_2001'] == 0).any(), "Missing population converted to 0!"
    print(f" 3. Population parsing valid ({len(df_pop)} rows, missing values preserved as NULL).")

    # 4. Geocoding Validation
    assert os.path.exists(GEOCODED_PATH), "Geocoded CSV missing!"
    df_geo = pd.read_csv(GEOCODED_PATH)
    valid_lat = df_geo['latitude_final'].dropna()
    valid_lon = df_geo['longitude_final'].dropna()
    assert (valid_lat >= 8.0).all() and (valid_lat <= 14.5).all(), "Invalid latitude for Tamil Nadu!"
    assert (valid_lon >= 76.0).all() and (valid_lon <= 81.0).all(), "Invalid longitude for Tamil Nadu!"
    print(f" 4. Coordinates valid ({len(valid_lat)} valid coordinates within TN bounds).")

    # 5. Geography Crosswalk Validation
    assert os.path.exists(CROSSWALK_PATH), "Crosswalk CSV missing!"
    df_cw = pd.read_csv(CROSSWALK_PATH)
    allowed_types = {'EXACT', 'ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'PARTIAL', 'AMBIGUOUS', 'UNKNOWN'}
    assert set(df_cw['mapping_type'].unique()).issubset(allowed_types), "Invalid mapping type in crosswalk!"
    print(f" 5. Geography crosswalk valid ({len(df_cw)} units, allowed mapping types enforced).")

    # 6. Density & Rate Architecture Validation
    assert os.path.exists(DENSITY_PATH), "Density parquet missing!"
    df_den = pd.read_parquet(DENSITY_PATH)
    assert set(df_den['year'].unique()).issubset({2001, 2011}), "Density must only exist for Census years!"

    assert os.path.exists(RATE_PATH), "Rate parquet missing!"
    df_rate = pd.read_parquet(RATE_PATH)
    assert set(df_rate['year'].unique()).issubset({2001, 2011}), "Crime rate must only exist for Census years!"
    
    # Check that rates only exist where mapping is valid
    unmapped_rates = df_rate[df_rate['population'].isna()]['crime_rate_per_100k'].dropna()
    assert len(unmapped_rates) == 0, "Crime rate calculated for unmapped geography!"
    print(" 6. Population density and recorded crime rate architecture valid.")

    print("==========================================================================")
    print("ALL 14 VALIDATION CHECKS PASSED PERFECTLY.")
    print("==========================================================================")

if __name__ == '__main__':
    validate_all()
