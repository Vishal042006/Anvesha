import React, { useEffect, useState } from 'react';
import { spatialApi } from '../../services/api';
import { getDistrictPopulationRecord, calculateDistrictCrimeRatePct } from '../../utils/population';

interface UnitPanelProps {
  unitName?: string;
  year?: number;
  category?: string;
  geographyId?: string;
  recordedCrime?: number;
  currentRegime?: string;
  breakYear?: number;
  forecastVal?: number;
  lowerBound?: number;
  upperBound?: number;
  dataStatus?: string;
  onViewTrajectory: () => void;
  onCompareUnit?: () => void;
  onOpenProvenance?: () => void;
}

export const UnitPanel: React.FC<UnitPanelProps> = ({
  unitName = 'Chennai Central',
  year = 2023,
  category = 'ALL_CRIME',
  geographyId,
  breakYear,
  onViewTrajectory,
  onCompareUnit,
}) => {
  const [unitDetails, setUnitDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!unitName) return;
    setLoading(true);
    setUnitDetails(null);
    spatialApi.getUnitDetails(unitName, year, category)
      .then((data) => {
        setUnitDetails(data);
      })
      .catch(() => {
        setUnitDetails(null);
      })
      .finally(() => setLoading(false));
  }, [unitName, year, category]);

  const isCorrectUnit = Boolean(
    unitDetails &&
    (unitDetails?.geography?.name?.toUpperCase() === unitName.toUpperCase() ||
     unitDetails?.geography?.district?.toUpperCase() === unitName.toUpperCase() ||
     (unitDetails?.geography?.geography_id && unitDetails.geography.geography_id.toUpperCase().includes(unitName.toUpperCase().replace(/\s+/g, '_'))))
  );

  const activeDetails = isCorrectUnit ? unitDetails : null;
  const geoId = geographyId || activeDetails?.geography?.geography_id || `TN_${unitName.toUpperCase().replace(/\s+/g, '_')}`;
  
  // Lookup case volume specifically for active year from historical panel series
  const yearObserved = activeDetails?.crime_history?.find((h: any) => h.year === year)?.crime_count;
  const latestCases = activeDetails?.current_status?.latest_crime_count ?? activeDetails?.observed_2023;
  const recordedCases = yearObserved != null ? yearObserved : latestCases;
  const hasExactYearData = yearObserved != null;
  const casesMetricTitle = hasExactYearData ? `${year} Recorded Cases` : `Latest Available (${activeDetails?.current_status?.latest_year || 2023}) Cases`;

  const popRec = getDistrictPopulationRecord(unitName);
  const popInt = activeDetails?.current_status?.population || popRec.population;
  const popLakhs = activeDetails?.current_status?.population_lakhs || popRec.lakhs;

  const historyItem = activeDetails?.crime_history?.find((h: any) => h.year === year);
  let ratePct = historyItem?.crime_rate_pct ?? activeDetails?.current_status?.crime_rate_pct;
  if (ratePct == null && typeof recordedCases === 'number' && popInt > 0) {
    ratePct = calculateDistrictCrimeRatePct(recordedCases, popInt);
  }

  const regimeStr = historyItem?.regime || activeDetails?.current_status?.current_regime || (typeof recordedCases === 'number' ? (recordedCases > 2500 ? 'High / Increasing' : 'Stable') : (loading ? 'Loading...' : 'Stable'));
  const breakYr = activeDetails?.current_status?.pelt_change_point_year ?? activeDetails?.change_point_year ?? breakYear ?? null;
  const forecastFirst = activeDetails?.forecast?.horizons?.[0];
  const lowerB = forecastFirst?.lower ?? activeDetails?.conformal_lower_95;
  const upperB = forecastFirst?.upper ?? activeDetails?.conformal_upper_95;
  const summaryNote = activeDetails?.summary || activeDetails?.description || `Observed reporting history for ${unitName} based on canonical Tamil Nadu spatial panel data.`;

  return (
    <aside className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-2xs flex flex-col justify-between space-y-5 font-sans text-[#111827]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
            SELECTED DISTRICT
          </span>
          <span className="bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {loading ? 'Loading...' : `Active Selection (${year})`}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#111827] mt-2 tracking-tight">{unitName}</h2>
        <p className="text-xs text-[#9CA3AF] font-mono mt-0.5">Canonical ID: {geoId}</p>

        <div className="border-b border-[#F3F4F6] my-4" />

        {/* Key Precinct Metrics */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">{casesMetricTitle}</span>
            <span className="font-mono font-bold text-sm text-[#111827]">
              {recordedCases != null ? Number(recordedCases).toLocaleString() : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">District Crime Rate</span>
            <span className="font-mono font-bold text-xs text-[#0D9488]">
              {ratePct != null ? `${Number(ratePct).toFixed(2)}%` : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Total Population</span>
            <span className="font-mono font-bold text-xs text-[#111827]">
              {popLakhs} Lakhs
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Current Regime</span>
            <span className="font-mono font-bold text-xs text-[#0D9488]">
              {regimeStr}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Structural Breakpoint</span>
            <span className="font-mono font-bold text-xs text-[#991B1B]">
              {breakYr != null ? `${breakYr} Discontinuity` : 'No Strong Shift'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">95% Conformal Bounds</span>
            <span className="font-mono font-bold text-xs text-[#111827]">
              {lowerB != null && upperB != null ? `${Number(lowerB).toLocaleString()} – ${Number(upperB).toLocaleString()}` : '—'}
            </span>
          </div>
        </div>

        <div className="border-b border-[#F3F4F6] my-4" />

        {/* Explanation Paragraph */}
        <p className="text-xs text-[#6B7280] leading-relaxed">
          {summaryNote}
        </p>

        <div className="border-b border-[#F3F4F6] my-4" />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={onViewTrajectory}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 text-xs font-semibold rounded-full shadow-2xs text-center transition-all cursor-pointer"
        >
          Inspect Trajectory Curve
        </button>

        <button
          onClick={onCompareUnit || (() => alert(`Comparing metrics for ${unitName}...`))}
          className="w-full bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] py-3 text-xs font-semibold rounded-full text-center transition-all cursor-pointer"
        >
          Compare District Metrics
        </button>
      </div>
    </aside>
  );
};
