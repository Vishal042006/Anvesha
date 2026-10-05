import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { anomalyApi } from '../services/api';

export const AnomaliesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    anomalyApi.getAnomalies()
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
      severity: "SEVERE_ANOMALY",
      percentage_deviation: 39.7
    },
    {
      district: "COIMBATORE",
      year: 2013,
      crime_category: "VIOLENT_CRIME",
      observed_count: 1290,
      historical_baseline: 980,
      anomaly_score: 0.72,
      anomaly_flag: true,
      severity: "ANOMALOUS",
      percentage_deviation: 31.6
    },
    {
      district: "MADURAI",
      year: 2014,
      crime_category: "TOTAL_IPC",
      observed_count: 6890,
      historical_baseline: 5800,
      anomaly_score: 0.54,
      anomaly_flag: true,
      severity: "WATCH",
      percentage_deviation: 18.8
    },
    {
      district: "TIRUCHIRAPPALLI",
      year: 2014,
      crime_category: "PROPERTY_CRIME",
      observed_count: 3120,
      historical_baseline: 2750,
      anomaly_score: 0.48,
      anomaly_flag: true,
      severity: "WATCH",
      percentage_deviation: 13.5
    }
  ];

  const totalDetected = data?.total_anomalies || anomalies.length;
  const severeCount = anomalies.filter((a: any) => a.severity === 'SEVERE_ANOMALY').length;
  const watchCount = anomalies.filter((a: any) => a.severity === 'WATCH' || a.severity === 'ANOMALOUS').length;

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Anomalies
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Statistically unusual changes in aggregate crime observations.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#64748B] uppercase">ANOMALIES DETECTED</div>
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{totalDetected}</div>
            <div className="text-[10px] text-[#64748B] font-mono">Total Flagged Records</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-[#2563EB] opacity-80" />
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#64748B] uppercase">LATEST ANOMALIES</div>
            <div className="text-2xl font-bold font-mono text-[#D97706]">{watchCount}</div>
            <div className="text-[10px] text-[#64748B] font-mono">Watch & Anomalous Flags</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-[#D97706] opacity-80" />
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#64748B] uppercase">SEVERE ANOMALIES</div>
            <div className="text-2xl font-bold font-mono text-[#DC2626]">{severeCount}</div>
            <div className="text-[10px] text-[#64748B] font-mono">High Statistical Deviation</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-[#DC2626] opacity-80" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#0F172A] font-mono">FILTER SEVERITY:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {['ALL', 'SEVERE_ANOMALY', 'ANOMALOUS', 'WATCH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-xs cursor-pointer transition-all border ${
                selectedSeverity === sev
                  ? 'bg-[#0F172A] text-white font-bold border-[#0F172A]'
                  : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-[#EFF6FF]'
              }`}
            >
              {sev}
            </button>
          ))}
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
                <th className="p-3 text-right">Change</th>
                <th className="p-3 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((item: any, idx: number) => {
                const dev = item.percentage_deviation || item.supporting_features?.percentage_deviation || 0;
                return (
                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                    <td className="p-3 font-mono font-bold text-[#0F172A]">{item.year}</td>
                    <td className="p-3 font-bold text-[#0F172A]">{item.district}</td>
                    <td className="p-3 text-[#475569] font-mono text-[11px]">{item.crime_category}</td>
                    <td className="p-3 text-right font-mono font-bold text-[#0F172A]">
                      {item.observed_count ? item.observed_count.toLocaleString() : '—'}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {item.historical_baseline ? item.historical_baseline.toLocaleString() : '—'}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold ${dev > 0 ? 'text-[#DC2626]' : 'text-[#166534]'}`}>
                      {dev > 0 ? `+${dev.toFixed(1)}%` : `${dev.toFixed(1)}%`}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-xs border ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-sm text-xs text-[#64748B] flex items-start space-x-2 font-mono">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#0F172A]">Disclaimer:</strong> Anomaly flags indicate statistically unusual aggregate observations. They are not evidence of individual wrongdoing.
        </p>
      </div>
    </div>
  );
};
