import { fetchJson } from './apiClient';
import type {
  SummaryResponse,
  CategorySummaryResponse,
  DistrictAnalyticsResponse,
  ForecastResponse,
  AnomalyResponse,
  TrendResponse,
  PopulationResponse,
  SpatialGeoJSONResponse,
  EvidenceSearchResponse,
  ProvenanceResponse,
  ModelRegistryResponse,
  ExplainabilityResponse,
  ScholarlySearchResponse,
} from '../../types';

export const healthApi = {
  getHealth: () => fetchJson<{ status: string; version: string; system?: string; dataset_version?: string }>('/health'),
};

export const geographyApi = {
  getStates: () => fetchJson<{ status: string; count: number; states: string[] }>('/geography/states'),
  getDistricts: (stateUt?: string) => {
    const q = stateUt ? `?state_ut=${encodeURIComponent(stateUt)}` : '';
    return fetchJson<{ status: string; state_ut?: string; count: number; districts: string[] }>(`/geography/districts${q}`);
  },
};

export const modelsApi = {
  getModels: () => fetchJson<ModelRegistryResponse>('/models'),
};

export const forecastApi = {
  getForecast: (district: string = 'Pune', category: string = 'property_crime', year: number = 2024, model: string = 'T-1 Persistence') => {
    return fetchJson<ForecastResponse>(`/forecast?district=${encodeURIComponent(district)}&crime_category=${encodeURIComponent(category)}&year=${year}&model=${encodeURIComponent(model)}`);
  },
  getForecastByDistrict: (district: string, category: string = 'property_crime', year: number = 2024, model: string = 'T-1 Persistence') => {
    return fetchJson<ForecastResponse>(`/forecast/${encodeURIComponent(district)}?crime_category=${encodeURIComponent(category)}&year=${year}&model=${encodeURIComponent(model)}`);
  },
  postForecast: (payload: { district: string; crime_category: string; year: number; model?: string }) => {
    return fetchJson<ForecastResponse>('/forecast', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const trendApi = {
  getTrends: (district?: string, category?: string, threshold_pct: number = 5.0) => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (category) params.append('crime_category', category);
    params.append('threshold_pct', threshold_pct.toString());
    return fetchJson<TrendResponse>(`/trends?${params.toString()}`);
  },
};

export const anomalyApi = {
  getAnomalies: (district?: string, year?: number, category?: string, method: string = 'IsolationForest') => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (year) params.append('year', year.toString());
    if (category) params.append('crime_category', category);
    params.append('method', method);
    return fetchJson<AnomalyResponse>(`/anomalies?${params.toString()}`);
  },
  investigateAnomaly: (payload: { district: string; state_ut?: string; crime_category?: string; year?: number; observed_volume?: number; previous_year_volume?: number }) => {
    return fetchJson<any>('/anomalies/investigate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};

export const districtApi = {
  getSummary: () => fetchJson<SummaryResponse>('/crime/summary'),
  getCategories: () => fetchJson<CategorySummaryResponse>('/crime/categories'),
  getDistrictAnalytics: (district: string, stateUt?: string, category: string = 'ipc_total') => {
    const params = new URLSearchParams();
    if (stateUt) params.append('state_ut', stateUt);
    params.append('category', category);
    return fetchJson<DistrictAnalyticsResponse>(`/districts/${encodeURIComponent(district)}/analytics?${params.toString()}`);
  },
  getDistrictHistory: (unit: string, stateUt?: string, category: string = 'ipc_total') => {
    const params = new URLSearchParams();
    if (stateUt) params.append('state_ut', stateUt);
    params.append('category', category);
    return fetchJson<DistrictAnalyticsResponse>(`/crime/history/${encodeURIComponent(unit)}?${params.toString()}`);
  },
};

export const spatialApi = {
  getSpatialCrime: (stateUt?: string, category: string = 'ipc_total', year: number = 2022, layer: string = 'observed') => {
    const params = new URLSearchParams();
    if (stateUt && stateUt.toUpperCase() !== 'ALL') params.append('state_ut', stateUt);
    params.append('category', category);
    params.append('year', year.toString());
    params.append('layer', layer);
    return fetchJson<SpatialGeoJSONResponse>(`/spatial/crime?${params.toString()}`);
  },
  getSpatialSummary: () => fetchJson<SpatialGeoJSONResponse>('/spatial/summary'),
  getCities: () => fetchJson<any[]>('/spatial/cities'),
};

export const evidenceApi = {
  searchEvidence: (query: string = 'crime statistics India') => {
    return fetchJson<EvidenceSearchResponse>(`/evidence/search?q=${encodeURIComponent(query)}`);
  },
};

export const provenanceApi = {
  getProvenance: (dataset: string) => {
    return fetchJson<ProvenanceResponse>(`/provenance/${encodeURIComponent(dataset)}`);
  },
};

export const populationApi = {
  getPopulation: (unit: string) => {
    return fetchJson<PopulationResponse>(`/population/${encodeURIComponent(unit)}`);
  },
};

export const explainabilityApi = {
  getExplanation: (predictionId: string) => {
    return fetchJson<ExplainabilityResponse>(`/explain/${encodeURIComponent(predictionId)}`);
  },
};

export const classificationApi = {
  getClassification: () => fetchJson<any>('/classification'),
};

export const riskApi = {
  getRiskIndications: () => fetchJson<any>('/risk'),
};

export const policeStationsApi = {
  getPoliceStations: () => fetchJson<any>('/police-stations'),
};

export const researchApi = {
  searchScholarly: (query: string) => {
    return fetchJson<ScholarlySearchResponse>(`/research/search?query=${encodeURIComponent(query)}`);
  },
  explainAreaFindings: (payload: { query: string; district: string; category: string; trend_note?: string }) => {
    return fetchJson<any>('/research/explain', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  generateActionPlan: (payload: any) => {
    return fetchJson<any>('/research/action-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Unified api object for backward compatibility
export const api = {
  getHealth: healthApi.getHealth,
  getStates: geographyApi.getStates,
  getDistricts: geographyApi.getDistricts,
  getSummary: districtApi.getSummary,
  getCategories: districtApi.getCategories,
  getDistrictAnalytics: districtApi.getDistrictAnalytics,
  getDistrictHistory: districtApi.getDistrictHistory,
  getForecast: forecastApi.getForecast,
  getForecastByDistrict: forecastApi.getForecastByDistrict,
  getAnomalies: anomalyApi.getAnomalies,
  investigateAnomaly: anomalyApi.investigateAnomaly,
  getTrends: trendApi.getTrends,
  getPopulation: populationApi.getPopulation,
  getSpatialCrime: spatialApi.getSpatialCrime,
  getSpatialSummary: spatialApi.getSpatialSummary,
  getCities: spatialApi.getCities,
  searchEvidence: evidenceApi.searchEvidence,
  getProvenance: provenanceApi.getProvenance,
  getModels: modelsApi.getModels,
  getExplanation: explainabilityApi.getExplanation,
  searchScholarly: researchApi.searchScholarly,
  explainAreaFindings: researchApi.explainAreaFindings,
  generateActionPlan: researchApi.generateActionPlan,
};
