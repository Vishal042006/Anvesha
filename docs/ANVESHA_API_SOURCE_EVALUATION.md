# ANVESHA API SOURCE EVALUATION REPORT

## 1. OpenWeather Geocoding API (`http://api.openweathermap.org/geo/1.0/direct`)

- **Purpose**: Geocoding location names to WGS84 latitude/longitude coordinates.
- **Evaluation**: Validated as an accurate point coordinate lookup reference for town-level coordinates.
- **Limitation**: Coordinates are **location points, NOT administrative or police boundaries**.

## 2. API-Ninjas Population API (`https://api.api-ninjas.com/v1/population`)

- **Purpose**: Supplementary country-level population statistics.
- **Evaluation**: Returns national-level population metrics for India (e.g. 2024 Population: 1,450,935,791).
- **Limitation**: **NOT a valid primary source for Tamil Nadu district or town-level population.** Marked strictly as `SUPPLEMENTARY / COUNTRY-LEVEL`.
