import React, { useEffect, useState } from 'react';

export const TrainingPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/training/ALL')
      .then(res => res.json())
      .then(data => setLogs(data.history || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          NEURAL TRAINING DIAGNOSTICS & EPOCH LOGS
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
          Deep Learning Training & Validation Loss
        </h1>
        <p className="text-sm text-[#475569] mt-2">
          Empirical training diagnostics logged epoch-by-epoch for PyTorch MLP, LSTM, and GRU architectures using Huber Loss and AdamW optimization with early stopping.
        </p>
      </div>

      {/* Visual Loss Curves Note */}
      <div className="border border-[#E2E8F0] bg-white p-6 rounded-md space-y-3">
        <h2 className="text-base font-bold text-[#0F172A]">Training Configuration</h2>
        <div className="grid grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
            <div className="text-[#64748B]">OPTIMIZER</div>
            <div className="font-bold text-[#0F172A] mt-1">AdamW (lr=1e-3, wd=1e-4)</div>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
            <div className="text-[#64748B]">LOSS FUNCTION</div>
            <div className="font-bold text-[#0F172A] mt-1">Huber Loss (Smooth L1)</div>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
            <div className="text-[#64748B]">EARLY STOPPING</div>
            <div className="font-bold text-[#2563EB] mt-1">Patience = 15 Epochs</div>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
            <div className="text-[#64748B]">SCHEDULER</div>
            <div className="font-bold text-[#166534] mt-1">ReduceLROnPlateau</div>
          </div>
        </div>
      </div>

      {/* Epoch Logs Table */}
      <div className="border border-[#E2E8F0] rounded-md bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Epoch Training Logs ({logs.length} Total Epochs)</h2>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-white border-b border-[#E2E8F0] text-[#64748B] font-mono">
              <tr>
                <th className="py-2 px-3 font-semibold">Model</th>
                <th className="py-2 px-3 font-semibold">Epoch</th>
                <th className="py-2 px-3 font-semibold">Train Loss</th>
                <th className="py-2 px-3 font-semibold">Val Loss</th>
                <th className="py-2 px-3 font-semibold">Learning Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-sans text-[#334155]">
              {logs.slice(0, 50).map((l, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-mono font-bold text-[#2563EB]">{l.Model}</td>
                  <td className="py-2 px-3 font-mono">{l.Epoch}</td>
                  <td className="py-2 px-3 font-mono">{typeof l["Train Loss"] === 'number' ? l["Train Loss"].toFixed(4) : l["Train Loss"]}</td>
                  <td className="py-2 px-3 font-mono font-bold text-[#166534]">{typeof l["Val Loss"] === 'number' ? l["Val Loss"].toFixed(4) : l["Val Loss"]}</td>
                  <td className="py-2 px-3 font-mono text-[#64748B]">{l["Learning Rate"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
