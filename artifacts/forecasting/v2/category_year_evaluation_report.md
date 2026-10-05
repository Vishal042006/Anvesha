# ANVESHA V2 — Category & Year Evaluation Report

**Date:** October 03, 2026  
**Selected Model:** `3-Year Rolling Mean Baseline`  
**Test Holdout Period:** 2021–2023 (639 records across 36 TN districts)  

---

## 1. Evaluation by Year

| Year | Sample Count | MAE | RMSE | WAPE (%) | $R^2$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `2021` | 213 | 36.7878 | 105.0757 | 3.2880% | 0.997621 |
| `2022` | 213 | 28.0077 | 69.9338 | 2.5138% | 0.998945 |
| `2023` | 213 | 28.8485 | 76.3956 | 2.5935% | 0.998718 |

---

## 2. Evaluation by Crime Category

| Crime Category | Sample Count | MAE | RMSE | WAPE (%) | $R^2$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CRIME_AGAINST_CHILDREN` | 99 | 0.0209 | 0.0831 | 0.2051% | 0.990057 |
| `CRIME_AGAINST_WOMEN` | 108 | 3.9543 | 12.7115 | 5.5099% | 0.991533 |
| `ECONOMIC_OFFENCES` | 108 | 5.4377 | 10.3582 | 4.3525% | 0.995178 |
| `OTHER_IPC_SLL` | 108 | 127.0059 | 195.1978 | 2.5876% | 0.995546 |
| `PROPERTY_CRIME` | 108 | 33.9265 | 64.3106 | 3.5539% | 0.992852 |
| `VIOLENT_CRIME` | 108 | 14.3432 | 20.5973 | 2.7120% | 0.997314 |
