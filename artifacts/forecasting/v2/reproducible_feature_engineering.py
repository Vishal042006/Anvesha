#!/usr/bin/env python3
"""
ANVESHA V2 — Reproducible Calendar-Aware Feature Engineering Module
Builds strict calendar-aligned temporal lag features (lag_1, lag_2, lag_3, rolling_3, historical_momentum)
without index-shifting defects or temporal leakage across multi-year data gaps.
"""

import os
import pandas as pd
import numpy as np

class Rolling3BaselineModel:
    """Joblib-serializable wrapper for 3-Year Rolling Mean Baseline."""
    def fit(self, X, y=None):
        return self

    def predict(self, X):
        if isinstance(X, pd.DataFrame):
            if 'rolling_3' in X.columns:
                return X['rolling_3'].values
            return X.iloc[:, -1].values
        return np.array(X)[:, -1]

class PreviousYearBaselineModel:
    """Joblib-serializable wrapper for Previous-Year Baseline."""
    def fit(self, X, y=None):
        return self

    def predict(self, X):
        if isinstance(X, pd.DataFrame):
            if 'lag_1' in X.columns:
                return X['lag_1'].values
            return X.iloc[:, 0].values
        return np.array(X)[:, 0]

def generate_calendar_aware_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generate strict calendar-aligned temporal features for ANVESHA forecasting models.
    
    Parameters
    ----------
    df : pd.DataFrame
        Input panel dataframe containing 'district', 'crime_category', 'year', 'crime_count'.
        
    Returns
    -------
    pd.DataFrame
        Copy of input dataframe augmented with calendar-aware lag features:
        ['lag_1', 'lag_2', 'lag_3', 'rolling_3', 'historical_momentum', 'trend_eligibility_reason', 'trend_eligible', 'trend_label']
    """
    # 1. Validate mandatory columns
    required_cols = ['district', 'crime_category', 'year', 'crime_count']
    for col in required_cols:
        if col not in df.columns:
            raise KeyError(f"Input DataFrame missing required column: {col}")

    # 2. Validate uniqueness of (district, crime_category, year) grain
    dups = df.duplicated(subset=['district', 'crime_category', 'year'], keep=False)
    if dups.any():
        dup_rows = df[dups][['district', 'crime_category', 'year']]
        raise ValueError(f"Duplicate (district, crime_category, year) records detected:\n{dup_rows.head()}")

    df_out = df.copy()

    # 3. Construct lookup table mapping (district, crime_category, year) -> crime_count
    # Strict dictionary lookup guarantees exact calendar year matching t-1, t-2, t-3
    series_dict = {}
    for _, row in df_out.iterrows():
        key = (str(row['district']), str(row['crime_category']))
        if key not in series_dict:
            series_dict[key] = {}
        series_dict[key][int(row['year'])] = float(row['crime_count'])

    lags_1, lags_2, lags_3 = [], [], []
    roll_3 = []
    historical_moms = []
    eligibility_reasons = []
    trend_eligibles = []
    trend_labels = []

    # 4. Generate calendar-aware lags per row
    for _, row in df_out.iterrows():
        d = str(row['district'])
        c = str(row['crime_category'])
        t = int(row['year'])
        val_t = float(row['crime_count'])

        lookup = series_dict.get((d, c), {})

        # Calendar year lookup
        val_t1 = lookup.get(t - 1, np.nan)
        val_t2 = lookup.get(t - 2, np.nan)
        val_t3 = lookup.get(t - 3, np.nan)

        lags_1.append(val_t1)
        lags_2.append(val_t2)
        lags_3.append(val_t3)

        # rolling_3: Requires exact presence of t-1, t-2, t-3
        if not np.isnan(val_t1) and not np.isnan(val_t2) and not np.isnan(val_t3):
            r3 = (val_t1 + val_t2 + val_t3) / 3.0
        else:
            r3 = np.nan
        roll_3.append(r3)

        # historical_momentum = (lag_1 - lag_2) / abs(lag_2) when lag_2 exists and lag_2 != 0
        if not np.isnan(val_t1) and not np.isnan(val_t2) and val_t2 != 0.0:
            mom = (val_t1 - val_t2) / abs(val_t2)
        else:
            mom = np.nan
        historical_moms.append(mom)

        # Trend eligibility reason & trend label
        if np.isnan(val_t1):
            reason = "MISSING_PREVIOUS_YEAR"
            is_eligible = False
            label = None
        elif val_t1 == 0.0:
            reason = "ZERO_PREVIOUS_COUNT"
            is_eligible = False
            label = None
        else:
            reason = "VALID_PREVIOUS_YEAR"
            is_eligible = True
            yoy = (val_t - val_t1) / val_t1
            if yoy > 0.05:
                label = 'INCREASING'
            elif yoy < -0.05:
                label = 'DECREASING'
            else:
                label = 'STABLE'

        eligibility_reasons.append(reason)
        trend_eligibles.append(is_eligible)
        trend_labels.append(label)

    # Attach features
    df_out['lag_1'] = lags_1
    df_out['lag_2'] = lags_2
    df_out['lag_3'] = lags_3
    df_out['rolling_3'] = roll_3
    df_out['historical_momentum'] = historical_moms
    df_out['trend_eligibility_reason'] = eligibility_reasons
    df_out['trend_eligible'] = trend_eligibles
    df_out['trend_label'] = trend_labels

    return df_out

if __name__ == "__main__":
    import pandas as pd
    test_data = pd.DataFrame([
        {'district': 'Ariyalur', 'crime_category': 'VIOLENT_CRIME', 'year': 2001, 'crime_count': 100.0},
        {'district': 'Ariyalur', 'crime_category': 'VIOLENT_CRIME', 'year': 2009, 'crime_count': 120.0}, # gap 2002-2008
        {'district': 'Ariyalur', 'crime_category': 'VIOLENT_CRIME', 'year': 2010, 'crime_count': 130.0},
        {'district': 'Ariyalur', 'crime_category': 'VIOLENT_CRIME', 'year': 2011, 'crime_count': 140.0},
        {'district': 'Ariyalur', 'crime_category': 'VIOLENT_CRIME', 'year': 2012, 'crime_count': 150.0},
    ])
    res = generate_calendar_aware_features(test_data)
    print("Test Feature Generation Result:")
    print(res[['year', 'crime_count', 'lag_1', 'lag_2', 'lag_3', 'rolling_3', 'historical_momentum', 'trend_eligibility_reason']])
