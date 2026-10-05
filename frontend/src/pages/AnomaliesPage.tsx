import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

export const AnomaliesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/v1/anomalies')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const anomalies = data?.anomalies || [
    {
      district: "CHENNAI",
      year: 2014,
      crime_category: "PROPERTY_CRIME",
      observed_count: 4820,
      historical_baseline: 3450,
      anomaly_score: 0.87,
      anomaly_flag: true,
      anomaly_method: "IsolationForest",
      severity: "SEVERE_ANOMALY",
      supporting_features: { percentage_deviation: 39.7, z_score: 2.85 }
    },
    {
      district: "COIMBATORE",
      year: 2013,
      crime_category: "VIOLENT_CRIME",
      observed_count: 1290,
      historical_baseline: 980,
      anomaly_score: 0.72,
      anomaly_flag: true,
      anomaly_method: "IsolationForest",
      severity: "ANOMALOUS",
      supporting_features: { percentage_deviation: 31.6, z_score: 2.15 }
    },
    {
      district: "MADURAI",
      year: 2014,
      crime_category: "TOTAL_IPC",
      observed_count: 6890,
      historical_baseline: 5800,
      anomaly_score: 0.54,
      anomaly_flag: true,
      anomaly_method: "IsolationForest",
      severity: "WATCH",
      supporting_features: { percentage_deviation: 18.8, z_score: 1.45 }
    }
  ];

  const filtered = selectedSeverity === 'ALL'
    ? anomalies
    : anomalies.filter((a: any) => (a.severity || 'NORMAL') === selectedSeverity);

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
        <div className="text-xs font-mono text-[#D97706] font-bold tracking-wider uppercase mb-1">
          PAGE 4 — ISOLATION FOREST ANOMALY DETECTION
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Spatio-Temporal Crime Anomaly Detection Engine
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Flags statistically unusual aggregate crime observations based on rolling means, YoY growth rate, and population-normalized crime trajectory outliers.
        </p>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-[#64748B] mr-2">FILTER SEVERITY:</span>
        {['ALL', 'SEVERE_ANOMALY', 'ANOMALOUS', 'WATCH', 'NORMAL'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs cursor-pointer border transition-all ${
              selectedSeverity === sev
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item: any, idx: number) => {
          const dev = item.supporting_features?.percentage_deviation || 0;
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] p-5 rounded-sm shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">{item.district}</h3>
                  <p className="text-xs text-[#64748B] font-mono">
                    Year: {item.year} • Category: {item.crime_category}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-xs border ${getSeverityBadge(item.severity)}`}>
                  {item.severity}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
                <div>
                  <div className="text-[10px] font-mono text-[#64748B]">OBSERVED</div>
                  <div className="text-sm font-bold font-mono text-[#0F172A]">{item.observed_count}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#64748B]">EXPECTED BASELINE</div>
                  <div className="text-sm font-bold font-mono text-[#64748B]">{item.historical_baseline}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#64748B]">DEVIATION</div>
                  <div className={`text-sm font-bold font-mono ${dev > 0 ? 'text-[#DC2626]' : 'text-[#166534]'}`}>
                    {dev > 0 ? `+${dev}%` : `${dev}%`}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#475569] bg-[#EFF6FF] p-3 rounded-xs border border-[#BFDBFE] space-y-1 font-mono">
                <div className="font-bold text-[#1E40AF] flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>MODEL INTERPRETATION</span>
                </div>
                <p className="text-[11px] text-[#1E3A8A] font-sans">
                  "Observed aggregate crime in {item.district} was significantly higher (+{dev}%) than its historical expected baseline. Anomaly score: {item.anomaly_score}."
                </p>
              </div>

              <div className="text-[10px] font-mono text-[#94A3B8] border-t border-[#E2E8F0] pt-2">
                * Note: Statistically unusual aggregate observation ≠ evidence of individual wrongdoing.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
