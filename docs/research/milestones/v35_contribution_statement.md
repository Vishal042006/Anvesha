# ANVESHA V3.5 — Formal Research Contribution Statement

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  

---

## Three Defensible Research Contributions

### Contribution 1: Provenance-Aware Dual-Track Architecture for Administrative Crime Intelligence
- **Claim**: Formal separation of verified official ground-truth observations (`Track A`, 2001–2014 NCRB) from candidate synthetic extensions (`Track B`, 2015–2023) prevents synthetic accuracy deflation from masking real-world error margins.
- **Evidence & Result**: Track A ground-truth evaluation yields **WAPE = 20.01%** ($R^2 = 0.8743$), whereas Track B synthetic extension yields **WAPE = 2.80%** ($R^2 = 0.9984$). Dual-track isolation prevents misrepresenting synthetic accuracy as real-world performance.
- **Limitation**: Track A ground truth is constrained to annual district-level compendiums up to 2014.

### Contribution 2: Leakage-Safe Chronological Validation for Autoregressive Persistence in Sparse Panels
- **Claim**: In sparse administrative crime panels, simple non-parametric persistence baselines ($T-1$) match or outperform complex parametric and tree ensemble models when evaluated under leakage-safe chronological expanding-window backtesting.
- **Evidence & Result**: Previous-Year Persistence ($T-1$) achieves **MAE = 171.50, WAPE = 16.58%, $R^2 = 0.9142$** across N=2,007 out-of-sample predictions (2004–2014), outperforming Ridge (MAE 185.25), Rolling Mean (MAE 190.49), and HistGradientBoosting (MAE 229.99). Controlled ablation confirms historical lags account for >93.5% of variance.
- **Limitation**: Applies to aggregate annual district series; fine-grained spatial micro-forecasting requires sub-district event coordinates.

### Contribution 3: Evidence-Grounded Explanation Engine with Non-Causal Ethical Safeguards
- **Claim**: Direct integration of dense semantic retrieval (BAAI/bge-m3) linking statistical volume anomalies to peer-reviewed scholarly literature provides transparent, non-vague guidance with strict non-causal safeguards.
- **Evidence & Result**: Output pipeline enforces 7 distinct provenance categories, explicitly separating measured observations, model forecasts, and external paper DOIs, while systematically preventing individual risk profiling or causal misattribution.
- **Limitation**: Retrieval quality depends on coverage of open-access scholarly databases.
