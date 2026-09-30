# ANVESHA POPULATION PHASE DATA FREEZE MANIFEST

## Protected Primary Dataset

- **Path**: `data/04_integrated/anvesha_clean_crime_master.parquet`
- **File Size**: `12912 bytes`
- **SHA256 Checksum**: `768a899b7c5e1df41ce2cd2a90bfe4470c45f9785bd2246e08596c83d610a5b0`
- **Total Validated Rows**: `2640`
- **Columns**: `['state', 'district', 'year', 'crime_category', 'crime_count']`
- **Year Range**: `2001 – 2014`
- **Police Units**: `36`
- **Status**: `FROZEN_AND_PROTECTED`

## Protection Rules

1. `anvesha_clean_crime_master.parquet` MUST NOT be modified, appended to, or overwritten.
2. Population data MUST be maintained in separate metadata and analytical layers.
3. Post-2014 data MUST remain quarantined in `anvesha_2015_2023_candidate.parquet`.
