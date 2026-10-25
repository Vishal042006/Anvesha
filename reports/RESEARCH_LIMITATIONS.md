# ANVESHA 3.0 — RESEARCH LIMITATIONS, METHODOLOGICAL CAVEATS & ETHICAL GUIDELINES

**Evaluation Standard:** Epistemological Rigor & Responsible AI Governance  
**Scope:** CRIME-SHIFT Research Engine, Forecasting Benchmarks, Latent Regimes & Decision Support

---

## 1. Temporal Resolution & Sample Size Constraints

### 1.1 Low-Frequency Annual Observations
- **Data Reality:** Official NCRB and SCRB district crime statistics in India are published exclusively at **annual frequency**. For any given district, the historical panel spanning 2001 to 2023 provides exactly **23 temporal observations**.
- **Model Capacity Implications:**
  - Modern deep neural networks (e.g., PyTorch LSTMs, Transformers) typically require thousands of sequence steps to generalize effectively without severe overfitting.
  - With $N = 23$ per unit (Train: 17, Val: 3, Test: 3), high-capacity models easily memorize spurious idiosyncratic noise in the training set, explaining why complex architectures (LSTM RMSE: 5595.6, LightGBM RMSE: 6820.1) underperform simple autoregressive and persistence baselines (Naïve T-1 RMSE: 1399.7; ARIMA RMSE: 1056.5).
  - **Scientific Directive:** High benchmark scores achieved by complex models on small annual panels must be interpreted cautiously. Parsimonious baselines remain the scientifically defensible default for operational deployment.

---

## 2. Institutional Reporting Artifacts vs. Real Crime Incidence

### 2.1 The "Dark Figure" of Crime
- Official police statistics record **formally registered First Information Reports (FIRs)**. They do not capture unmeasured victimizations that go unreported due to social stigma, fear of retaliation, geographic distance, or informal community dispute resolution.
- An increase in recorded crime often reflects **improved citizen reporting confidence, lower registration friction, or targeted proactive enforcement drives** (e.g., special crackdowns on narcotics or gambling) rather than a deterioration in public safety.

### 2.2 The 2014–2016 CCTNS Transition
- Between 2014 and 2016, Tamil Nadu transitioned to computerized General Diaries and mandatory online FIR registration under the Crime and Criminal Tracking Network & Systems (CCTNS).
- This reform sharply reduced informal non-registration ("burking"), causing an apparent statistical surge in recorded offenses.
- **Methodological Caveat:** Statistical change-points detected during 2014–2016 must be interpreted as **administrative reporting improvements**, not escalations in actual criminal conduct.

---

## 3. Demographic Denominator Uncertainties

### 3.1 Postponement of the 2021 Decennial Census
- The Census of India 2021 was postponed due to the COVID-19 pandemic. Consequently, all district population denominators from 2012 through 2023 represent mathematical projections from the 2001 and 2011 Censuses.
- **Urban Growth Variance:** Rapidly industrializing districts (e.g., Coimbatore Urban, Chengalpattu, Sriperumbudur) have experienced higher in-migration than captured by uniform geometric compounding.
- As a result, population-adjusted crime rates for post-2020 years carry an estimated margin of error of $\pm 4.5\%$.

---

## 4. Conformal Prediction & Exchangeability Assumptions

### 4.1 Theoretical Exchangeability vs. Temporal Reality
- Conformal prediction theory guarantees finite-sample coverage guarantees ($1 - \alpha$) under the assumption of **exchangeability** of data points (e.g., i.i.d. draws).
- Crime time series violate exchangeability due to:
  1. **Temporal Autocorrelation:** Crime in year $t$ depends on year $t-1$.
  2. **Non-Stationarity & Regime Shifts:** Institutional changes, legislative shifts, and global events (e.g., 2020 COVID lockdowns) alter the underlying data-generating distribution.
- **Audit Clarification:** The observed 90.0% coverage on Tamil Nadu test observations and 92.75% coverage across All-India observations is **empirically validated** on the held-out test split, but cannot be characterized as an unconditional theoretical guarantee.

---

## 5. Causal Inference Boundaries

### 5.1 Change-Point Detection is Not Causal Proof
- Algorithms like PELT and BOCPD identify the **timing of structural breaks** in the conditional mean or variance of a time series.
- Detecting a change-point in 2015 does not prove that CCTNS *caused* the break; it merely establishes temporal correlation.
- **Scientific Directive:** Without formal quasi-experimental designs (e.g., Difference-in-Differences, Synthetic Control, or Instrumental Variables), ANVESHA does not assert causal claims. Hypotheses regarding policy impacts are presented as descriptive context rather than verified causal mechanisms.

---

## 6. Ethical Governance & Non-Punitive Decision Support

### 6.1 Avoidance of Discriminatory Feedback Loops
- In predictive policing, deploying algorithms that predict future crimes based solely on historical arrests can generate pernicious self-fulfilling feedback loops: more patrols sent to historically over-policed neighborhoods generate more arrests, which algorithms misinterpret as inherently higher criminality.
- **ANVESHA Design Safeguards:**
  1. ANVESHA operates at the **macro administrative level** (police districts and jurisdictions), never at individual, familial, or granular street-block levels.
  2. The system does not profile individuals, ethnic communities, castes, or social groups.
  3. Outputs are explicitly framed for **preventive resource allocation** (e.g., traffic safety infrastructure, lighting, women's helpline staffing, forensic support), not aggressive pre-emptive interdiction.

### 6.2 The Statistical Firewall for Generative AI
- Large Language Models are prone to confabulation (hallucination) when prompted directly with quantitative questions.
- **Architecture Mandate:** In ANVESHA, the LLM is isolated behind a strict statistical firewall. Qwen 2.5 is permitted only to synthesize and contextualize precomputed statistical indicators and verified academic literature from OpenAlex/Crossref. The LLM is never permitted to calculate figures or invent non-existent legal or criminological citations.

---

## 7. Summary
ANVESHA 3.0 provides transparent, reproducible, and mathematically rigorous crime intelligence while openly documenting the epistemological limits of public statutory data. By adhering to these guidelines, researchers and law enforcement leaders can leverage the platform for evidence-grounded planning without succumbing to algorithmic overconfidence.
