import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { geographyApi, crimeshiftApi } from '../services/api';

export interface AnalyticalContextState {
  state: string;
  district: string;
  geographyId: string;
  category: string;
  year: number;
  metric: string;
  mapMode: 'map' | 'heatmap';
  forecastHorizon: number;
  contextId: string;
  allDistricts: string[];
  allCategories: Array<{ code: string; label: string }>;
  analysisData: any | null;
  loadingAnalysis: boolean;
  analysisError: string | null;
  setDistrict: (district: string) => void;
  setCategory: (category: string) => void;
  setYear: (year: number) => void;
  setMetric: (metric: string) => void;
  setMapMode: (mode: 'map' | 'heatmap') => void;
  setForecastHorizon: (horizon: number) => void;
  setContext: (partial: Partial<{ district: string; category: string; year: number; metric: string; mapMode: 'map' | 'heatmap'; forecastHorizon: number }>) => void;
  refreshAnalysis: () => void;
}

const DEFAULT_CATEGORIES: Array<{ code: string; label: string }> = [
  { code: 'ALL_CRIME', label: 'All Recorded Crime' },
  { code: 'VIOLENT', label: 'Violent Crime' },
  { code: 'PROPERTY', label: 'Property Crime' },
  { code: 'ECONOMIC', label: 'Economic Crime' },
  { code: 'CYBER', label: 'Cyber Crime' },
  { code: 'WOMEN_AND_CHILDREN', label: 'Women & Children' },
];

export const DEFAULT_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanniyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar'
];

function buildContextId(state: string, district: string, category: string, year: number, metric: string): string {
  const cleanState = (state || 'TN').replace(/\s+/g, '_').toUpperCase();
  const cleanDist = (district || 'CHENNAI').replace(/\s+/g, '_').toUpperCase();
  const cleanCat = (category || 'ALL_CRIME').toUpperCase();
  const cleanMetric = (metric || 'RECORDED_CRIME').replace(/\s+/g, '_').toUpperCase();
  return `${cleanState}|GEO_TN_${cleanDist}|${cleanCat}|${year}|${cleanMetric}`;
}

const AnalyticalContext = createContext<AnalyticalContextState | undefined>(undefined);

export const AnalyticalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state] = useState<string>('Tamil Nadu');
  const [district, setDistrictState] = useState<string>('Chennai');
  const [geographyId, setGeographyId] = useState<string>('GEO_TN_002');
  const [category, setCategoryState] = useState<string>('ALL_CRIME');
  const [year, setYearState] = useState<number>(2023);
  const [metric, setMetricState] = useState<string>('recorded_crime');
  const [mapMode, setMapModeState] = useState<'map' | 'heatmap'>('map');
  const [forecastHorizon, setForecastHorizonState] = useState<number>(2026);

  const [allDistricts, setAllDistricts] = useState<string[]>(DEFAULT_DISTRICTS);
  const [allCategories] = useState<Array<{ code: string; label: string }>>(DEFAULT_CATEGORIES);

  // Cached analytical payload
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Stale request protection
  const activeRequestIdRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  const contextId = buildContextId(state, district, category, year, metric);

  // Load canonical Tamil Nadu districts once on mount
  useEffect(() => {
    geographyApi.getDistricts('Tamil Nadu')
      .then((res) => {
        if (res && res.districts && res.districts.length > 0) {
          const clean = res.districts.filter((d: string) => !d.toLowerCase().endsWith(' city'));
          setAllDistricts(clean);
        }
      })
      .catch((err) => {
        console.warn('Failed to load canonical districts:', err);
      });
  }, []);

  // Fetch canonical analysis whenever district, category, or year changes
  const fetchAnalysisForContext = useCallback((targetDist: string, targetCat: string, targetYear: number) => {
    // Cancel in-flight request
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    const reqId = ++activeRequestIdRef.current;
    setLoadingAnalysis(true);
    setAnalysisError(null);

    crimeshiftApi.analyzeCrimeshift(targetDist, targetCat, targetYear)
      .then((data) => {
        if (reqId !== activeRequestIdRef.current) {
          // Stale response: discard!
          return;
        }
        setAnalysisData(data);
        if (data.geography_id) {
          setGeographyId(data.geography_id);
        }
      })
      .catch((err) => {
        if (reqId !== activeRequestIdRef.current) return;
        if (err.name === 'AbortError') return;
        setAnalysisError(err.message || 'Failed to load analysis for selected context.');
        setAnalysisData(null);
      })
      .finally(() => {
        if (reqId === activeRequestIdRef.current) {
          setLoadingAnalysis(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchAnalysisForContext(district, category, year);
  }, [district, category, year, fetchAnalysisForContext]);

  const setDistrict = (newDist: string) => {
    const cleanDist = (newDist || '').replace(/\s+City$/i, '');
    if (cleanDist && cleanDist !== district) {
      setDistrictState(cleanDist);
    }
  };

  const setCategory = (newCat: string) => {
    if (newCat && newCat !== category) {
      setCategoryState(newCat);
    }
  };

  const setYear = (newYear: number) => {
    if (newYear && newYear !== year) {
      setYearState(newYear);
    }
  };

  const setMetric = (newMetric: string) => {
    if (newMetric && newMetric !== metric) {
      setMetricState(newMetric);
    }
  };

  const setMapMode = (newMode: 'map' | 'heatmap') => {
    if (newMode && newMode !== mapMode) {
      setMapModeState(newMode);
    }
  };

  const setForecastHorizon = (newHorizon: number) => {
    if (newHorizon && newHorizon !== forecastHorizon) {
      setForecastHorizonState(newHorizon);
    }
  };

  const setContext = (partial: Partial<{ district: string; category: string; year: number; metric: string; mapMode: 'map' | 'heatmap'; forecastHorizon: number }>) => {
    if (partial.district) {
      const cleanDist = partial.district.replace(/\s+City$/i, '');
      if (cleanDist !== district) setDistrictState(cleanDist);
    }
    if (partial.category && partial.category !== category) setCategoryState(partial.category);
    if (partial.year !== undefined && partial.year !== year) setYearState(partial.year);
    if (partial.metric && partial.metric !== metric) setMetricState(partial.metric);
    if (partial.mapMode && partial.mapMode !== mapMode) setMapModeState(partial.mapMode);
    if (partial.forecastHorizon !== undefined && partial.forecastHorizon !== forecastHorizon) setForecastHorizonState(partial.forecastHorizon);
  };

  const refreshAnalysis = () => {
    fetchAnalysisForContext(district, category, year);
  };

  return (
    <AnalyticalContext.Provider
      value={{
        state,
        district,
        geographyId,
        category,
        year,
        metric,
        mapMode,
        forecastHorizon,
        contextId,
        allDistricts,
        allCategories,
        analysisData,
        loadingAnalysis,
        analysisError,
        setDistrict,
        setCategory,
        setYear,
        setMetric,
        setMapMode,
        setForecastHorizon,
        setContext,
        refreshAnalysis,
      }}
    >
      {children}
    </AnalyticalContext.Provider>
  );
};

export function useAnalyticalContext(): AnalyticalContextState {
  const ctx = useContext(AnalyticalContext);
  if (!ctx) {
    throw new Error('useAnalyticalContext must be used within an AnalyticalContextProvider');
  }
  return ctx;
}
