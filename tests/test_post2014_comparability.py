#!/usr/bin/env python3
"""
ANVESHA — Pytest Test Suite for 2015–2023 Data Harmonization & Comparability
Verifies that:
1. Primary 2001–2014 clean master is untouched and undamaged.
2. Crosswalk metadata tables exist and follow exact schema standards.
3. Strict comparable subset parquet is valid and quarantined.
4. Measurement taxonomy correctly cataloged all extracted tables.
5. All required documentation deliverables exist.
"""

import os
import pytest
import pandas as pd

CLEAN_MASTER_PATH = "data/04_integrated/anvesha_clean_crime_master.parquet"
CANDIDATE_PATH = "data/04_integrated/anvesha_2015_2023_candidate.parquet"
COMPARABLE_SUBSET_PATH = "data/04_integrated/anvesha_post2014_comparable_subset.parquet"
GEO_CROSSWALK_PATH = "data/08_metadata/tn_historical_geography_crosswalk.csv"
TAX_CROSSWALK_PATH = "data/08_metadata/crime_taxonomy_crosswalk_post2014.csv"
MEAS_TAXONOMY_PATH = "data/09_validation/post2014_measurement_taxonomy.csv"
POP_REQS_PATH = "data/08_metadata/population_data_requirements.md"

DOCS = [
    "docs/ANVESHA_POST2014_DATA_INVENTORY.md",
    "docs/ANVESHA_POST2014_INTEGRATION_READINESS.md",
    "docs/ANVESHA_2015_2023_RESEARCH_DECISION.md"
]

def test_clean_master_unmodified():
    """Verify that primary 2001-2014 forecasting master was NOT modified or contaminated."""
    assert os.path.exists(CLEAN_MASTER_PATH), f"Master dataset missing at {CLEAN_MASTER_PATH}"
    df_master = pd.read_parquet(CLEAN_MASTER_PATH)
    assert len(df_master) == 2640, f"Expected 2640 rows in clean master, got {len(df_master)}"
    assert set(df_master['year'].unique()) == set(range(2001, 2015)), "Years must be 2001-2014"
    assert df_master['district'].nunique() == 36, "Must contain exactly 36 police units"
    assert set(df_master.columns) == {'state', 'district', 'year', 'crime_category', 'crime_count'}

def test_historical_geography_crosswalk():
    """Verify geography crosswalk metadata file format and allowed mapping types."""
    assert os.path.exists(GEO_CROSSWALK_PATH), f"Crosswalk missing at {GEO_CROSSWALK_PATH}"
    df_cw = pd.read_csv(GEO_CROSSWALK_PATH)
    required_cols = {'historical_unit', 'modern_unit', 'mapping_type', 'valid_from', 'valid_to', 'source', 'confidence', 'notes'}
    assert required_cols.issubset(df_cw.columns), f"Missing columns in {GEO_CROSSWALK_PATH}"
    
    allowed_types = {'EXACT', 'ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'PARTIAL', 'UNKNOWN'}
    assert set(df_cw['mapping_type'].unique()).issubset(allowed_types), "Invalid mapping type found in geography crosswalk"

def test_crime_taxonomy_crosswalk():
    """Verify crime taxonomy crosswalk file format and allowed mapping types."""
    assert os.path.exists(TAX_CROSSWALK_PATH), f"Taxonomy crosswalk missing at {TAX_CROSSWALK_PATH}"
    df_tx = pd.read_csv(TAX_CROSSWALK_PATH)
    required_cols = {'legacy_category', 'post2014_category', 'mapping_type', 'legal_basis', 'source', 'confidence', 'notes'}
    assert required_cols.issubset(df_tx.columns), f"Missing columns in {TAX_CROSSWALK_PATH}"

    allowed_types = {'EXACT', 'AGGREGATABLE', 'PARTIAL', 'NON_EQUIVALENT', 'UNKNOWN'}
    assert set(df_tx['mapping_type'].unique()).issubset(allowed_types), "Invalid mapping type in taxonomy crosswalk"

def test_measurement_taxonomy():
    """Verify measurement taxonomy cataloging."""
    assert os.path.exists(MEAS_TAXONOMY_PATH), f"Measurement taxonomy missing at {MEAS_TAXONOMY_PATH}"
    df_meas = pd.read_csv(MEAS_TAXONOMY_PATH)
    assert len(df_meas) > 0, "Measurement taxonomy must not be empty"
    allowed_meas = {
        'INCIDENT_COUNT', 'VICTIM_COUNT', 'ARREST_COUNT', 'DISPOSAL_COUNT',
        'PENDENCY', 'CHARGESHEET_RATE', 'CRIME_RATE', 'POPULATION', 'PROPERTY_VALUE', 'CONVICTION', 'OTHER', 'UNKNOWN'
    }
    assert set(df_meas['measurement_type'].unique()).issubset(allowed_meas), "Invalid measurement type found"

def test_comparable_subset_parquet():
    """Verify strict comparable subset parquet dataset exists and maintains provenance."""
    assert os.path.exists(COMPARABLE_SUBSET_PATH), f"Comparable subset missing at {COMPARABLE_SUBSET_PATH}"
    df_sub = pd.read_parquet(COMPARABLE_SUBSET_PATH)
    if not df_sub.empty:
        required_prov = {'source_document', 'source_year', 'normalized_geography', 'canonical_category', 'measurement_type', 'numeric_value', 'provenance_flag', 'validation_status'}
        assert required_prov.issubset(df_sub.columns), "Provenance columns missing in comparable subset"
        assert (df_sub['measurement_type'] == 'INCIDENT_COUNT').all(), "Comparable subset MUST contain only INCIDENT_COUNT measurements"
        assert (df_sub['numeric_value'] >= 0).all(), "Values in subset must be non-negative"

def test_documentation_deliverables_exist():
    """Verify all 4 Markdown documentation deliverables exist and are non-empty."""
    for doc in DOCS + [POP_REQS_PATH]:
        assert os.path.exists(doc), f"Documentation file missing: {doc}"
        assert os.path.getsize(doc) > 100, f"Documentation file is empty: {doc}"
