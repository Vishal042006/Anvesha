import React, { useEffect, useState } from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { trendApi, explainabilityApi } from '../services/api';
import type { TrendItem, TrendResponse, ExplainabilityResponse } from '../types';
import { ApiLoadingState, ApiErrorState, ApiEmptyState } from '../components/ui/ApiStateHandlers';

interface TrendAnalysisPageProps {
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
}

export const TrendAnalysisPage: React.FC<TrendAnalysisPageProps> = ({
  selectedUnit,
  selectedCategory,
  selectedYear,
}) => {
  const [trendData, setTrendData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<ExplainabilityResponse | null>(null);
  const [loadingExplain, setLoadingExplain] = useState<boolean>(false);

  const fetchTrends = () => {
    setLoading(true);
    setError(false);
    trendApi
      .getTrends(selectedUnit, selectedCategory, 5.0)
      .then((res) => {
        setTrendData(res);
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching trends:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrends();
  }, [selectedUnit, selectedCategory, selectedYear]);

  const handleFetchExplanation = () => {
    setLoadingExplain(true);
    const predId = `PRED_${selectedUnit}_${selectedCategory}_${selectedYear}`;
    explainabilityApi
      .getExplanation(predId)
      .then((res) => {
        setExplanation(res);
      })
      .catch((err) => {
        console.error('Error fetching explanation:', err);
      })
      .finally(() => setLoadingExplain(false));
  };

  if (loading) return <ApiLoadingState message="Loading trend direction analysis from backend..." />;
  if (error) return <ApiErrorState message="Unable to load trend analysis from ANVESHA API." onRetry={fetchTrends} />;

  const currentTrend: TrendItem | undefined = trendData?.trends?.find(
    (t) =>
      t.district.toUpperCase() === selectedUnit.toUpperCase() ||
      t.district.replace(/_/g, ' ').toUpperCase() === selectedUnit.replace(/_/g, ' ').toUpperCase()
  ) || trendData?.trends?.[0];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            RESEARCH WORKSPACE / TRENDS
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            TREND INTELLIGENCE
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            Classification of annual crime trajectory direction into INCREASING, STABLE, or DECREASING.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="badge-observed">TARGET A (±5% YoY)</span>
          <span className="badge-modelled">LIGHTGBM V3.4</span>
        </div>
      </div>

      {/* Selected Unit Active Trend Card */}
      {currentTrend ? (
        <div className="editorial-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8D6D0] pb-4">
            <div>
              <div className="text-xs font-mono text-[#777777] uppercase font-bold">SELECTED UNIT & CATEGORY</div>
              <div className="text-xl font-serif font-bold text-[#111111]">
                {currentTrend.district.replace(/_/g, ' ')} — {currentTrend.crime_category.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="flex items-center space-x-3 font-mono">
              <span className="text-xs text-[#777777] uppercase font-bold">PREDICTED DIRECTION:</span>
              <span
                className={`px-3 py-1 font-bold text-xs border uppercase tracking-wider ${
                  currentTrend.trend_direction === 'INCREASING'
                    ? 'bg-[#FEF2F2] text-[#A61B1B] border-[#FECACA]'
                    : currentTrend.trend_direction === 'DECREASING'
                    ? 'bg-[#ECFDF5] text-[#26734D] border-[#A7F3D0]'
                    : 'bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]'
                }`}
              >
                {currentTrend.trend_direction}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0]">
              <div className="text-[#777777] text-[10px]">PREVIOUS YEAR ({currentTrend.previous_year})</div>
              <div className="text-xl font-bold text-[#111111] mt-0.5">{currentTrend.previous_count.toLocaleString()}</div>
              <div className="text-[10px] text-[#4B4B4B] font-sans mt-0.5">Observed FIR Volume</div>
            </div>

            <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0]">
              <div className="text-[#777777] text-[10px]">LATEST YEAR ({currentTrend.latest_year})</div>
              <div className="text-xl font-bold text-[#111111] mt-0.5">{currentTrend.latest_count.toLocaleString()}</div>
              <div className="text-[10px] text-[#4B4B4B] font-sans mt-0.5">Observed FIR Volume</div>
            </div>

            <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0]">
              <div className="text-[#777777] text-[10px]">OBSERVED YoY CHANGE</div>
              <div className={`text-xl font-bold mt-0.5 ${currentTrend.yoy_change_pct > 0 ? 'text-[#A61B1B]' : currentTrend.yoy_change_pct < 0 ? 'text-[#26734D]' : 'text-[#111111]'}`}>
                {currentTrend.yoy_change_pct > 0 ? '+' : ''}{currentTrend.yoy_change_pct.toFixed(1)}%
              </div>
              <div className="text-[10px] text-[#4B4B4B] font-sans mt-0.5">Calculated Trajectory</div>
            </div>

            <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0]">
              <div className="text-[#777777] text-[10px]">MODEL ACCURACY BENCHMARK</div>
              <div className="text-xl font-bold text-[#2457A6] mt-0.5">80.59%</div>
              <div className="text-[10px] text-[#4B4B4B] font-sans mt-0.5">V3.4 Chronological Test</div>
            </div>
          </div>

          {/* Explainability Trigger & Drawer */}
          <div className="pt-3 border-t border-[#D8D6D0] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="text-xs text-[#4B4B4B]">
              <strong className="text-[#111111]">Feature Attribution:</strong> Inspect how historical crime volume lags ($T-1, T-2, T-3$) contributed to this prediction.
            </div>
            <button
              onClick={handleFetchExplanation}
              disabled={loadingExplain}
              className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#A61B1B] text-white text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{loadingExplain ? 'CALCULATING...' : 'EXPLAIN MODEL PREDICTION'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {explanation && (
            <div className="editorial-card-strong p-4 space-y-3 bg-[#F8F7F3]">
              <div className="font-serif font-bold text-sm text-[#111111] flex items-center justify-between border-b border-[#D8D6D0] pb-2">
                <span>MODEL EXPLANATION & FEATURE CONTRIBUTION</span>
                <span className="font-mono text-[10px] text-[#777777]">ID: {explanation.prediction_id}</span>
              </div>
              
              <div className="space-y-2 font-mono text-xs">
                {explanation.feature_contributions.map((fc, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#D8D6D0]">
                    <span className="text-[#111111] font-bold">{fc.feature}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#777777]">Value: {fc.value}</span>
                      <span className={`font-bold ${fc.contribution >= 0 ? 'text-[#26734D]' : 'text-[#A61B1B]'}`}>
                        {fc.contribution >= 0 ? '+' : ''}{fc.contribution.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-[#777777] font-mono border-t border-[#D8D6D0] pt-2">
                * Feature contribution indicates model behavior, not physical causation.
              </div>
            </div>
          )}
        </div>
      ) : (
        <ApiEmptyState title="No Trend Data" message="No trend predictions returned for this selection." />
      )}

      {/* Model Benchmark Performance Panel */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#111111]" />
            <h3 className="font-serif font-bold text-base text-[#111111]">
              CANONICAL MODEL BENCHMARK (TARGET A)
            </h3>
          </div>
          <span className="badge-observed">V3.4 EVALUATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[#777777] text-[10px]">BEST OBSERVED ACCURACY</div>
            <div className="text-3xl font-bold text-[#A61B1B]">80.59%</div>
            <div className="text-[11px] font-sans text-[#111111] font-bold">LightGBM / Voting Ensemble</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Chronological Test (2021–2023, N=639)</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[#777777] text-[10px]">BEST MACRO-F1 SCORE</div>
            <div className="text-3xl font-bold text-[#2457A6]">0.6367</div>
            <div className="text-[11px] font-sans text-[#111111] font-bold">Balanced Random Forest</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Accounts for Class Imbalance</div>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
            <div className="text-[#777777] text-[10px]">BALANCED ACCURACY</div>
            <div className="text-3xl font-bold text-[#26734D]">65.41%</div>
            <div className="text-[11px] font-sans text-[#111111] font-bold">Resampled Evaluation</div>
            <div className="text-[10px] text-[#4B4B4B] font-sans">Non-trivial Trend Direction Gain</div>
          </div>
        </div>

        <div className="p-3 bg-[#F8F7F3] border border-[#D8D6D0] text-xs font-sans text-[#4B4B4B]">
          <strong className="text-[#111111]">Evaluated Performance Claim:</strong> "Best observed leakage-free performance among evaluated V3.4 configurations." Historical 94% claims are deprecated.
        </div>
      </div>
    </div>
  );
};
