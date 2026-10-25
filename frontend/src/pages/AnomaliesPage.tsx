import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { anomalyApi, districtApi } from '../services/api';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'ALL_CRIME', label: 'All Recorded Crime' },
  { id: 'VIOLENT', label: 'Violent Crime' },
  { id: 'PROPERTY', label: 'Property Crime' },
  { id: 'ECONOMIC', label: 'Economic Crime' },
  { id: 'CYBER', label: 'Cyber Crime' },
  { id: 'WOMEN_AND_CHILDREN', label: 'Women & Children' },
  { id: 'PUBLIC_ORDER', label: 'Public Order' },
  { id: 'OTHER', label: 'Other' }
];

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [totalDetected, setTotalDetected] = useState<number>(0);
  const [unitsList, setUnitsList] = useState<string[]>([]);
  
  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  // Modal Detail State
  const [activeAnomaly, setActiveAnomaly] = useState<any | null>(null);

  useEffect(() => {
    districtApi.getDistricts('TAMIL NADU')
      .then((res) => {
        if (res?.districts?.length) {
          setUnitsList(res.districts);
        }
      })
      .catch(console.error);

    anomalyApi.getAnomalies()
      .then((res) => {
        if (res?.anomalies) {
          setAnomalies(res.anomalies);
          setTotalDetected(res.total_anomalies || res.anomalies.length);
        }
      })
      .catch(console.error);
  }, []);

  const severeCount = anomalies.filter((a: any) => a.severity === 'SEVERE_ANOMALY').length;
  const watchCount = anomalies.filter((a: any) => a.severity === 'WATCH' || a.severity === 'ANOMALOUS').length;

  const filtered = anomalies.filter((item: any) => {
    if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedUnit !== 'ALL' && (item.reporting_unit || item.district) !== selectedUnit) return false;
    if (selectedYear !== 'ALL' && String(item.year) !== selectedYear) return false;
    return true;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'SEVERE_ANOMALY':
        return 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      case 'ANOMALOUS':
        return 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]';
      case 'WATCH':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      default:
        return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#0F172A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Anomalies
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Statistically unusual aggregate crime volume deviations detected by Isolation Forest.
        </p>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase">ANOMALIES DETECTED</div>
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{totalDetected}</div>
            <div className="text-[10px] text-[#64748B] font-mono">Isolation Forest Model</div>
          </div>
          <AlertTriangle className="w-7 h-7 text-[#2563EB] opacity-80" />
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase">LATEST ANOMALIES</div>
            <div className="text-2xl font-bold font-mono text-[#D97706]">{watchCount}</div>
            <div className="text-[10px] text-[#64748B] font-mono">Watch & Anomalous Flags</div>
          </div>
          <ShieldCheck className="w-7 h-7 text-[#D97706] opacity-80" />
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase">SEVERE ANOMALIES</div>
            <div className="text-2xl font-bold font-mono text-[#991B1B]">{severeCount}</div>
            <div className="text-[10px] text-[#64748B] font-mono">High Statistical Deviation</div>
          </div>
          <AlertTriangle className="w-7 h-7 text-[#991B1B] opacity-80" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xs font-semibold text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="SEVERE_ANOMALY">Severe Anomaly</option>
            <option value="ANOMALOUS">Anomalous</option>
            <option value="WATCH">Watch</option>
            <option value="NORMAL">Normal</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xs font-semibold text-[#0F172A] cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xs font-semibold text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Reporting Units</option>
            {unitsList.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xs font-semibold text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Years</option>
            {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-[#64748B]">
          Showing {filtered.length} of {totalDetected} anomalies
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F8FAFC] text-[#475569] font-mono text-[11px] uppercase border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3">Reporting Unit</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Observed</th>
                <th className="p-3 text-right">Expected</th>
                <th className="p-3 text-right">Difference</th>
                <th className="p-3 text-right">Change %</th>
                <th className="p-3 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((item: any, idx: number) => {
                const obs = item.observed ?? item.observed_count ?? 0;
                const exp = item.expected ?? item.historical_baseline ?? 0;
                const diff = item.difference ?? (obs - exp);
                const chg = item.change_pct ?? item.percentage_deviation ?? 0;
                const unitName = item.reporting_unit || item.district || 'CHENNAI';

                return (
                  <tr
                    key={idx}
                    onClick={() => setActiveAnomaly(item)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-[#0F172A]">{item.year}</td>
                    <td className="p-3 font-bold text-[#0F172A]">{unitName}</td>
                    <td className="p-3 text-[#475569] font-mono text-[11px]">{item.category || item.crime_category}</td>
                    <td className="p-3 text-right font-mono font-bold text-[#0F172A]">
                      {obs ? Number(obs).toLocaleString() : '—'}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {exp ? Number(exp).toLocaleString() : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#334155]">
                      {diff > 0 ? `+${Number(diff).toLocaleString()}` : Number(diff).toLocaleString()}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold ${chg > 0 ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                      {chg > 0 ? `+${chg}%` : `${chg}%`}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-xs border ${getSeverityBadge(item.severity)}`}>
                        {item.user_severity || item.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clicked Anomaly Explanation Modal */}
      {activeAnomaly && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-sm max-w-lg w-full p-6 space-y-4 shadow-xl text-xs font-sans">
            <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Statistical Anomaly Detail
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  {activeAnomaly.reporting_unit || activeAnomaly.district} • {activeAnomaly.year} • {activeAnomaly.category || activeAnomaly.crime_category}
                </p>
              </div>
              <button
                onClick={() => setActiveAnomaly(null)}
                className="text-[#64748B] hover:text-[#0F172A] cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-mono bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xs">
              <div className="flex justify-between">
                <span>Observed Volume:</span>
                <strong className="text-[#0F172A]">{(activeAnomaly.observed ?? activeAnomaly.observed_count ?? 0).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Modelled Baseline:</span>
                <strong className="text-[#64748B]">{(activeAnomaly.expected ?? activeAnomaly.historical_baseline ?? 0).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Difference:</span>
                <strong className="text-[#0F172A]">{(activeAnomaly.difference ?? 0).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Percentage Deviation:</span>
                <strong className="text-[#991B1B]">+{activeAnomaly.change_pct ?? activeAnomaly.percentage_deviation}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Anomaly Severity:</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs ${getSeverityBadge(activeAnomaly.severity)}`}>
                  {activeAnomaly.user_severity || activeAnomaly.severity}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xs text-[#1E3A8A] space-y-1">
              <div className="font-bold">Interpretation</div>
              <p>
                Observed {activeAnomaly.category || activeAnomaly.crime_category} volume was substantially above the modelled baseline for {activeAnomaly.reporting_unit || activeAnomaly.district} in {activeAnomaly.year}.
              </p>
            </div>

            <div className="p-3 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xs text-[#92400E] text-[11px] leading-relaxed">
              <strong>Disclaimer:</strong> Anomaly flags describe statistically unusual aggregate observations. They are not evidence of individual wrongdoing or official misconduct.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveAnomaly(null)}
                className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
