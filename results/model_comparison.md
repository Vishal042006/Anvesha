| Model           | Family        |   MAE ↓ |   RMSE ↓ |   WAPE (%) ↓ |    R² ↑ | Best Epoch   | Status   |
|:----------------|:--------------|--------:|---------:|-------------:|--------:|:-------------|:---------|
| Ridge           | Classical     |  115.22 |   137.86 |         3.69 |  0.9853 | N/A          | VERIFIED |
| Random Forest   | Classical     |  121.46 |   146.21 |         3.89 |  0.9836 | N/A          | VERIFIED |
| Extra Trees     | Classical     |  124.31 |   148.84 |         3.98 |  0.983  | N/A          | VERIFIED |
| HistGB          | Classical     |  124.36 |   150.06 |         3.98 |  0.9828 | N/A          | VERIFIED |
| 3-Year Mean     | Baseline      |  127.06 |   153.16 |         4.07 |  0.982  | N/A          | VERIFIED |
| T-1 Persistence | Baseline      |  145.51 |   177.15 |         4.66 |  0.9757 | N/A          | VERIFIED |
| MLP             | Deep Learning | 1224.61 |  1412.62 |        39.72 | -0.7135 | 40.0         | VERIFIED |
| LSTM            | Deep Learning | 3044.42 |  3256.96 |        97.85 | -6.9214 | 40.0         | VERIFIED |
| GRU             | Deep Learning | 3044.57 |  3257.1  |        97.85 | -6.922  | 40.0         | VERIFIED |