# ANVESHA Forecast Model Comparison Benchmark

| Model | Task | MAE | RMSE | WAPE | R² | Training Time | Inference Time | Epochs | Best Epoch | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| T-1 Persistence | Forecast | 2130.33 | 15910.86 | 24.78% | 0.7538 | 0.0000s | 0.00000s | N/A | N/A | COMPLETED |
| 3-Year Mean | Forecast | 2490.87 | 13376.32 | 28.97% | 0.8260 | 0.0000s | 0.00000s | N/A | N/A | COMPLETED |
| Ridge | Forecast | 2257.41 | 13540.43 | 26.26% | 0.8217 | 0.0171s | 0.00030s | N/A | N/A | COMPLETED |
| Random Forest | Forecast | 3671.89 | 16060.54 | 42.71% | 0.7491 | 0.1138s | 0.00963s | N/A | N/A | COMPLETED |
| XGBoost | Forecast | 3899.27 | 18332.81 | 45.35% | 0.6731 | 0.1105s | 0.00284s | N/A | N/A | COMPLETED |
| LightGBM | Forecast | 4227.53 | 19198.08 | 49.17% | 0.6416 | 0.0246s | 0.00294s | N/A | N/A | COMPLETED |
| MLP | Forecast | 8585.34 | 33136.17 | 99.86% | -0.0678 | 0.2408s | 0.00012s | 30 | 30 | COMPLETED |
| LSTM | Forecast | 8597.06 | 33198.46 | 99.99% | -0.0719 | 0.0581s | 0.00033s | 30 | 30 | COMPLETED |
