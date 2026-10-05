import React, { useEffect, useState } from 'react';
import { Download, Activity, FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { districtApi } from '../services/api';
import type { DistrictAnalyticsResponse } from '../types';
import { ApiLoadingState, ApiErrorState } from '../components/ui/ApiStateHandlers';

interface CrimeAnalysisPageProps {
  selectedState?: string;
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
}

export const CrimeAnalysisPage: React.FC<CrimeAnalysisPageProps> = ({
  selectedState,
  selectedUnit,
  selectedCategory,
  selectedYear,
}) => {
  const [analytics, setAnalytics] = useState<DistrictAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchAnalytics = () => {
    setLoading(true);
    setError(false);
    districtApi
      .getDistrictAnalytics(selectedUnit, selectedState, selectedCategory)
      .then((res) => {
        setAnalytics(res);
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching district analytics:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedState, selectedUnit, selectedCategory, selectedYear]);

  if (loading) return <ApiLoadingState message={`Fetching official observation records for ${selectedUnit}...`} />;
  if (error) return <ApiErrorState message={`Unable to load analytics for ${selectedUnit}.`} onRetry={fetchAnalytics} />;

  const historicalCrime = analytics?.data?.historical_crime || [];
  const latestCount = analytics?.data?.latest_crime_count || 0;
  const yoyPct = analytics?.data?.year_over_year_change_pct || 0;
  const trendDir = analytics?.data?.trend || 'STABLE';
  const populationInfo = analytics?.data?.population_info;

  // Process data for charts & editorial table
  const processedTable = historicalCrime.map((item, idx) => {
    const prev = idx > 0 ? historicalCrime[idx - 1].crime_count : null;
    const yoy = prev && prev > 0 ? Math.round(((item.crime_count - prev) / prev) * 1000) / 10 : 0;
    
    let rollingMean = item.crime_count;
    if (idx >= 2) {
      rollingMean = Math.round((historicalCrime[idx].crime_count + historicalCrime[idx - 1].crime_count + historicalCrime[idx - 2].crime_count) / 3);
    } else if (idx === 1) {
      rollingMean = Math.round((historicalCrime[idx].crime_count + historicalCrime[idx - 1].crime_count) / 2);
    }

    return {
      year: item.year,
      crime_count: item.crime_count,
      yoy_change: yoy,
      rolling_mean: rollingMean,
      data_type: 'OBSERVED',
    };
  });

  const handleExportCSV = () => {
    if (!processedTable.length) return;
    const headers = ['Year', 'Police_Unit', 'Category', 'Observed_Volume', 'YoY_Change_Pct', '3Yr_Rolling_Mean', 'Provenance'];
    const rows = processedTable.map((d) => [
      d.year,
      `"${selectedUnit}"`,
      `"${selectedCategory}"`,
      d.crime_count,
      d.yoy_change,
      d.rolling_mean,
      d.data_type,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ANVESHA_Observed_Crime_${selectedUnit}_${selectedCategory}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            RESEARCH WORKSPACE / ANALYZE
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            CRIME ANALYSIS
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            "Observed patterns across reporting units and crime categories." — <strong className="text-[#111111]">{selectedUnit.replace(/_/g, ' ')}</strong> ({selectedCategory.replace(/_/g, ' ')})
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#1A1A1A] hover:text-white text-[#111111] border border-[#1A1A1A] text-xs font-mono font-bold transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT CSV DATA</span>
        </button>
      </div>

      {/* Metric Blocks Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="editorial-card p-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">LATEST VOLUME</span>
            <span className="badge-observed">OBSERVED</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#111111]">{latestCount.toLocaleString()}</div>
          <div className="text-[10px] font-mono text-[#4B4B4B]">NCRB Recorded FIR Count</div>
        </div>

        <div className="editorial-card p-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">YoY CHANGE</span>
            <span className="badge-derived">DERIVED</span>
          </div>
          <div className={`text-3xl font-serif font-bold ${yoyPct > 0 ? 'text-[#A61B1B]' : yoyPct < 0 ? 'text-[#26734D]' : 'text-[#111111]'}`}>
            {yoyPct > 0 ? '+' : ''}{yoyPct.toFixed(1)}%
          </div>
          <div className="text-[10px] font-mono text-[#4B4B4B]">Direction: {trendDir}</div>
        </div>

        <div className="editorial-card p-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">HISTORICAL RANGE</span>
            <span className="badge-observed">OBSERVED</span>
          </div>
          <div className="text-xl font-serif font-bold text-[#111111]">2001–2023</div>
          <div className="text-[10px] font-mono text-[#4B4B4B]">Master Series (23 Years)</div>
        </div>

        <div className="editorial-card p-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">POPULATION (2011)</span>
            <span className="badge-derived">CENSUS</span>
          </div>
          <div className="text-xl font-serif font-bold text-[#111111]">
            {populationInfo?.population_2011 ? populationInfo.population_2011.toLocaleString() : 'Unavailable'}
          </div>
          <div className="text-[10px] font-mono text-[#4B4B4B]">{populationInfo?.mapping_type || 'Census Mapping'}</div>
        </div>
      </div>

      {/* Historical Line Chart */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-[#D8D6D0] pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#A61B1B]" />
            <h3 className="font-serif font-bold text-base text-[#111111]">
              Historical Crime Volume Trajectory (2001–2023)
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono text-[#4B4B4B]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#111111] inline-block" /> Solid Line = Observed Data
            </span>
          </div>
        </div>

        {processedTable.length > 0 && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedTable} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#D8D6D0" vertical={false} />
                <XAxis dataKey="year" stroke="#4B4B4B" fontSize={11} tickLine={false} fontFamily="IBM Plex Mono" />
                <YAxis stroke="#4B4B4B" fontSize={11} tickLine={false} fontFamily="IBM Plex Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1A1A1A', borderRadius: '2px', fontSize: '12px', color: '#111111', fontFamily: 'IBM Plex Mono' }}
                  formatter={(val: any) => [Number(val).toLocaleString(), 'FIR Count']}
                  labelFormatter={(lbl) => `Year: ${lbl}`}
                />
                <Line
                  type="monotone"
                  dataKey="crime_count"
                  stroke="#111111"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#A61B1B', stroke: '#111111', strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: '#A61B1B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Editorial Table of Historical Observations */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-[#111111]" />
            <h3 className="font-serif font-bold text-base text-[#111111]">
              ANNUAL OBSERVATION DATA TABLE
            </h3>
          </div>
          <span className="font-mono text-xs text-[#777777]">PROVENANCE: STRICT AUDIT</span>
        </div>

        <div className="border border-[#D8D6D0] overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F0EB] border-b border-[#D8D6D0] text-[#777777] uppercase text-[10px]">
                <th className="py-2.5 px-4">YEAR</th>
                <th className="py-2.5 px-4 text-right">OBSERVED VOLUME</th>
                <th className="py-2.5 px-4 text-right">YoY CHANGE</th>
                <th className="py-2.5 px-4 text-right">3-YR ROLLING MEAN</th>
                <th className="py-2.5 px-4 text-center">PROVENANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D6D0] text-[#111111]">
              {processedTable.map((row) => (
                <tr key={row.year} className="hover:bg-[#F8F7F3] transition-colors">
                  <td className="py-2.5 px-4 font-bold">{row.year}</td>
                  <td className="py-2.5 px-4 text-right font-bold">{row.crime_count.toLocaleString()}</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${row.yoy_change > 0 ? 'text-[#A61B1B]' : row.yoy_change < 0 ? 'text-[#26734D]' : 'text-[#111111]'}`}>
                    {row.yoy_change > 0 ? '+' : ''}{row.yoy_change.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#4B4B4B]">{row.rolling_mean.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="badge-observed">OBSERVED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
