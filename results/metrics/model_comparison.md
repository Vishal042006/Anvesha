| Model           | Family        |   MAE ↓ |   RMSE ↓ |   WAPE (%) ↓ |    R² ↑ | Best Epoch   |
|:----------------|:--------------|--------:|---------:|-------------:|--------:|:-------------|
| Ridge           | Classical     |  118.75 |   142.03 |         3.8  |  0.9844 | N/A          |
| Random Forest   | Classical     |  124.17 |   149.29 |         3.97 |  0.9829 | N/A          |
| 3-Year Mean     | Baseline      |  127.06 |   153.16 |         4.07 |  0.982  | N/A          |
| T-1 Persistence | Baseline      |  145.51 |   177.15 |         4.66 |  0.9757 | N/A          |
| MLP             | Deep Learning | 1324.45 |  1504.13 |        43.1  | -1.1414 | 40.0         |
| LSTM            | Deep Learning | 3044.32 |  3256.87 |        97.85 | -6.9209 | 40.0         |