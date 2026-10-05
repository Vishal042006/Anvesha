import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const DataPage: React.FC = () => {

  const sources = [
    {
      id: 'NCRB_OFFICIAL_2001_2014',
      name: 'National Crime Records Bureau (NCRB) - Crimes in India',
      years: '2001–2014',
      granularity: 'District / Police Reporting Unit',
      records: '9,866 (399 TN panel rows)',
      provenance: 'OBSERVED',
      confidence: 'HIGH (100% Official)',
      syntheticFraction: '0.0%'
    },
    {
      id: 'SCRB_PDF_2015_2023',
      name: 'State Crime Records Bureau (SCRB) Tamil Nadu PDF Compendiums',
      years: '2015–2023',
      granularity: 'Police Station & District Level',
      records: 'Extracts from official PDF reports',
      provenance: 'VALIDATED',
      confidence: 'HIGH (Official SCRB Reports)',
      syntheticFraction: '0.0%'
    },
    {
      id: 'CENSUS_2011_GEO',
      name: 'Census 2011 India District Demographics & Coordinates',
      years: '2011',
      granularity: 'District Level Population & Area',
      records: '32 Tamil Nadu Districts',
      provenance: 'DERIVED',
      confidence: 'HIGH (Official Census)',
      syntheticFraction: '0.0%'
    },
    {
      id: 'POLICE_STATIONS_TN',
      name: 'Tamil Nadu Police Station Coordinate Inventory',
      years: '2023',
      granularity: 'Subdivision / Station Point Coordinates',
      records: '791 Police Stations',
      provenance: 'OBSERVED',
      confidence: 'HIGH (Official Roster)',
      syntheticFraction: '0.0%'
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#0F172A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="text-xs font-mono text-[#2563EB] font-bold tracking-wider uppercase mb-1">
          PAGE 2 — DATASETS & PROVENANCE TRACKING
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Data Inventory & Provenance Architecture
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          ANVESHA enforces explicit source provenance for every record. Benchmark evaluations rely exclusively on 100% observed official data with 0% synthetic substitution.
        </p>
      </div>

      {/* Primary Benchmark Status Banner */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-[#166534]">PRIMARY BENCHMARK DATASET CERTIFICATION</h2>
            <p className="text-xs text-[#15803D]">
              Canonical V1 Scope: Tamil Nadu Official NCRB District Panel (2001–2014) • Synthetic Fraction: <strong>0.0%</strong>
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-[#166534] text-white text-xs font-mono font-bold rounded-xs shrink-0">
          CANONICAL_V1 VERIFIED
        </span>
      </div>

      {/* Provenance Labels Guide */}
      <div className="bg-white p-5 border border-[#E2E8F0] rounded-sm space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#2563EB]" />
          <span>ALLOWED PROVENANCE LABELS & RULES</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xs space-y-1">
            <span className="font-bold text-[#1E40AF] font-mono">OBSERVED</span>
            <p className="text-[#3B82F6] text-[11px]">Direct official government crime records (NCRB/SCRB).</p>
          </div>
          <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xs space-y-1">
            <span className="font-bold text-[#166534] font-mono">DERIVED</span>
            <p className="text-[#15803D] text-[11px]">Population-normalized rates, YoY changes & spatial lags.</p>
          </div>
          <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xs space-y-1">
            <span className="font-bold text-[#92400E] font-mono">IMPUTED</span>
            <p className="text-[#B45309] text-[11px]">Explicit statistical gap filling (isolated to Track B).</p>
          </div>
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xs space-y-1">
            <span className="font-bold text-[#991B1B] font-mono">SYNTHETIC</span>
            <p className="text-[#DC2626] text-[11px]">Sensitivity experiments only. NEVER mixed into V1 primary.</p>
          </div>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#0F172A]">OFFICIAL SOURCE INVENTORY — TAMIL NADU</h3>
          <span className="text-xs font-mono text-[#64748B]">4 REGISTERED SOURCES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F1F5F9] text-[#475569] font-mono text-[11px] uppercase border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Source Name</th>
                <th className="p-3">Years</th>
                <th className="p-3">Granularity</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Provenance</th>
                <th className="p-3">Synthetic %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-semibold text-[#0F172A]">{src.name}</td>
                  <td className="p-3 font-mono">{src.years}</td>
                  <td className="p-3 text-[#64748B]">{src.granularity}</td>
                  <td className="p-3 font-mono">{src.records}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] rounded-xs">
                      {src.provenance}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[#166534] font-bold">{src.syntheticFraction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
