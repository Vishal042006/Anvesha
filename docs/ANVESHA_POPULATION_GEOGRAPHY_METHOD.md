# ANVESHA POPULATION GEOGRAPHY METHODOLOGY

## Crosswalk Architecture

The population-to-crime geography crosswalk maps **36 historical Tamil Nadu police reporting units** (2001–2014) against Census town-level population aggregations.

## Mapping Principles

1. **Town $\neq$ Police Unit**: Individual town populations cannot be assumed equal to police district jurisdictions.
2. **City Commissionerates**: Police Commissionerates (Chennai City, Coimbatore City, Madurai City, Salem City, Tiruchirappalli City, Tirunelveli City, Tiruppur City) cover urban police jurisdictions. Since census files provide town-level granularity, Commissionerates are mapped as `PARTIAL` with a confidence score of `0.5`.
3. **District Police Units**: 29 rural/district police units map to district-level Census town aggregates (`ONE_TO_ONE`, confidence `0.9`).

## Area Data Status

Official area data (`area_km2`) is marked `MISSING` because authoritative GIS shapefiles or official police gazetteers for 2001–2014 police jurisdictions are not present in the current workspace.
