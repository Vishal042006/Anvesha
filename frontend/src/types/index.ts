export interface TrackMetrics {
  name: string;
  evaluation_period: string;
  sample_count: number;
  source_provenance: string;
  metrics: {
    MAE: number;
    RMSE: number;
    WAPE_pct: number;
    R2: number;
  };
  limitations: string;
}

export interface SummaryData {
  total_observations: number;
  total_recorded_crimes: number;
  provenance_breakdown?: {
    official_observed_count: number;
    official_observed_period?: string;
    official_period?: string;
    synthetic_candidate_count: number;
    synthetic_gapfill_count?: number;
    synthetic_candidate_period?: string;
    synthetic_period?: string;
  };
  police_units_count: number;
  police_units: string[];
  categories_count: number;
  crime_categories: string[];
  year_range: [number, number];
  validated_years: number[];
  latest_validated_year: number;
  category_totals: Record<string, number>;
  yearly_totals: Record<number, number>;
  temporal_breakdown?: {
    benchmark_period: string;
    extended_period: string;
    gap_period: string;
    evidence_period: string;
    road_safety_period: string;
    complaints_period: string;
  };
  research_status?: {
    forecasting_benchmark: string;
    certification: string;
    population_layer: string;
  };
}

export interface SummaryResponse {
  status: string;
  certification_status?: string;
  metadata?: {
    dataset: string;
    validated: boolean;
    dataset_layer: string;
    sha256_verified: boolean;
    certification?: string;
  };
  data?: SummaryData;
}

export interface CategorySummaryResponse {
  status: string;
  data?: {
    categories: any[];
    count: number;
  };
}

export interface DistrictAnalyticsResponse {
  status: string;
  metadata?: {
    district: string;
    dataset_layer: string;
    validated_period: string;
  };
  data?: {
    district: string;
    state_ut?: string;
    geo_id?: string;
    latest_validated_year?: number;
    latest_year?: number;
    data_coverage?: string;
    historical_crime?: Array<{ year: number; crime_count: number; data_type?: string; is_synthetic?: boolean; provenance?: string }>;
    historical_trajectory?: Array<{ year: number; crime_count: number; data_type?: string; is_synthetic?: boolean; provenance?: string }>;
    crime_categories?: Record<string, number>;
    latest_crime_count?: number;
    latest_volume?: number;
    year_over_year_change_pct?: number;
    yoy_change_pct?: number;
    trend: string;
    data_status?: string;
    population_info?: {
      population_2001?: number | null;
      population_2011?: number | null;
      mapping_type?: string;
      mapping_confidence?: number;
      notes?: string;
    };
  };
}

export interface ForecastResponse {
  district: string;
  crime_category: string;
  prediction_year: number;
  status: string;
  status_message?: string;
  predicted_count: number | null;
  predicted_rate: number | null;
  model: string;
  model_version: string;
  training_period: string;
  data_type?: string;
  input_provenance?: string;
  lags_used?: Record<string, number | null>;
  uncertainty_available: boolean;
  lower_bound: number | null;
  upper_bound: number | null;
  explanations: Array<{
    feature: string;
    value: number;
    contribution: number;
    direction: string;
  }>;
  data_sources: string[];
  provenance_id: string;
  history?: Array<{ year: number; crime_count: number }>;
  evaluation_summary?: {
    track_a_official?: TrackMetrics;
    track_b_extended?: TrackMetrics;
  };
  limitations_disclaimer?: string;
}

export interface AnomalyItem {
  district: string;
  year: number;
  crime_category: string;
  observed_count: number;
  historical_baseline: number;
  anomaly_score: number;
  anomaly_flag: boolean;
  anomaly_method: string;
  data_type?: string;
  provenance_type?: string;
  source_provenance?: string;
  supporting_features: {
    z_score?: number;
    percentage_deviation?: number;
    historical_max?: number;
  };
  provenance_id: string;
  legal_disclaimer?: string;
}

export interface AnomalyResponse {
  total_anomalies: number;
  anomalies: AnomalyItem[];
  evaluation_metrics?: {
    train_observations: number;
    test_observations: number;
    anomalies_detected: number;
    anomaly_rate_pct: number;
    limitations: string;
  };
}

export interface TrendItem {
  district: string;
  crime_category: string;
  latest_year: number;
  previous_year: number;
  latest_count: number;
  previous_count: number;
  yoy_change_pct: number;
  trend_direction: string;
  trend_eligible: boolean;
  model_confidence?: number;
  provenance_type?: string;
}

export interface TrendResponse {
  total: number;
  trends: TrendItem[];
  audited_metrics?: {
    accuracy: number;
    macro_f1: number;
    majority_class_baseline_acc: number;
    target_definition: string;
  };
}

export interface PopulationResponse {
  status: string;
  data?: {
    crime_unit?: string;
    unit?: string;
    city?: string;
    state_ut?: string;
    population?: number | null;
    population_district?: string;
    mapping_type?: string;
    mapping_confidence?: number;
    mapping_basis?: string;
    town_count?: number;
    population_2001?: number | null;
    population_2011?: number | null;
    validated_rate_years?: number[];
    notes?: string;
  };
  message?: string;
}

export interface SpatialFeatureProperties {
  id: string;
  name: string;
  district: string;
  state_ut?: string;
  geo_id?: string;
  latitude: number;
  longitude: number;
  crime_count_2023?: number;
  observed_volume?: number;
  forecast_volume?: number;
  spatial_lag_crime?: number;
  trend?: string;
  anomaly_status?: string;
  is_synthetic?: boolean;
  provenance?: string;
  geometry_status?: string;
}

export interface SpatialGeoJSONResponse {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: any;
    };
    properties: SpatialFeatureProperties;
  }>;
}

export interface EvidenceSearchItem {
  document: string;
  page: number;
  year: number;
  source: string;
  organization: string;
  geography: string;
  document_type: string;
  text_snippet: string;
  similarity_score: number;
  citation: string;
  doi?: string;
  title?: string;
  authors?: string;
  excerpt?: string;
  relevance?: string;
}

export interface EvidenceSearchResponse {
  query: string;
  total_results: number;
  results: EvidenceSearchItem[];
}

export interface ProvenanceResponse {
  status: string;
  dataset?: string;
  provenance_info?: any;
  data?: {
    dataset_name: string;
    layer: string;
    status: string;
    sha256?: string;
    observations?: number;
    police_units?: number;
    years?: string;
    source_organization?: string;
    transformations?: string;
    notes?: string;
  };
}

export interface ModelRegistryItem {
  model_id: string;
  model_name: string;
  task: string;
  version: string;
  training_period: string;
  validation_period?: string;
  test_period: string;
  track_a_official_evaluation?: {
    name: string;
    test_period: string;
    sample_count: number;
    source_provenance: string;
    MAE: number;
    RMSE: number;
    WAPE_pct: number;
    R2: number;
    description: string;
  };
  track_b_extended_evaluation?: {
    name: string;
    test_period: string;
    sample_count: number;
    source_provenance: string;
    MAE: number;
    RMSE: number;
    WAPE_pct: number;
    R2: number;
    description: string;
  };
  test_metrics?: Record<string, any>;
  certification_status: string;
  limitations_disclaimer?: string;
}

export interface ModelRegistryResponse {
  certification_status: string;
  total_models: number;
  models: ModelRegistryItem[];
}

export interface ExplainabilityResponse {
  prediction_id: string;
  model_name: string;
  district: string;
  crime_category: string;
  predicted_value: number;
  base_value: number;
  feature_contributions: Array<{
    feature: string;
    value: number;
    contribution: number;
    direction: string;
    description: string;
  }>;
  disclaimer: string;
}

export interface ScholarlyPaperItem {
  id?: string;
  doi?: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  abstract?: string;
  citation_count?: number;
  url?: string;
  similarity_score?: number;
}

export interface ScholarlySearchResponse {
  query: string;
  total_results: number;
  papers: ScholarlyPaperItem[];
}
