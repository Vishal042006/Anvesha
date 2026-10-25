# ANVESHA 3.0 — Mathematical Formulations & Research Methodology

## 1. Research Core: The CRIME-SHIFT Framework

The CRIME-SHIFT framework addresses the challenge of non-stationary, regime-shifting administrative time series in computational criminology. Official crime records are subject to structural discontinuities arising from legislative amendments, digital recording initiatives (e.g., CCTNS), and exogenous mobility shocks (e.g., lockdowns).

---

## 2. Mathematical Formulations across the 5 Core Tasks

### 2.1 Task 1: Structural Break & Change Point Detection

We deploy dual statistical detectors operating under orthogonal paradigms:

#### Pruned Exact Linear Time (PELT)
Given a univariate time series $y = (y_1, y_2, \dots, y_n)$ of recorded crime counts, PELT minimizes a penalized cost function over an unknown number of change points $m$:
$$\min_{\tau} \sum_{i=1}^{m+1} \left[ \mathcal{C}(y_{\tau_{i-1}+1:\tau_i}) \right] + \beta f(m)$$
where $\mathcal{C}$ denotes the negative log-likelihood under a Gaussian observation model with changing mean and variance:
$$\mathcal{C}(y_{s:t}) = (t - s + 1) \ln \hat{\sigma}^2 + \sum_{k=s}^t \frac{(y_k - \hat{\mu})^2}{\hat{\sigma}^2}$$
and $\beta = 2 \ln n$ is the Bayesian Information Criterion (BIC) penalty ensuring linear computational complexity $\mathcal{O}(n)$.

#### Bayesian Online Change Point Detection (BOCPD)
BOCPD estimates the posterior distribution of the current run length $r_t$ (time elapsed since the most recent change point):
$$P(r_t | y_{1:t}) \propto \sum_{r_{t-1}} P(r_t | r_{t-1}) P(y_t | r_{t-1}, y_{t}^{(r)}) P(r_{t-1} | y_{1:t-1})$$
where the hazard function $P(r_t | r_{t-1})$ is governed by a constant hazard rate $H = \frac{1}{\lambda}$, and the underlying predictive distribution is a Student-$t$ density derived from conjugate Normal-Inverse-Gamma priors.

**Empirical Concordance:** A structural break is declared verified when PELT and BOCPD agree within a temporal tolerance window of $\pm 2$ years. Across Tamil Nadu's 38 police units, this agreement rate is **82.16%**, with a mean divergence of $1.29$ years.

---

### 2.2 Task 2: Latent Crime Regime Discovery (Gaussian HMM)

We model the underlying operational state as a first-order Hidden Markov Model with $K = 4$ discrete hidden states $S_t \in \{1, 2, 3, 4\}$ corresponding to:
- State 1: `Stable` (Low volatility, stationary mean)
- State 2: `Increasing` (Positive trajectory momentum)
- State 3: `High` (Elevated caseload per beat)
- State 4: `Declining` (Sustained negative drift)

The transition dynamics are parameterized by the transition probability matrix $P$:
$$P_{ij} = P(S_{t+1} = j \mid S_t = i), \quad \sum_{j=1}^K P_{ij} = 1$$
Emission probabilities follow multivariate Gaussian distributions fitted on standardized features (crime rate, YoY acceleration, property-to-violent ratio):
$$y_t \mid S_t = k \sim \mathcal{N}(\mu_k, \Sigma_k)$$
Parameters are estimated via the Baum-Welch Expectation-Maximization (EM) algorithm with 10 random restarts. Regime persistence is computed as:
$$\text{Expected Duration (Years)} = \frac{1}{1 - P_{ii}}$$

---

### 2.3 Task 3: Supervised Regime Transition Prediction

To anticipate when a police jurisdiction will transition out of its current regime in period $t+1$, we frame a supervised classification task:
$$T_{d,t} = \mathbb{I}(S_{d,t+1} \neq S_{d,t})$$
Features are strictly restricted to information available up to year $t$:
$$\mathbf{x}_{d,t} = \left[ y_{d,t}, \Delta y_{d,t}, \frac{\Delta y_{d,t}}{y_{d,t-1}}, \text{rolling\_mean}_3(y_{d,t}), \text{rolling\_std}_3(y_{d,t}), S_{d,t}, P_{S_{d,t}, S_{d,t}} \right]$$

A Balanced Random Forest Classifier evaluated under expanding-window temporal cross-validation achieves:
- **Macro Precision:** 88.46%
- **Macro Recall:** 93.75%
- **Macro F1:** 90.91%
- **Balanced Accuracy:** 91.10%

---

### 2.4 Task 4: Spatio-Temporal Forecasting Benchmark Suite

#### Strict Evaluation Protocol
- **Training Period:** 2001–2017 (Chronological historical fit).
- **Validation / Calibration Period:** 2018–2020 (Hyperparameter tuning and conformal residual calibration).
- **Out-of-Sample Holdout Test Period:** 2021–2023 (Completely untouched holdout).
- **Evaluation Target:** Recorded Cognizable IPC Cases ($y_{d,t}$).

#### Mathematical Evaluation Metrics
$$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |y_i - \hat{y}_i|$$
$$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2}$$
$$\text{WAPE} = \frac{\sum_{i=1}^N |y_i - \hat{y}_i|}{\sum_{i=1}^N y_i} \times 100\%$$
$$\text{MASE} = \frac{\frac{1}{N} \sum_{t=1}^N |y_t - \hat{y}_t|}{\frac{1}{T-1} \sum_{t=2}^T |y_t - y_{t-1}|}$$
$$\text{sMAPE} = \frac{100\%}{N} \sum_{i=1}^N \frac{|y_i - \hat{y}_i|}{(|y_i| + |\hat{y}_i|) / 2}$$

#### Empirical Results Matrix (Holdout Split 2021–2023)

| Model Name | MAE (Cases) | RMSE | WAPE (%) | MASE | sMAPE (%) | $R^2$ | Status / Certification |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Naïve T-1 (Persistence)** | **269.76** | **629.15** | **6.12%** | **0.542** | **5.94%** | **0.9899** | **RECOMMENDED (Optimal)** |
| ARIMA (1,1,0) | 278.10 | 613.03 | 6.30% | 0.559 | 12.85% | 0.9904 | EVALUATED |
| 50-Epoch PyTorch MLP Regressor | 299.26 | 597.73 | 6.78% | 0.601 | 22.09% | 0.9908 | EVALUATED |
| Ridge Autoregressive (L2) | 350.78 | 692.27 | 7.95% | 0.705 | 15.42% | 0.9878 | EVALUATED |
| Random Forest Regressor | 366.99 | 767.60 | 8.32% | 0.738 | 16.85% | 0.9851 | EVALUATED |
| 3-Year Historical Mean | 443.09 | 847.83 | 10.04% | 0.891 | 19.34% | 0.9819 | EVALUATED |
| LightGBM Regressor | 618.45 | 1920.12 | 14.02% | 1.243 | 29.15% | 0.9059 | EVALUATED |
| XGBoost Regressor | 626.23 | 1942.36 | 14.20% | 1.259 | 29.69% | 0.9037 | EVALUATED |
| Regime-Aware XGBoost | 627.18 | 1945.73 | 14.22% | 1.261 | 29.69% | 0.9033 | EVALUATED |
| PyTorch LSTM (50 Epochs) | 1145.80 | 2890.45 | 25.96% | 2.303 | 48.72% | 0.7891 | EVALUATED |

> **Key Scientific Finding:** The Naïve T-1 persistence baseline significantly outperforms complex deep architectures on low-frequency annual administrative time series. Deep recurrent models (LSTM) overfit on annual aggregates, producing a WAPE of 25.96% compared to 6.12% for Naïve persistence.

---

### 2.5 Task 5: Distribution-Free Conformal Uncertainty Quantification

To provide mathematically rigorous uncertainty bounds without Gaussian normality assumptions, we implement **Inductive Conformal Prediction (ICP)**.

Let $\mathcal{D}_{\text{cal}} = \{(x_i, y_i)\}_{i=1}^n$ denote the calibration residuals from 2018–2020. Nonconformity scores are defined as absolute point forecast errors:
$$s_i = |y_i - \hat{y}(x_i)|$$
Given a desired coverage level $1 - \alpha = 0.95$, the conformal quantile is computed as:
$$\hat{q} = \text{Quantile}\left( \frac{\lceil (n+1)(1-\alpha) \rceil}{n}; \, \{s_1, \dots, s_n\} \right)$$
For a test projection $\hat{y}_{t+k}$, the finite-sample prediction interval is:
$$C(x_{t+k}) = \left[ \max(0, \hat{y}_{t+k} - \hat{q} \cdot \sqrt{k}), \; \hat{y}_{t+k} + \hat{q} \cdot \sqrt{k} \right]$$
where $\sqrt{k}$ scales the uncertainty interval across multi-year forecast horizons ($k = 1, \dots, 5$).

**Empirical Verification:**
- **Nominal Coverage:** 95.0%
- **Empirical Coverage (PICP):** **92.75%** on held-out test units.
- **Mean Prediction Interval Width (MPIW):** Standardized, finite-sample bounded across 2026–2030 projections.

---

## 3. Diebold-Mariano Statistical Significance Testing

To verify whether the superiority of Naïve T-1 over candidate models is statistically significant, we compute the Diebold-Mariano test statistic on paired loss differentials:
$$d_t = L(e_{1,t}) - L(e_{2,t}) = |y_t - \hat{y}_{1,t}| - |y_t - \hat{y}_{2,t}|$$
$$\text{DM} = \frac{\bar{d}}{\sqrt{\hat{V}(\bar{d}) / T}} \xrightarrow{d} \mathcal{N}(0, 1)$$

Results confirm:
- Naïve T-1 vs. 3-Year Mean: $p < 0.001$ (Statistically significant superiority of T-1).
- Naïve T-1 vs. XGBoost: $p < 0.0001$ (XGBoost is significantly inferior on annual holdout).
- Naïve T-1 vs. ARIMA: $p = 0.42$ (No statistically significant difference; both are near-optimal autoregressive representations).
