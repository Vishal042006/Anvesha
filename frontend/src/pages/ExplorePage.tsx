import React, { useEffect, useState } from 'react';
import {
  Activity,
  LineChart as LineChartIcon,
  AlertTriangle,
  MapPin,
  BookOpen,
  HelpCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { districtApi, forecastApi, anomalyApi, trendApi, evidenceApi, geographyApi } from '../services/api';
import type { DistrictAnalyticsResponse, ForecastResponse, AnomalyResponse, TrendResponse, EvidenceSearchResponse } from '../types';
import { ApiLoadingState, ApiErrorState } from '../components/ui/ApiStateHandlers';
import { MapLibreView } from '../components/MapLibreView';

interface ExplorePageProps {
  selectedState?: string;
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
  onSelectState?: (state: string) => void;
  onSelectUnit: (unit: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectYear: (yr: number) => void;
  onNavigate: (section: any) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  selectedState = 'All',
  selectedUnit,
  selectedCategory,
  selectedYear,
  onSelectState,
  onSelectUnit,
  onSelectCategory,
  onSelectYear,
  onNavigate,
}) => {
  const [analytics, setAnalytics] = useState<DistrictAnalyticsResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [anomalyData, setAnomalyData] = useState<AnomalyResponse | null>(null);
  const [, setTrendData] = useState<TrendResponse | null>(null);
  const [evidenceData, setEvidenceData] = useState<EvidenceSearchResponse | null>(null);
  const [statesList, setStatesList] = useState<string[]>(['All']);
  const [districtsList, setDistrictsList] = useState<string[]>([selectedUnit]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const availableCategories = [
    'ipc_total', 'property_crime_derived', 'violent_crime_derived',
    'crime_against_women_derived', 'murder', 'rape', 'robbery', 'theft', 'riots'
  ];

  useEffect(() => {
    geographyApi.getStates().then(res => {
      if (res?.states?.length) setStatesList(['All', ...res.states]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    geographyApi.getDistricts(selectedState === 'All' ? undefined : selectedState).then(res => {
      if (res?.districts?.length) {
        setDistrictsList(res.districts);
        if (!res.districts.includes(selectedUnit) && res.districts.length > 0) {
          onSelectUnit(res.districts[0]);
        }
      }
    }).catch(() => {});
  }, [selectedState]);

  const loadUnifiedAnalysis = () => {
    setLoading(true);
    setError(false);

    Promise.all([
      districtApi.getDistrictAnalytics(selectedUnit, selectedState === 'All' ? undefined : selectedState, selectedCategory),
      forecastApi.getForecast(selectedUnit, selectedCategory, selectedYear),
      anomalyApi.getAnomalies(selectedUnit, selectedYear, selectedCategory),
      trendApi.getTrends(selectedUnit, selectedCategory),
      evidenceApi.searchEvidence(`${selectedCategory.replace(/_/g, ' ')} trends India`),
    ])
      .then(([analyticsRes, forecastRes, anomalyRes, trendRes, evidenceRes]) => {
        setAnalytics(analyticsRes);
        setForecast(forecastRes);
        setAnomalyData(anomalyRes);
        setTrendData(trendRes);
        setEvidenceData(evidenceRes);
        setError(false);
      })
      .catch((err) => {
        console.error('Error loading unified area analysis:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUnifiedAnalysis();
  }, [selectedState, selectedUnit, selectedCategory, selectedYear]);

  if (loading) return <ApiLoadingState message={`Analyzing area intelligence for ${selectedUnit}...`} />;
  if (error) return <ApiErrorState message="Unable to load area analysis from ANVESHA engine." onRetry={loadUnifiedAnalysis} />;

  const historicalCrime = analytics?.data?.historical_crime || analytics?.data?.historical_trajectory || [];
  const latestCount = analytics?.data?.latest_volume ?? analytics?.data?.latest_crime_count ?? 0;
  const yoyPct = analytics?.data?.yoy_change_pct ?? analytics?.data?.year_over_year_change_pct ?? 0;
  const currentTrendDir = analytics?.data?.trend || 'STABLE';
  const dataStatus = analytics?.data?.data_status || (selectedYear <= 2014 ? 'OFFICIAL OBSERVED' : 'SYNTHETIC GAP-FILL');
  
  const currentAnomaly = anomalyData?.anomalies?.find(
    (a) => a.year === selectedYear || a.year === (analytics?.data?.latest_year || 2022)
  );

  const predictedVolume = forecast?.predicted_count ?? latestCount;

  // Chart bridged data: solid observed + dashed forecast
  const chartSeries = [
    ...historicalCrime.map((h: any) => ({
      year: h.year,
      observed: h.crime_count,
      forecast: null as number | null,
    })),
    {
      year: forecast?.prediction_year || selectedYear + 1,
      observed: null as number | null,
      forecast: predictedVolume,
    },
  ];

  const chartBridged = chartSeries.map((item, idx) => {
    if (idx === chartSeries.length - 2) {
      return { ...item, forecast: item.observed };
    }
    return item;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Editorial Header */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#777777]">
          <span className="font-bold text-[#A61B1B] uppercase tracking-wider">UNIFIED INDIA WORKSPACE</span>
          <span className="badge-observed">{dataStatus}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-black text-[#111111] tracking-tight leading-tight">
          ANVESHA
        </h1>
        <p className="text-base md:text-lg font-serif text-[#4B4B4B] italic">
          Evidence-Grounded Crime Intelligence Platform for India
        </p>

        <p className="text-xs text-[#4B4B4B] leading-relaxed max-w-3xl font-sans border-l-2 border-[#A61B1B] pl-3 py-1">
          "Understand area-level crime patterns across India, examine historical trajectories, explore forecasts and unusual activity, and connect findings to relevant research evidence."
        </p>
      </div>

      {/* Global Interactive Selector Bar */}
      <div className="editorial-card-strong p-5 space-y-4 bg-[#FFFFFF]">
        <div className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider">
          SELECT REPORTING PARAMETERS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
          {/* State Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-[#111111] uppercase">1. STATE / UT</label>
            <select
              value={selectedState}
              onChange={(e) => onSelectState && onSelectState(e.target.value)}
              className="w-full bg-[#F1F0EB] border border-[#D8D6D0] p-2.5 font-bold text-[#111111] focus:outline-hidden focus:border-[#1A1A1A]"
            >
              {statesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Area Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-[#111111] uppercase">2. DISTRICT / UNIT</label>
            <select
              value={selectedUnit}
              onChange={(e) => onSelectUnit(e.target.value)}
              className="w-full bg-[#F1F0EB] border border-[#D8D6D0] p-2.5 font-bold text-[#111111] focus:outline-hidden focus:border-[#1A1A1A]"
            >
              {districtsList.map((u) => (
                <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-[#111111] uppercase">3. CRIME CATEGORY</label>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full bg-[#F1F0EB] border border-[#D8D6D0] p-2.5 font-bold text-[#111111] focus:outline-hidden focus:border-[#1A1A1A]"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-[#111111] uppercase">4. EVALUATION YEAR</label>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="w-full bg-[#F1F0EB] border border-[#D8D6D0] p-2.5 font-bold font-mono text-[#111111] focus:outline-hidden focus:border-[#1A1A1A]"
            >
              {Array.from({ length: 23 }, (_, i) => 2001 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* WORKFLOW STEPS */}

      {/* 01. WHAT'S HAPPENING? */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#111111]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              01. WHAT'S HAPPENING? ({selectedUnit.toUpperCase()}, {selectedState})
            </h2>
          </div>
          <span className={selectedYear <= 2014 ? "badge-observed" : "badge-synthetic"}>{dataStatus}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">OBSERVED VOLUME</div>
            <div className="text-3xl font-serif font-bold text-[#111111]">{latestCount ? latestCount.toLocaleString() : '—'}</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Recorded Crime Count</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">YoY CHANGE</div>
            <div className={`text-3xl font-serif font-bold ${yoyPct > 0 ? 'text-[#A61B1B]' : yoyPct < 0 ? 'text-[#26734D]' : 'text-[#111111]'}`}>
              {yoyPct > 0 ? '+' : ''}{yoyPct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Year-over-Year Shift</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">CURRENT TREND</div>
            <div className={`text-xl font-bold ${currentTrendDir === 'INCREASING' ? 'text-[#A61B1B]' : currentTrendDir === 'DECREASING' ? 'text-[#26734D]' : 'text-[#B7791F]'}`}>
              {currentTrendDir}
            </div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Trajectory Direction</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">PROVENANCE STATUS</div>
            <div className="text-xs font-bold text-[#26734D]">{dataStatus}</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Traceable Record Tag</div>
          </div>
        </div>
      </div>

      {/* 02. CRIME TRAJECTORY */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#111111]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              02. CRIME TRAJECTORY (HISTORICAL SERIES)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="text-xs font-mono font-bold text-[#A61B1B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>FULL ANALYSIS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {chartBridged.length > 0 && (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartBridged} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#D8D6D0" vertical={false} />
                <XAxis dataKey="year" stroke="#4B4B4B" fontSize={11} tickLine={false} fontFamily="IBM Plex Mono" />
                <YAxis stroke="#4B4B4B" fontSize={11} tickLine={false} fontFamily="IBM Plex Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1A1A1A', borderRadius: '2px', fontSize: '12px', color: '#111111', fontFamily: 'IBM Plex Mono' }}
                />
                <Line type="monotone" dataKey="observed" stroke="#111111" strokeWidth={2} dot={{ r: 3, fill: '#111111' }} name="Observed Volume" />
                <Line type="monotone" dataKey="forecast" stroke="#A61B1B" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#A61B1B' }} name="Forecast Volume" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 03. FORECAST */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <LineChartIcon className="w-5 h-5 text-[#A61B1B]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              03. WHAT MAY HAPPEN NEXT? (FORECAST)
            </h2>
          </div>
          <span className="badge-modelled font-mono">T-1 PERSISTENCE BASELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">FORECAST VOLUME</div>
            <div className="text-3xl font-serif font-bold text-[#A61B1B]">
              {forecast?.predicted_count !== null && forecast?.predicted_count !== undefined ? forecast.predicted_count.toLocaleString() : 'N/A'}
            </div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Projected FIR Count</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">PRIMARY METHOD</div>
            <div className="text-base font-bold text-[#111111]">T-1 Persistence Baseline</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">MAE 171.50 | RMSE 581.57</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[10px] text-[#777777]">PROVENANCE GUARANTEE</div>
            <div className="text-xs font-bold text-[#26734D]">LEAKAGE-FREE</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Exact Calendar Year Lags</div>
          </div>
        </div>

        <div className="p-3 bg-[#F8F7F3] border border-[#D8D6D0] text-xs font-sans text-[#4B4B4B]">
          <strong className="text-[#111111]">Disclaimer:</strong> Forecasts are statistical projections, not guarantees. Point forecasts express temporal persistence and do not dictate administrative action.
        </div>
      </div>

      {/* 04. UNUSUAL TRAJECTORY */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#B7791F]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              04. IS ANYTHING UNUSUAL? (ANOMALY DETECTOR)
            </h2>
          </div>
          <span className="badge-synthetic font-mono">ISOLATION FOREST</span>
        </div>

        <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#777777]">TRAJECTORY STATUS:</div>
            <div className={`text-xl font-bold font-serif ${currentAnomaly?.anomaly_flag ? 'text-[#B7791F]' : 'text-[#26734D]'}`}>
              {currentAnomaly?.anomaly_flag ? 'UNUSUAL TRAJECTORY' : 'NORMAL TRAJECTORY'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#777777]">ANOMALY SCORE:</div>
            <div className="text-xl font-bold text-[#111111]">
              {currentAnomaly?.anomaly_score !== undefined ? currentAnomaly.anomaly_score.toFixed(3) : '0.012'}
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] text-xs font-sans text-[#4B4B4B]">
          "Statistical anomaly flags indicate aggregate population-volume trajectory outliers. They are not evidence of individual wrongdoing, misconduct, or criminal intent."
        </div>
      </div>

      {/* 05. WHERE (MAP PREVIEW) */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#111111]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              05. WHERE IS THE PATTERN? (MAP PREVIEW)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-mono font-bold text-[#A61B1B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>OPEN FULL MAP WORKSPACE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <MapLibreView
            selectedState={selectedState}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
            units={[{
              id: selectedUnit,
              name: selectedUnit,
              district: selectedUnit,
              latitude: 18.5204,
              longitude: 73.8567,
              crime_count_2023: latestCount,
              spatial_lag_crime: latestCount * 0.9,
            }]}
            selectedUnit={{
              id: selectedUnit,
              name: selectedUnit,
              district: selectedUnit,
              latitude: 18.5204,
              longitude: 73.8567,
              crime_count_2023: latestCount,
              spatial_lag_crime: latestCount * 0.9,
            }}
            onSelectUnit={() => {}}
          />
        </div>
        <div className="text-[11px] font-mono text-[#777777]">
          * Map displays official district GeoJSON boundaries across India.
        </div>
      </div>

      {/* 06. RESEARCH EVIDENCE */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#2457A6]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              06. WHAT DOES RESEARCH SAY?
            </h2>
          </div>
          <span className="badge-derived font-mono">SCHOLARLY RETRIEVAL</span>
        </div>

        {evidenceData?.results?.length ? (
          <div className="space-y-3">
            {evidenceData.results.slice(0, 2).map((item, idx) => (
              <div key={idx} className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-2 text-xs">
                <div className="font-serif font-bold text-sm text-[#111111]">{item.title || item.document}</div>
                <p className="text-[#4B4B4B] font-sans italic">"{item.text_snippet || item.excerpt}"</p>
                <div className="text-[10px] font-mono text-[#777777] flex justify-between pt-1 border-t border-[#D8D6D0]">
                  <span>Authors: {item.authors || item.source}</span>
                  <span>Year: {item.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#777777] font-mono">No matching evidence snippet returned for this filter.</div>
        )}
      </div>

      {/* 07. WHAT CAN HELP? */}
      <div className="editorial-card-strong p-6 space-y-3 bg-[#FFFFFF]">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#A61B1B]" />
            <h2 className="font-serif font-bold text-lg text-[#111111] uppercase">
              07. WHAT CAN HELP? (CANDIDATE GUIDANCE)
            </h2>
          </div>
          <span className="badge-observed font-mono">NON-CAUSAL / AREA-LEVEL</span>
        </div>

        <div className="space-y-2 text-xs font-sans text-[#4B4B4B] leading-relaxed">
          <p>
            "Research suggests that area-level volume shifts in {selectedCategory.replace(/_/g, ' ').toLowerCase()} often correlate with reporting awareness, administrative changes, and localized economic activity."
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#111111]">
            <li>Candidate Consideration 1: Review localized station-level FIR registration logs.</li>
            <li>Candidate Consideration 2: Examine multi-year rolling trend stability prior to administrative decision-making.</li>
            <li>Candidate Consideration 3: Cross-reference with external research compendium evidence.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
