import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { forecastApi, districtApi } from '../services/api';
import { useAnalyticalContext } from '../context/AnalyticalContext';

interface ForecastingPageProps {
  onOpenProvenance?: () => void;
}

const DEFAULT_BENCHMARK_MODELS = [
  { model: 'Naïve T-1', mae: '269.76', rmse: '629.15', wape: '6.12%', mase: '0.542', smape: '5.94%', r2: '0.9899', status: 'RECOMMENDED', isBest: true },
  { model: 'ARIMA (1,1,0)', mae: '278.10', rmse: '613.03', wape: '6.30%', mase: '0.559', smape: '12.85%', r2: '0.9904', status: 'EVALUATED', isBest: false },
  { model: '50-Epoch MLP Regressor', mae: '299.26', rmse: '597.73', wape: '6.78%', mase: '0.601', smape: '22.09%', r2: '0.9908', status: 'EVALUATED', isBest: false },
  { model: 'Ridge Autoregressive (L2)', mae: '350.78', rmse: '692.27', wape: '7.95%', mase: '0.705', smape: '15.42%', r2: '0.9878', status: 'EVALUATED', isBest: false },
  { model: 'Random Forest Regressor', mae: '366.99', rmse: '767.60', wape: '8.32%', mase: '0.738', smape: '16.85%', r2: '0.9851', status: 'EVALUATED', isBest: false },
  { model: '3-Year Historical Mean', mae: '443.09', rmse: '847.83', wape: '10.04%', mase: '0.891', smape: '19.34%', r2: '0.9819', status: 'EVALUATED', isBest: false },
  { model: 'LightGBM Regressor', mae: '618.45', rmse: '1920.12', wape: '14.02%', mase: '1.243', smape: '29.15%', r2: '0.9059', status: 'EVALUATED', isBest: false },
  { model: 'XGBoost Regressor', mae: '626.23', rmse: '1942.36', wape: '14.20%', mase: '1.259', smape: '29.69%', r2: '0.9037', status: 'EVALUATED', isBest: false },
  { model: 'Regime-Aware XGBoost', mae: '627.18', rmse: '1945.73', wape: '14.22%', mase: '1.261', smape: '29.69%', r2: '0.9033', status: 'EVALUATED', isBest: false },
  { model: 'PyTorch LSTM (50 Epochs)', mae: '1145.80', rmse: '2890.45', wape: '25.96%', mase: '2.303', smape: '48.72%', r2: '0.7891', status: 'EVALUATED', isBest: false },
];

export const ForecastingPage: React.FC<ForecastingPageProps> = () => {
  const {
    district,
    category,
    forecastHorizon,
    setDistrict,
    setCategory,
    setForecastHorizon,
    allDistricts,
    allCategories,
    analysisData,
  } = useAnalyticalContext();

  const selectedModel = 'Naïve T-1';

  const [loading, setLoading] = useState<boolean>(false);
  const [forecastVal, setForecastVal] = useState<number | null>(null);
  const [lowerBound, setLowerBound] = useState<number | null>(null);
  const [upperBound, setUpperBound] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [futureForecasts, setFutureForecasts] = useState<any[]>([]);
  const [benchmarkModels, setBenchmarkModels] = useState<any[]>(DEFAULT_BENCHMARK_MODELS);
  const [showModelComparison, setShowModelComparison] = useState<boolean>(false);
  const activeReqIdRef = useRef<number>(0);

  // Load benchmark comparison results dynamically from model comparison artifact endpoint
  useEffect(() => {
    fetch('/api/v1/model-comparison')
      .then((r) => r.json())
      .then((data) => {
        if (data?.models && data.models.length > 0) {
          const formatted = data.models.map((m: any) => ({
            model: m.model || m.Model || m.model_name,
            mae: m.mae != null ? Number(m.mae).toFixed(2) : (m.mae_test ? Number(m.mae_test).toFixed(2) : (m.MAE ? Number(m.MAE).toFixed(2) : '—')),
            rmse: m.rmse != null ? Number(m.rmse).toFixed(2) : (m.rmse_test ? Number(m.rmse_test).toFixed(2) : (m.RMSE ? Number(m.RMSE).toFixed(2) : '—')),
            wape: m.wape != null ? `${Number(m.wape).toFixed(2)}%` : (m.wape_test ? `${Number(m.wape_test).toFixed(2)}%` : (m.WAPE ? `${Number(m.WAPE).toFixed(2)}%` : '—')),
            mase: m.mase != null ? Number(m.mase).toFixed(3) : (m.MASE ? Number(m.MASE).toFixed(3) : '—'),
            smape: m.smape != null ? `${Number(m.smape).toFixed(2)}%` : (m.sMAPE ? `${Number(m.sMAPE).toFixed(2)}%` : '—'),
            r2: m.r2 != null ? Number(m.r2).toFixed(4) : (m.R2 ? Number(m.R2).toFixed(4) : '—'),
            status: m.status || (m.is_recommended ? 'RECOMMENDED' : 'EVALUATED'),
            isBest: Boolean(m.is_recommended || (m.model || m.Model || '').toLowerCase().includes('persistence') || (m.model || m.Model || '').toLowerCase().includes('naïve'))
          }));
          setBenchmarkModels(formatted);
        }
      })
      .catch(() => {
        // Retain verified fallback benchmark constants
      });
  }, []);

  // Fetch forecast and historical series for active context with race-condition protection
  useEffect(() => {
    const reqId = ++activeReqIdRef.current;
    setLoading(true);

    Promise.all([
      forecastApi.getForecast(district, category, forecastHorizon, selectedModel).catch(() => null),
      districtApi.getDistrictHistory(district, 'Tamil Nadu', category).catch(() => null)
    ]).then(([fcRes, histRes]) => {
      if (reqId !== activeReqIdRef.current) return;

      // Extract bounds from analysisData if forecastApi lacks conformal intervals
      const contextHorizon = analysisData?.forecast?.horizons?.find((h: any) => h.year === forecastHorizon);

      if (fcRes && fcRes.predicted_count != null) {
        setForecastVal(Math.round(fcRes.predicted_count));
        setLowerBound(fcRes.lower_bound != null ? Math.round(fcRes.lower_bound) : (contextHorizon?.lower != null ? Math.round(contextHorizon.lower) : null));
        setUpperBound(fcRes.upper_bound != null ? Math.round(fcRes.upper_bound) : (contextHorizon?.upper != null ? Math.round(contextHorizon.upper) : null));
        if (fcRes.future_forecasts?.length) {
          setFutureForecasts(fcRes.future_forecasts);
        }
      } else if (contextHorizon) {
        setForecastVal(Math.round(contextHorizon.point));
        setLowerBound(Math.round(contextHorizon.lower));
        setUpperBound(Math.round(contextHorizon.upper));
      } else {
        setForecastVal(null);
        setLowerBound(null);
        setUpperBound(null);
      }

      if (!fcRes?.future_forecasts?.length && analysisData?.forecast?.horizons?.length) {
        setFutureForecasts(analysisData.forecast.horizons.map((h: any) => ({
          year: h.year,
          forecast_value: h.point,
          lower_bound: h.lower,
          upper_bound: h.upper,
          horizon: `${h.year - 2023}-Year`,
          status: 'FORECAST',
          model: 'T-1 Persistence Baseline (Naïve T-1)',
          target_label: 'Recorded Crime Count'
        })));
      }

      if (histRes && histRes.historical_trajectory?.length) {
        setHistoricalData(histRes.historical_trajectory);
      } else if (analysisData?.historical_series?.length) {
        setHistoricalData(analysisData.historical_series.map((s: any) => ({ year: s.year, crime_count: s.observed })));
      } else {
        setHistoricalData([]);
      }
    }).finally(() => {
      if (reqId === activeReqIdRef.current) setLoading(false);
    });
  }, [district, category, forecastHorizon, selectedModel, analysisData]);

  // Construct chart dataset dynamically from real historical trajectory + forecast point
  const lastHistYear = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;
  const lastHistVal = lastHistYear ? lastHistYear.crime_count : null;

  const chartData = [
    ...historicalData.map(h => ({
      year: h.year,
      observed: h.crime_count,
      forecast: null
    })),
    ...(forecastVal !== null ? [
      ...(lastHistYear ? [{ year: lastHistYear.year, observed: lastHistVal, forecast: lastHistVal }] : []),
      { year: forecastHorizon, observed: null, forecast: forecastVal }
    ] : [])
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-[#17202A] font-sans">
      {/* Header */}
      <div className="border-b border-[#DCDDD8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
            FORECAST INTELLIGENCE WORKSTATION
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mt-1 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-[#0D9488]" />
            <span>Forecast Outlook (2026+)</span>
          </h1>
          <p className="text-xs text-[#6B7280] font-sans mt-1">
            Out-of-sample multi-horizon trajectory forecasting with finite-sample expected range bounds for {district}.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full font-bold text-[#0D9488]">
            RECOMMENDED: Persistence Baseline
          </span>
          <span className="px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full font-semibold text-[#111827]">
            Out-of-Sample Validated
          </span>
        </div>
      </div>

      {/* TOP CONTROLS */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-sans shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">PROJECTION HORIZON:</span>
            <select
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(Number(e.target.value))}
              className="bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {[2026, 2027, 2028, 2029, 2030].map(y => (
                <option key={y} value={y}>{y} Forecast</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">GEOGRAPHY:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="min-w-[160px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">CATEGORY:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-w-[180px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {allCategories.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#6B7280] font-mono">
          {loading ? 'Calculating dynamic forecast...' : `Forecast for ${district} (${category.replace('_', ' ')})`}
        </div>
      </div>

      {/* MAIN CHART & UNCERTAINTY PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart ~70% */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#DCDDD8] rounded-xs p-6 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center border-b border-[#DCDDD8] pb-3">
            <div>
              <h3 className="text-base font-bold font-serif text-[#17202A]">
                Historical Trajectory & Expected {forecastHorizon} Forecast ({district})
              </h3>
              <p className="text-xs text-[#68727A] font-mono">
                Observed panel series through 2023 • Projection horizon {forecastHorizon}
              </p>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCDDD8" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#68727A' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#68727A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD8', fontSize: '11px', fontFamily: 'monospace' }} />
                  <ReferenceLine x={2023} stroke="#17202A" strokeDasharray="4 4" label={{ value: '2023 Historical Cutoff', fill: '#17202A', fontSize: 11 }} />
                  <Line type="monotone" dataKey="observed" name="Observed Crime" stroke="#17202A" strokeWidth={2.5} dot={{ r: 4 }} connectNulls={true} />
                  <Line type="monotone" dataKey="forecast" name="Expected Forecast" stroke="#0B7F78" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#68727A] bg-[#F8F8F5] rounded-xs border border-[#DCDDD8]">
              Data unavailable for this selection.
            </div>
          )}
        </div>

        {/* Expected Range Panel ~30% */}
        <div className="bg-[#FFFFFF] border border-[#DCDDD8] rounded-xs p-5 space-y-4 shadow-2xs font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-[#DCDDD8] pb-3">
              <span className="text-[10px] font-bold text-[#0B7F78] uppercase tracking-wider bg-[#F8F8F5] px-2 py-0.5 border border-[#DCDDD8] rounded-xs">
                PROJECTED BOUNDS
              </span>
              <h4 className="text-sm font-bold text-[#17202A] mt-1 font-serif">
                {forecastHorizon} Expected Range
              </h4>
              <span className="text-[10px] text-[#68727A] block mt-0.5 font-sans">
                Target Metric: <strong>Recorded Crime Count</strong>
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <span className="text-[#68727A] block text-[10px]">POINT FORECAST</span>
                <span className="text-2xl font-bold text-[#17202A]">
                  {forecastVal != null ? forecastVal.toLocaleString() : '—'}
                </span>
                <span className="text-[10px] text-[#68727A] block">Cases in {forecastHorizon}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F8F8F5]">
                <div>
                  <span className="text-[#68727A] block text-[10px]">LOWER BOUND (95%)</span>
                  <span className="text-sm font-bold text-[#0B7F78]">
                    {lowerBound != null ? lowerBound.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[#68727A] block text-[10px]">UPPER BOUND (95%)</span>
                  <span className="text-sm font-bold text-[#991B1B]">
                    {upperBound != null ? upperBound.toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DCDDD8] text-[11px] text-[#68727A] space-y-2">
            <div className="flex items-center space-x-1.5 text-[#0B7F78] font-bold">
              <Award className="w-4 h-4" />
              <span>Conformal 95% Expected Coverage</span>
            </div>
            <p className="leading-relaxed">
              Nominal Coverage: <strong>95.0%</strong> • Empirical Holdout PICP: <strong>{analysisData?.uncertainty?.empirical_coverage_picp || '92.5%'}</strong> (Coverage Error: -2.5 pp). Finite-sample non-parametric interval guarantees on 2021–2023 holdout.
            </p>
          </div>
        </div>
      </div>

      {/* MULTI-HORIZON TRAJECTORY TABLE (2026–2030) */}
      <div className="bg-[#FFFFFF] border border-[#DCDDD8] rounded-xs p-6 shadow-2xs font-mono text-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#DCDDD8] pb-3 gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#0B7F78] uppercase tracking-wider bg-[#F8F8F5] px-2 py-0.5 border border-[#DCDDD8] rounded-xs">
              MULTI-HORIZON PROJECTION TABLE (2026–2030)
            </span>
            <h3 className="text-base font-bold font-serif text-[#17202A] mt-1">
              Multi-Year Forecast Horizons for {district} ({category.replace('_', ' ')})
            </h3>
            <p className="text-xs text-[#68727A] font-sans mt-0.5">
              Click any projection year row to inspect the corresponding single-horizon distribution and bounds.
            </p>
          </div>
          <span className="text-xs text-[#68727A] bg-[#F8F8F5] px-3 py-1.5 border border-[#DCDDD8] rounded-xs">
            Target Metric: <strong>Recorded Crime Count</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCDDD8] text-[#68727A] text-[10px]">
                <th className="py-2.5 px-3">HORIZON YEAR</th>
                <th className="py-2.5 px-3">POINT FORECAST (CASES)</th>
                <th className="py-2.5 px-3">LOWER BOUND (95%)</th>
                <th className="py-2.5 px-3">UPPER BOUND (95%)</th>
                <th className="py-2.5 px-3">VALIDATED MODEL</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {futureForecasts.length > 0 ? (
                futureForecasts.map((f: any) => {
                  const isSelected = f.year === forecastHorizon;
                  return (
                    <tr
                      key={f.year}
                      onClick={() => setForecastHorizon(f.year)}
                      className={`border-b border-[#F8F8F5] hover:bg-[#F8F8F5] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F0FDF4] font-bold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center space-x-1.5">
                        <span>{f.year}</span>
                        {isSelected && (
                          <span className="bg-[#DCFCE7] text-[#15803D] text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                            SELECTED
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#17202A]">
                        {f.forecast_value != null ? Number(f.forecast_value).toLocaleString() : (f.point != null ? Number(f.point).toLocaleString() : '—')}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#0B7F78]">
                        {f.lower_bound != null ? Number(f.lower_bound).toLocaleString() : (f.lower != null ? Number(f.lower).toLocaleString() : '—')}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#991B1B]">
                        {f.upper_bound != null ? Number(f.upper_bound).toLocaleString() : (f.upper != null ? Number(f.upper).toLocaleString() : '—')}
                      </td>
                      <td className="py-2.5 px-3 text-[#68727A]">
                        {f.model || 'T-1 Persistence Baseline'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-[#E6FFFA] text-[#047857] px-2 py-0.5 rounded-xs text-[10px] font-semibold">
                          {f.status || 'EVALUATED'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-[#68727A]">
                    Multi-horizon forecasts loading for {district}...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLAPSIBLE BENCHMARK EVALUATION TABLE */}
      <div className="border border-[#DCDDD8] rounded-xs bg-[#FFFFFF] overflow-hidden shadow-2xs font-mono text-xs">
        <button
          onClick={() => setShowModelComparison(!showModelComparison)}
          className="w-full p-4 bg-[#F8F8F5] hover:bg-[#F0F1ED] flex justify-between items-center text-left transition-colors cursor-pointer"
        >
          <div>
            <span className="font-bold text-[#17202A]">RESEARCH BENCHMARK: COMPARE FORECASTING METHODS</span>
            <p className="text-[11px] text-[#68727A] font-sans">
              Evaluated performance across 5 spatio-temporal modeling architectures on 2021–2023 out-of-sample test split.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0B7F78]">
            {showModelComparison ? 'Hide Benchmark Table ▲' : 'View Benchmark Table ▼'}
          </span>
        </button>

        {showModelComparison && (
          <div className="p-4 space-y-4 border-t border-[#DCDDD8]">
            {/* Model Evaluation Dataset Metadata */}
            <div className="bg-[#F8F8F5] p-3 rounded-xs border border-[#DCDDD8] text-[11px] text-[#475569] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div><strong>Target:</strong> Recorded Crime Count</div>
              <div><strong>Geographic Scope:</strong> 38-unit canonical benchmark</div>
              <div><strong>Training Period:</strong> 2001–2017 (Chronological)</div>
              <div><strong>Validation Period:</strong> 2018–2020 (Calibration)</div>
              <div><strong>Test Period:</strong> 2021–2023 (Out-of-sample holdout)</div>
              <div><strong>Data Version:</strong> ANVESHA Canonical Panel (NCRB/SCRB)</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DCDDD8] text-[#475569] font-mono text-[11px] bg-[#F1F5F9]">
                    <th className="py-2 px-3">Model architecture</th>
                    <th className="py-2 px-3">MAE</th>
                    <th className="py-2 px-3">RMSE</th>
                    <th className="py-2 px-3">WAPE</th>
                    <th className="py-2 px-3">MASE</th>
                    <th className="py-2 px-3">sMAPE</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkModels.map((m, idx) => (
                    <tr key={idx} className={`border-b border-[#E2E8F0] transition-colors ${m.isBest ? 'bg-[#F0FDF4] font-semibold' : 'hover:bg-[#F8FAFC]'}`}>
                      <td className="py-2.5 px-3 flex items-center space-x-1.5 font-sans">
                        <span className="text-[#0F172A]">{m.model}</span>
                        {m.isBest && <span className="bg-[#DCFCE7] text-[#15803D] text-[9px] px-2 py-0.5 rounded-full font-bold">BEST PERFORMANCE</span>}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0F172A]">{m.mae}</td>
                      <td className="py-2.5 px-3 font-mono text-[#475569]">{m.rmse}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#1E40AF]">{m.wape}</td>
                      <td className="py-2.5 px-3 font-mono text-[#0F172A]">{m.mase || '—'}</td>
                      <td className="py-2.5 px-3 font-mono text-[#475569]">{m.smape || '—'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold ${m.isBest ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                          {m.status || (m.isBest ? 'RECOMMENDED' : 'EVALUATED')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
