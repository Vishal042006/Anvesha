# ANVESHA V3.4 — Target-A Label Integrity Audit

**Audit Date:** October 05, 2026  
**Auditor:** Senior Statistical Evaluator & ML Scientist  

---

## 1. Target A Label Distribution & Definition

Target A is defined strictly using the original YoY $\pm 5\%$ threshold:
- `INCREASING`: $(C_t - C_2022) / C_2022 \ge +0.05$
- `DECREASING`: $(C_t - C_2022) / C_2022 \le -0.05$
- `STABLE`: $-0.05 < (C_t - C_2022) / C_2022 < 0.05$

### Overall Panel Class Distribution (N = 3053):
- `STABLE`: 1628 (53.32%)
- `DECREASING`: 645 (21.13%)
- `INCREASING`: 780 (25.55%)

---

## 2. Threshold Borderline & Noise Analysis

- **Borderline Observations ($\pm 3\%$ to $\pm 7\%$)**: 556 observations (18.21% of dataset).
- **Small Count Volatility**: On low-count categories (e.g., Economic Offences with $C_{t-1} = 10$), a 1-incident change represents a $10\%$ swing, converting minor stochastic fluctuations into directional labels.

---

## 3. Label Breakdown by Year and Category

### Breakdown by Category:
```
label_A                 DECREASING  INCREASING  STABLE
crime_category                                        
CRIME_AGAINST_CHILDREN           6           0     302
CRIME_AGAINST_WOMEN            187         177     185
ECONOMIC_OFFENCES              136         184     229
OTHER_IPC_SLL                   74         130     345
PROPERTY_CRIME                 136         142     271
VIOLENT_CRIME                  106         147     296
```

### Breakdown by Year:
```
label_A  DECREASING  INCREASING  STABLE
year                                   
2007             47          85      42
2008             50          67      57
2009             75          44      55
2010             40          83      57
2011             64          50      66
2012             64          61      61
2013             62          64      60
2014             48          91      16
2015             17          19     129
2016             20          29     116
2017             22          28     115
2018             20          19     126
2019             23          27     115
2020             22          31     127
2021             25          25     163
2022             27          31     155
2023             19          26     168
```
