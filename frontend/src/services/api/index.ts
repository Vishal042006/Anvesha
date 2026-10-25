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
  DistrictBriefingResponse,
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
  getForecast: (district: string = 'CHENNAI', category: string = 'ALL_CRIME', year: number = 2026, model: string = 'Ridge') => {
    return fetchJson<ForecastResponse>(`/forecast?district=${encodeURIComponent(district)}&crime_category=${encodeURIComponent(category)}&year=${year}&model=${encodeURIComponent(model)}`);
  },
  getForecastByDistrict: (district: string, category: string = 'ALL_CRIME', year: number = 2026, model: string = 'Ridge') => {
    return fetchJson<ForecastResponse>(`/forecast/${encodeURIComponent(district)}?crime_category=${encodeURIComponent(category)}&year=${year}&model=${encodeURIComponent(model)}`);
  },
  postForecast: (payload: { district: string; crime_category: string; year: number; model?: string }) => {
    return fetchJson<ForecastResponse>('/forecast', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const forecastingApi = forecastApi;

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
  getDistricts: (stateUt?: string) => geographyApi.getDistricts(stateUt),
  getDistrictAnalytics: (district: string, stateUt?: string, category: string = 'ALL_CRIME') => {
    const params = new URLSearchParams();
    if (stateUt) params.append('state_ut', stateUt);
    params.append('category', category);
    return fetchJson<DistrictAnalyticsResponse>(`/districts/${encodeURIComponent(district)}/analytics?${params.toString()}`);
  },
  getDistrictHistory: (unit: string, stateUt?: string, category: string = 'ALL_CRIME') => {
    const params = new URLSearchParams();
    if (stateUt) params.append('state_ut', stateUt);
    params.append('category', category);
    return fetchJson<DistrictAnalyticsResponse>(`/crime/history/${encodeURIComponent(unit)}?${params.toString()}`);
  },
};

export const policeStationsApi = {
  getPoliceStations: () => fetchJson<any>('/police-stations'),
};

export const spatialApi = {
  getLevels: () => fetchJson<{ levels: Array<{ code: string; label: string; description: string }>; default_level: string }>('/spatial/levels'),
  getCategories: () => fetchJson<{ categories: Array<{ code: string; label: string; description?: string }>; default_category: string }>('/spatial/categories'),
  getSpatialMap: (params?: {
    level?: string;
    year?: number;
    crime_category?: string;
    metric?: string;
    state?: string;
    district?: string;
    police_unit?: string;
    regime?: string;
    include_crimeshift?: boolean;
  }) => {
    const p = new URLSearchParams();
    if (params?.level) p.append('level', params.level);
    if (params?.year) p.append('year', params.year.toString());
    if (params?.crime_category) p.append('crime_category', params.crime_category);
    if (params?.metric) p.append('metric', params.metric);
    if (params?.state) p.append('state', params.state);
    if (params?.district) p.append('district', params.district);
    if (params?.police_unit) p.append('police_unit', params.police_unit);
    if (params?.regime) p.append('regime', params.regime);
    if (params?.include_crimeshift !== undefined) p.append('include_crimeshift', params.include_crimeshift.toString());
    return fetchJson<SpatialGeoJSONResponse>(`/spatial/map?${p.toString()}`);
  },
  getSpatialSummaryFiltered: (params?: { year?: number; category?: string; level?: string; state_ut?: string }) => {
    const p = new URLSearchParams();
    if (params?.year) p.append('year', params.year.toString());
    if (params?.category) p.append('category', params.category);
    if (params?.level) p.append('level', params.level);
    if (params?.state_ut) p.append('state_ut', params.state_ut);
    return fetchJson<any>(`/spatial/summary?${p.toString()}`);
  },
  getUnitDetails: (geographyId: string, yearCutoff: number = 2023, category: string = 'ALL_CRIME') => {
    return fetchJson<any>(`/spatial/unit/${encodeURIComponent(geographyId)}?year_cutoff=${yearCutoff}&category=${encodeURIComponent(category)}`);
  },
  getSpatialCrime: (stateUt?: string, category: string = 'ALL_CRIME', year: number = 2026, layer: string = 'forecast') => {
    const params = new URLSearchParams();
    if (stateUt && stateUt.toUpperCase() !== 'ALL') params.append('state_ut', stateUt);
    params.append('category', category);
    params.append('year', year.toString());
    params.append('layer', layer);
    return fetchJson<SpatialGeoJSONResponse>(`/spatial/crime?${params.toString()}`);
  },
  getSpatialSummary: () => fetchJson<SpatialGeoJSONResponse>('/spatial/summary'),
  getCities: () => fetchJson<any[]>('/spatial/cities'),
  getPoliceStations: () => policeStationsApi.getPoliceStations(),
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

export const crimeshiftApi = {
  analyzeCrimeshift: (unit: string = 'Chennai', category: string = 'ALL_CRIME', yearCutoff: number = 2023) => {
    return fetchJson<any>(`/crimeshift/analyze?unit=${encodeURIComponent(unit)}&category=${encodeURIComponent(category)}&year_cutoff=${yearCutoff}`);
  },
  getTransitions: (unit?: string, category: string = 'ALL_CRIME', yearCutoff: number = 2023) => {
    const q = unit ? `?unit=${encodeURIComponent(unit)}&category=${encodeURIComponent(category)}&year_cutoff=${yearCutoff}` : `?category=${encodeURIComponent(category)}&year_cutoff=${yearCutoff}`;
    return fetchJson<any>(`/crimeshift/transitions${q}`);
  },
  getAvailability: (unit: string = 'Chennai', category: string = 'ALL_CRIME') => {
    return fetchJson<any>(`/crimeshift/availability?unit=${encodeURIComponent(unit)}&category=${encodeURIComponent(category)}`);
  },
  getRegimes: (unit?: string) => {
    const q = unit ? `?unit=${encodeURIComponent(unit)}` : '';
    return fetchJson<any>(`/regimes${q}`);
  },
  getChangePoints: (unit?: string) => {
    const q = unit ? `?unit=${encodeURIComponent(unit)}` : '';
    return fetchJson<any>(`/change-points${q}`);
  },
  runPipeline: (payload: { unit: string; category: string; year_cutoff: number }) => {
    return fetchJson<any>('/crimeshift/run-pipeline', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getResearchHub: () => {
    return fetchJson<any>('/crimeshift/research-hub');
  },
  exportBundle: () => {
    return fetchJson<any>('/crimeshift/export');
  },
  simulate: (payload: { district: string; category?: string; intervention_type: string; intensity_pct: number; start_year?: number }) => {
    return fetchJson<any>('/crimeshift/simulate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getSignificance: () => {
    return fetchJson<any>('/crimeshift/significance');
  },
};

export const riskApi = {
  getRiskIndications: () => fetchJson<any>('/risk'),
};

export const newsApi = {
  searchNews: (district: string = 'Chennai', category: string = 'ALL_CRIME') => {
    return fetchJson<{ status: string; count: number; articles: Array<{ headline: string; publisher: string; published_at: string; description: string; source: string; url: string }> }>(`/news/search?district=${encodeURIComponent(district)}&category=${encodeURIComponent(category)}`);
  }
};

export const researchApi = {
  searchScholarly: (query: string) => {
    return fetchJson<ScholarlySearchResponse>(`/research/search?query=${encodeURIComponent(query)}`);
  },
  explainAreaFindings: (payload: { query: string; district: string; category: string; year?: number; trend_note?: string; state_ut?: string }) => {
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

export const briefingApi = {
  getDistrictBriefing: (params: {
    district: string;
    category: string;
    year: number;
    state_ut?: string;
  }, signal?: AbortSignal) => {
    const q = new URLSearchParams({
      district: params.district,
      category: params.category,
      year: String(params.year),
      ...(params.state_ut ? { state_ut: params.state_ut } : {})
    });
    return fetchJson<DistrictBriefingResponse>(`/briefing/district?${q.toString()}`, { signal });
  }
};

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
  searchNews: newsApi.searchNews,
  getDistrictBriefing: briefingApi.getDistrictBriefing,
};

