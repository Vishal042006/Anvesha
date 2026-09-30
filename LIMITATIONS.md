# ANVESHA Limitations & Responsible AI Guidelines

## Methodological Limitations
1. **Annual Temporal Resolution:** Original SCRB/NCRB source data is published on an annual cycle (2001–2023), resulting in 23 temporal steps. This restricts deep learning models (LSTM/Transformers) which require higher sequence lengths.
2. **Administrative Boundary Evolution:** District re-organizations in Tamil Nadu (e.g. splitting of districts like Kallakurichi, Chengalpattu, Tenkasi, Ranipet, Tirupathur) require boundary mapping alignment.
3. **Statistical Anomalies vs Reality:** Anomaly detection outputs represent mathematical deviations from historical baselines (`STATISTICAL_ANOMALY`). They must NOT be interpreted as "dangerous districts" or used for predictive policing of individuals.

## Responsible AI & Ethical Directives
- **No Individual Criminality Prediction:** ANVESHA strictly models aggregated district-level statistical crime counts. It does NOT predict individual criminality, recidivism, or personal guilt.
- **Correlations vs Causation:** Feature importance scores reflect statistical association in tree models, not legal or sociological causation.
- **Auditability:** Every output provides explicit provenance citations linking back to original SCRB/NCRB government records.
