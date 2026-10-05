import React from 'react';
import { HelpCircle, Layers, Activity } from 'lucide-react';

export const ModelExplainabilityPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-400" />
          Model Explainability & Feature Signal Attribution
        </h2>
        <p className="text-xs text-gray-400">
          Transparent feature attribution breakdown distinguishing observed, derived, modeled, estimated, and assumed signals
        </p>
      </div>

      {/* Signal Type Definitions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-center">
          <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">OBSERVED</div>
          <div className="text-xs text-gray-300 mt-1">Raw historical SCRB/NCRB counts</div>
        </div>
        <div className="bg-sky-950/40 border border-sky-500/30 p-3 rounded-lg text-center">
          <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">DERIVED</div>
          <div className="text-xs text-gray-300 mt-1">Rolling averages & lag features</div>
        </div>
        <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-lg text-center">
          <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">MODELLED</div>
          <div className="text-xs text-gray-300 mt-1">Ridge L2 regression output</div>
        </div>
        <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-lg text-center">
          <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">ESTIMATED</div>
          <div className="text-xs text-gray-300 mt-1">Census population rates</div>
        </div>
        <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-lg text-center">
          <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">ASSUMED</div>
          <div className="text-xs text-gray-300 mt-1">Proximity spatial lags</div>
        </div>
      </div>

      {/* Signal Attribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporal Signals Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Activity className="w-4 h-4 text-sky-400" />
            1. Temporal Autoregressive Signals (93.5% Variance)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">T-1 Lag (Previous Year Count)</span>
                <span className="badge-validated text-[10px] px-2 py-0.5 rounded">DERIVED</span>
              </div>
              <p className="text-gray-400 text-[11px]">Primary predictor capturing immediate historical inertia.</p>
              <div className="text-sky-400 font-mono font-bold text-right">+54.2% Weight</div>
            </div>

            <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">3-Year Rolling Average (T-1, T-2, T-3)</span>
                <span className="badge-validated text-[10px] px-2 py-0.5 rounded">DERIVED</span>
              </div>
              <p className="text-gray-400 text-[11px]">Smooths short-term fluctuations and establishes baseline trajectory.</p>
              <div className="text-sky-400 font-mono font-bold text-right">+28.5% Weight</div>
            </div>

            <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">T-2 & T-3 Historical Lags</span>
                <span className="badge-validated text-[10px] px-2 py-0.5 rounded">DERIVED</span>
              </div>
              <p className="text-gray-400 text-[11px]">Secondary lag terms establishing medium-term multi-year trend momentum.</p>
              <div className="text-sky-400 font-mono font-bold text-right">+10.8% Weight</div>
            </div>
          </div>
        </div>

        {/* Spatial & Population Context Signals */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Layers className="w-4 h-4 text-emerald-400" />
            2. Spatial & Auxiliary Context Signals
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Statewide Category Spatial Lag</span>
                <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-mono">ASSUMED</span>
              </div>
              <p className="text-gray-400 text-[11px]">Category-specific neighbor average across all reporting units.</p>
              <div className="text-emerald-400 font-mono font-bold text-right">+4.5% Weight (Delta: R² 0.8277 → 0.8313)</div>
            </div>

            <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Census Population Growth Ratio</span>
                <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-mono">ESTIMATED</span>
              </div>
              <p className="text-gray-400 text-[11px]">Census 2001 & 2011 population baseline scaling factor.</p>
              <div className="text-emerald-400 font-mono font-bold text-right">+2.0% Weight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
