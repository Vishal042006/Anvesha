import React, { useEffect, useState } from 'react';

export const DatasetPage: React.FC = () => {
  const [datasetMeta, setDatasetMeta] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/dataset')
      .then(res => res.json())
      .then(data => setDatasetMeta(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          PRIMARY BENCHMARK DATASET
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
          ANVESHA Official Benchmark (NCRB 2001–2014)
        </h1>
        <p className="text-sm text-[#475569] mt-2">
          Official district-level observations with 100% provenance verification. Zero synthetic observations in the primary benchmark.
        </p>
      </div>

      {/* Dataset Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 font-mono">
        <div className="border border-[#E2E8F0] bg-white p-4 rounded-md">
          <div className="text-[10px] text-[#64748B] font-bold">PRIMARY BENCHMARK</div>
          <div className="text-xl font-bold text-[#0F172A] mt-1">2001–2014</div>
          <div className="text-[10px] text-[#166534] mt-1 font-sans">Official NCRB Period</div>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-4 rounded-md">
          <div className="text-[10px] text-[#64748B] font-bold">TOTAL OBSERVATIONS</div>
          <div className="text-xl font-bold text-[#0F172A] mt-1">{datasetMeta?.primary_benchmark?.total_rows || 9866}</div>
          <div className="text-[10px] text-[#64748B] mt-1 font-sans">District-Year Pairs</div>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-4 rounded-md">
          <div className="text-[10px] text-[#64748B] font-bold">SYNTHETIC OBSERVATIONS</div>
          <div className="text-xl font-bold text-[#166534] mt-1">0 (0.0%)</div>
          <div className="text-[10px] text-[#166534] mt-1 font-sans">Zero Contamination</div>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-4 rounded-md">
          <div className="text-[10px] text-[#64748B] font-bold">TARGET VARIABLE</div>
          <div className="text-sm font-bold text-[#2563EB] mt-1">NEXT_YEAR_IPC</div>
          <div className="text-[10px] text-[#64748B] mt-1 font-sans">t+1 Aggregate Count</div>
        </div>
      </div>

      {/* Track Isolation Table */}
      <div className="border border-[#E2E8F0] rounded-md bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Dataset Track Isolation & Provenance</h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono">
              <th className="py-2 px-3 font-semibold">Track ID</th>
              <th className="py-2 px-3 font-semibold">Dataset Name</th>
              <th className="py-2 px-3 font-semibold">Years</th>
              <th className="py-2 px-3 font-semibold">Official Rows</th>
              <th className="py-2 px-3 font-semibold">Synthetic Rows</th>
              <th className="py-2 px-3 font-semibold">Research Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans text-[#334155]">
            <tr className="bg-[#F8FAFC]">
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">Track A</td>
              <td className="py-3 px-3 font-semibold">ANVESHA Official NCRB Benchmark</td>
              <td className="py-3 px-3 font-mono">2001–2014</td>
              <td className="py-3 px-3 font-mono">9,866</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">0</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">PRIMARY BENCHMARK</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#64748B]">Track B</td>
              <td className="py-3 px-3">ANVESHA Sensitivity Extended Panel</td>
              <td className="py-3 px-3 font-mono">2001–2014</td>
              <td className="py-3 px-3 font-mono">9,866</td>
              <td className="py-3 px-3 font-mono text-[#B45309]">482</td>
              <td className="py-3 px-3 font-mono text-[#64748B]">SENSITIVITY EXPERIMENT ONLY</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
