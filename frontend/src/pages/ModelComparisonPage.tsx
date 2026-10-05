import React, { useEffect, useState } from 'react';

export const ModelComparisonPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/results')
      .then(res => res.json())
      .then(data => setResults(data.comparison_table || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          MODEL FAMILY COMPARISON & RANKINGS
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
          Baselines vs Classical ML vs Deep Learning
        </h1>
        <p className="text-sm text-[#475569] mt-2">
          Strict scientific evaluation comparing baseline heuristics against classical tree ensembles and neural sequence models.
        </p>
      </div>

      <div className="border border-[#E2E8F0] rounded-md bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Cross-Family Model Ranking (Ranked by MAE)</h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono">
              <th className="py-2.5 px-3 font-semibold w-12">Rank</th>
              <th className="py-2.5 px-3 font-semibold">Model Name</th>
              <th className="py-2.5 px-3 font-semibold">Model Family</th>
              <th className="py-2.5 px-3 font-semibold">MAE ↓</th>
              <th className="py-2.5 px-3 font-semibold">RMSE ↓</th>
              <th className="py-2.5 px-3 font-semibold">WAPE (%) ↓</th>
              <th className="py-2.5 px-3 font-semibold">R² ↑</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans text-[#334155]">
            {results.map((r, idx) => (
              <tr key={idx} className={idx === 0 ? 'bg-[#EFF6FF]' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]')}>
                <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">#{idx+1}</td>
                <td className="py-3 px-3 font-bold text-[#0F172A]">{r.Model}</td>
                <td className="py-3 px-3 font-mono text-xs">{r.Family}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">{r["MAE ↓"]}</td>
                <td className="py-3 px-3 font-mono">{r["RMSE ↓"]}</td>
                <td className="py-3 px-3 font-mono">{r["WAPE (%) ↓"]}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#166534]">{r["R² ↑"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
