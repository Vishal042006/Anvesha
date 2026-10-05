import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity } from 'lucide-react';
import { anomalyApi } from '../services/api';
import type { AnomalyResponse } from '../types';
import { ApiLoadingState, ApiErrorState, ApiEmptyState } from '../components/ui/ApiStateHandlers';

interface AnomalyAnalysisPageProps {
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
}

export const AnomalyAnalysisPage: React.FC<AnomalyAnalysisPageProps> = ({
  selectedUnit,
  selectedCategory,
  selectedYear,
}) => {
  const [anomalyResponse, setAnomalyResponse] = useState<AnomalyResponse | null>(null);
  const [filterOnlyAnomalies, setFilterOnlyAnomalies] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchAnomalies = () => {
    setLoading(true);
    setError(false);
    anomalyApi
      .getAnomalies(selectedUnit, selectedYear, selectedCategory, 'IsolationForest')
      .then((res) => {
        setAnomalyResponse(res);
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching anomalies:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnomalies();
  }, [selectedUnit, selectedCategory, selectedYear]);

  if (loading) return <ApiLoadingState message="Scanning for statistical volume anomalies using IsolationForest..." />;
  if (error) return <ApiErrorState message="Unable to load anomaly analysis from ANVESHA backend." onRetry={fetchAnomalies} />;

  const anomalies = anomalyResponse?.anomalies || [];
  const displayedList = filterOnlyAnomalies ? anomalies.filter((a) => a.anomaly_flag) : anomalies;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            RESEARCH WORKSPACE / ANOMALIES
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            STATISTICAL ANOMALIES
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            "Unusual aggregate crime-volume trajectories requiring contextual review." — <strong className="text-[#111111]">{selectedUnit.replace(/_/g, ' ')}</strong> ({selectedCategory.replace(/_/g, ' ')})
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="badge-synthetic px-3 py-1">ISOLATION FOREST</span>
          <span className="bg-[#B7791F] text-white font-bold px-3 py-1 uppercase tracking-wider">
            ANOMALY ≠ INVESTIGATION
          </span>
        </div>
      </div>

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="bg-[#FFFFFF] border-l-4 border-l-[#B7791F] border border-[#D8D6D0] p-4 text-xs space-y-1">
        <div className="font-mono font-bold text-[#B7791F] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          VERY IMPORTANT LEGAL & ETHICAL DISCLAIMER:
        </div>
        <p className="text-[#4B4B4B] leading-relaxed font-sans text-xs">
          "Statistical anomaly flags indicate aggregate population-volume trajectory outliers. They are not evidence of individual wrongdoing, misconduct, or criminal intent."
        </p>
      </div>

      {/* Timeline View of Trajectory Outliers */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-[#D8D6D0] pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#B7791F]" />
            <h3 className="font-serif font-bold text-base text-[#111111]">
              ANOMALY TIMELINE TRAJECTORY (2001–2023)
            </h3>
          </div>

          <button
            onClick={() => setFilterOnlyAnomalies(!filterOnlyAnomalies)}
            className={`px-3 py-1 font-mono text-xs font-bold border transition-colors cursor-pointer ${
              filterOnlyAnomalies
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0] hover:bg-[#D8D6D0]'
            }`}
          >
            {filterOnlyAnomalies ? 'SHOWING FLAGGED OUTLIERS ONLY' : 'SHOWING ALL TIMELINE YEARS'}
          </button>
        </div>

        <div className="space-y-2 py-2">
          <div className="text-xs font-mono text-[#777777]">YEARLY TRAJECTORY STATE:</div>
          <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-23 gap-1">
            {anomalies.map((item) => (
              <div
                key={item.year}
                className={`p-1 text-center font-mono text-[10px] border transition-colors cursor-pointer ${
                  item.anomaly_flag
                    ? 'bg-[#FFFBEB] text-[#B7791F] border-[#B7791F] font-bold'
                    : 'bg-[#F1F0EB] text-[#4B4B4B] border-[#D8D6D0]'
                }`}
                title={`Year ${item.year}: ${item.anomaly_flag ? 'UNUSUAL TRAJECTORY' : 'NORMAL'} (Volume: ${item.observed_count})`}
              >
                <div>{item.year.toString().slice(-2)}</div>
                <div className="mt-0.5 text-[8px] font-bold">
                  {item.anomaly_flag ? '★' : '•'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Anomaly Data Table */}
      <div className="editorial-card p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
          STATISTICAL TRAJECTORY OUTLIER REGISTRY
        </h3>

        {displayedList.length > 0 ? (
          <div className="border border-[#D8D6D0] overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F0EB] border-b border-[#D8D6D0] text-[#777777] text-[10px] uppercase">
                  <th className="py-2.5 px-3">YEAR</th>
                  <th className="py-2.5 px-3">POLICE UNIT</th>
                  <th className="py-2.5 px-3">CATEGORY</th>
                  <th className="py-2.5 px-3 text-right">OBSERVED VOLUME</th>
                  <th className="py-2.5 px-3 text-right">HISTORICAL BASELINE</th>
                  <th className="py-2.5 px-3 text-right">ANOMALY SCORE</th>
                  <th className="py-2.5 px-3 text-center">STATUS</th>
                  <th className="py-2.5 px-3 text-center">PROVENANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D6D0] text-[#111111]">
                {displayedList.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-[#F8F7F3] ${row.anomaly_flag ? 'bg-[#FFFBEB]/50' : ''}`}>
                    <td className="py-2.5 px-3 font-bold">{row.year}</td>
                    <td className="py-2.5 px-3 font-bold">{row.district.replace(/_/g, ' ')}</td>
                    <td className="py-2.5 px-3 text-[#4B4B4B]">{row.crime_category.replace(/_/g, ' ')}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{row.observed_count.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-[#777777]">{row.historical_baseline ? row.historical_baseline.toLocaleString() : '—'}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#B7791F]">
                      {row.anomaly_score !== undefined ? row.anomaly_score.toFixed(3) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase ${row.anomaly_flag ? 'bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]' : 'bg-[#ECFDF5] text-[#26734D] border-[#A7F3D0]'}`}>
                        {row.anomaly_flag ? 'UNUSUAL TRAJECTORY' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="badge-synthetic">MODELLED OUTLIER</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ApiEmptyState title="No Anomalies Found" message="No trajectory outliers detected for the selected parameters." />
        )}
      </div>
    </div>
  );
};
