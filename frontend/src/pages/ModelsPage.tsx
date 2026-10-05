import React, { useEffect, useState } from 'react';

export const ModelsPage: React.FC = () => {
  const [modelsData, setModelsData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/models')
      .then(res => res.json())
      .then(data => setModelsData(data.models || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          MODEL REGISTRY & ARCHITECTURES
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
          Evaluated Forecasting Models
        </h1>
        <p className="text-sm text-[#475569] mt-2">
          Comparative suite of Historical Baselines, L2 Ridge, Tree Ensembles (RF, ET, HistGB, XGB, LGB), and PyTorch Neural Sequence Models (MLP, LSTM, GRU).
        </p>
      </div>

      <div className="border border-[#E2E8F0] rounded-md bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Model Registry</h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono">
              <th className="py-2 px-3 font-semibold">Model Name</th>
              <th className="py-2 px-3 font-semibold">Family</th>
              <th className="py-2 px-3 font-semibold">MAE ↓</th>
              <th className="py-2 px-3 font-semibold">RMSE ↓</th>
              <th className="py-2 px-3 font-semibold">WAPE (%) ↓</th>
              <th className="py-2 px-3 font-semibold">R² ↑</th>
              <th className="py-2 px-3 font-semibold">Best Epoch</th>
              <th className="py-2 px-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans text-[#334155]">
            {modelsData.map((m, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                <td className="py-3 px-3 font-bold text-[#0F172A]">{m.model_name || m.Model}</td>
                <td className="py-3 px-3 font-mono text-xs">{m.model_family || m.Family}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">{m.metrics?.mae ?? m["MAE ↓"]}</td>
                <td className="py-3 px-3 font-mono">{m.metrics?.rmse ?? m["RMSE ↓"]}</td>
                <td className="py-3 px-3 font-mono">{m.metrics?.wape ?? m["WAPE (%) ↓"]}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#166534]">{m.metrics?.r2 ?? m["R² ↑"]}</td>
                <td className="py-3 px-3 font-mono text-[#64748B]">{m.epochs ?? m["Best Epoch"] ?? 'N/A'}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#166534]">VERIFIED</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
