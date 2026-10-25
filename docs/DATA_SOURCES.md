# ANVESHA 3.0 — Data Sources & Lineage Compendium

## 1. Primary Statistical Data Sources

ANVESHA relies on official governmental statistical series and verified administrative panels. No synthetic datasets are substituted for ground truth observations.

### 1.1 National Crime Records Bureau (NCRB) — Ministry of Home Affairs, Government of India
- **Publication Title:** *Crime in India* (Annual Compendiums, 2001–2014).
- **Format:** Extracted official tabular publications (PDF/CSV/XLSX).
- **Geographic Coverage:** All-India state, union territory, and district level.
- **Temporal Span:** 2001 to 2014 (14 continuous chronological annual reporting cycles).
- **Offence Categories:** Indian Penal Code (IPC) cognizable crimes:
  - Total Cognizable IPC Crimes
  - Violent Crimes (Murder, Attempt to Murder, Culpable Homicide)
  - Property Crimes (Theft, Burglary, Robbery, Dacoity)
  - Crimes Against Women (Rape, Dowry Deaths, Cruelty by Husband/Relatives, Kidnapping & Abduction)
  - Crimes Against Children
  - Economic Offences (Cheating, Forgery, Counterfeiting)
- **Official Caveat (Reporting vs. Incidence):** NCRB figures represent **crimes registered by police** (First Information Reports / FIRs), not the latent true incidence of crime. Registration is sensitive to public reporting willingness, police proactive registration drives, statutory definitions, and administrative recording procedures.

### 1.2 Tamil Nadu State Crime Records Bureau (SCRB) & Departmental Compendiums
- **Publication Series:** Tamil Nadu Police Policy Notes, SCRB Statistical Handbooks, and District Administrative Releases (2015–2023).
- **Format:** Official departmental panels extracted and standardized to 38 canonical police units.
- **Geographic Coverage:** 38 police units (City Commissionerates and District Police jurisdictions) across Tamil Nadu.
- **Temporal Span:** 2015 to 2023 (9 continuous annual observation cycles).
- **Total Master Panel Size:** 17,761 standardized district-year-category observation records across the combined 2001–2023 longitudinal span.
- **Critical Structural Event:** Statewide rollout of the Crime and Criminal Tracking Network & Systems (CCTNS) between 2013 and 2015. This digitized station-level general diaries and FIRs, resulting in an administrative reporting level-shift detected by PELT and BOCPD.

### 1.3 Census of India — Office of the Registrar General & Census Commissioner
- **Primary Source:** Census of India (2001 and 2011 Primary Census Abstracts).
- **Geographic Units:** District-level decennial population counts, urban/rural splits, and literacy rates.
- **Intercensal & Post-2011 Projection Methodology:** Exponential geometric growth model applied to 2001–2011 intercensal compound annual growth rates (CAGR) to project district population denominators for 2012–2023:
  $$P_t = P_{2011} \times (1 + r)^{(t - 2011)}$$
- **Usage:** Used strictly to compute standardized crime rates per 100,000 population:
  $$\text{Crime Rate}_{d,t} = \frac{\text{Recorded Crime Count}_{d,t}}{P_{d,t}} \times 100,000$$
- **Caveat:** Where administrative boundaries have bifurcated post-2011, population denominators are harmonized using sub-district (taluk) aggregations from the 2011 census.

### 1.4 Geospatial Administrative Boundary Datasets
- **Source:** Survey of India Administrative Atlas, corroborated with Data{meet} open spatial repositories and Tamil Nadu Police jurisdiction gazettes.
- **Format:** GeoJSON FeatureCollections (`india_district_boundaries.geojson`, `tamil_nadu_districts.geojson`, and station-level point registries).
- **Coordinate Reference System:** WGS 84 (EPSG:4326).
- **Units Covered:** 38 police administrative jurisdictions, incorporating both City Police Commissionerates (e.g., Greater Chennai Police, Avadi, Tambaram, Coimbatore City, Madurai City, Tiruchirappalli City, Salem City, Tirunelveli City) and rural district headquarters.

---

## 2. Scholarly & Contextual Evidence Sources

### 2.1 Scholarly Literature APIs (OpenAlex, Crossref, Semantic Scholar)
- **OpenAlex API:** Open scholarly catalog querying peer-reviewed research in computational criminology, deterrence theory, and spatial analysis.
- **Semantic Scholar API:** Academic citation graph providing citation counts, paper abstracts, and field of study tags.
- **Crossref API:** DOI verification and publisher metadata resolution.
- **Strict Integration Rule:** External scholarly queries inform qualitative interpretation and evidence retrieval. The AI engine never cites a paper whose DOI or OpenAlex ID has not been resolved against live scholarly endpoints.

### 2.2 Real-Time Local Incident Feeds (GNews & NewsData.io)
- **Role:** Provides situational awareness of immediate localized incidents, seasonal festivals, weather disruptions, or major public order developments.
- **Firewall Rule:** News data is strictly classified as **Reported Incidents / Local Developments**. It is never treated as verified longitudinal statistical ground truth.

---

## 3. Data Governance & Ethical Integrity Rules

1. **Non-Inference of Personal Guilt:** Spatial and temporal crime statistics represent administrative aggregates. They must never be used to profile individuals, predict recidivism, or infer demographic criminality.
2. **Denominators & Fair Comparison:** Raw crime volumes must never be directly compared across jurisdictions with vastly different populations. Standardized rates per 100,000 population are mandatory for comparative analysis.
3. **Traceability:** Every metric displayed in ANVESHA links back to its canonical source record through the `ProvenanceDrawer` component and `/api/v1/provenance` endpoint.
