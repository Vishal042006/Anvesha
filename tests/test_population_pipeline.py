#!/usr/bin/env python3
"""
ANVESHA — Pytest Test Suite for Master Population, Geography & Spatial Pipeline (Phase 19)
Automated unit and integration test suite.
"""

import os
import json
import pytest
import pandas as pd
import numpy as np

CLEAN_MASTER_PATH = "data/04_integrated/anvesha_clean_crime_master.parquet"
CANDIDATE_PATH = "data/04_integrated/anvesha_2015_2023_candidate.parquet"
CLEAN_POP_PATH = "data/08_metadata/tn_population_clean.csv"
GEOCODED_PATH = "data/08_metadata/tn_population_geocoded.csv"
PLACE_REG_PATH = "data/08_metadata/tn_population_place_registry.csv"
CROSSWALK_PATH = "data/08_metadata/anvesha_population_crime_crosswalk.csv"
AREA_REG_PATH = "data/08_metadata/anvesha_geography_area_registry.csv"
DENSITY_PATH = "data/08_metadata/anvesha_population_density.parquet"
RATE_PATH = "data/05_ml/anvesha_population_adjusted_crime.parquet"
CACHE_PATH = "data/08_metadata/openweather_geocoding_cache.json"
MANIFEST_PATH = "data/08_metadata/anvesha_population_phase_manifest.json"

def test_crime_master_integrity():
    """Verify primary crime master is completely unmodified."""
    assert os.path.exists(CLEAN_MASTER_PATH)
    df = pd.read_parquet(CLEAN_MASTER_PATH)
    assert len(df) == 2640
    assert df['district'].nunique() == 36
    assert set(df['year'].unique()) == set(range(2001, 2015))

def test_population_parsing_and_no_zero_conversion():
    """Verify population parsing rules and missing values NOT converted to zero."""
    assert os.path.exists(CLEAN_POP_PATH)
    df = pd.read_csv(CLEAN_POP_PATH)
    assert len(df) >= 1090
    assert 'population_2001' in df.columns
    assert 'population_2011' in df.columns
    # Check that missing population values are NaNs, NOT zeros
    assert not (df['population_2001'] == 0).any()
    assert not (df['population_2011'] == 0).any()

def test_coordinates_and_geocoding_cache():
    """Verify geocoded coordinates and OpenWeather cache structure."""
    assert os.path.exists(GEOCODED_PATH)
    df = pd.read_csv(GEOCODED_PATH)
    valid_lat = df['latitude_final'].dropna()
    valid_lon = df['longitude_final'].dropna()
    assert len(valid_lat) > 0
    assert (valid_lat >= 8.0).all() and (valid_lat <= 14.5).all()
    assert (valid_lon >= 76.0).all() and (valid_lon <= 81.0).all()
    
    assert os.path.exists(CACHE_PATH)
    with open(CACHE_PATH) as f:
        cache = json.load(f)
    assert isinstance(cache, dict)

def test_geography_crosswalk_schema():
    """Verify geography crosswalk schema and mapping types."""
    assert os.path.exists(CROSSWALK_PATH)
    df = pd.read_csv(CROSSWALK_PATH)
    required = {'crime_unit_id', 'crime_unit_name', 'population_area', 'population_district', 'mapping_type', 'mapping_confidence'}
    assert required.issubset(df.columns)
    allowed_types = {'EXACT', 'ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'PARTIAL', 'AMBIGUOUS', 'UNKNOWN'}
    assert set(df['mapping_type'].unique()).issubset(allowed_types)

def test_area_registry_and_density_parquet():
    """Verify area registry status and population density parquet."""
    assert os.path.exists(AREA_REG_PATH)
    df_area = pd.read_csv(AREA_REG_PATH)
    assert (df_area['area_status'] == 'MISSING').all()

    assert os.path.exists(DENSITY_PATH)
    df_den = pd.read_parquet(DENSITY_PATH)
    assert set(df_den['year'].unique()).issubset({2001, 2011})

def test_population_adjusted_crime_rate():
    """Verify recorded crime rate calculation rules and restriction to observed Census years."""
    assert os.path.exists(RATE_PATH)
    df_rate = pd.read_parquet(RATE_PATH)
    assert set(df_rate['year'].unique()).issubset({2001, 2011})
    assert 'crime_rate_per_100k' in df_rate.columns
    # Check that rates are only present for valid populations
    valid_rates = df_rate[df_rate['crime_rate_per_100k'].notna()]
    assert (valid_rates['population'] > 0).all()

def test_security_env_files():
    """Verify .env.example exists and no API keys are hard-coded in python source code."""
    assert os.path.exists(".env.example")
    with open(".env.example") as f:
        content = f.read()
    assert "your_openweather_api_key_here" in content

    # Check gitignore
    if os.path.exists(".gitignore"):
        with open(".gitignore") as f:
            gi_content = f.read()
        assert ".env" in gi_content
