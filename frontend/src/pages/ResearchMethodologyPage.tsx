import React from 'react';
import { BookOpen, Cpu, Layers, ShieldAlert } from 'lucide-react';

export const ResearchMethodologyPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          Research & Methodology Specification (ANVESHA V2.1)
        </h2>
        <p className="text-xs text-gray-400">
          Formal scientific specification of ANVESHA's dual-track forecasting architecture, calendar lag features, and provenance safeguards
        </p>
      </div>

      {/* Core Principle & Certification Banner */}
      <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-gray-900 to-indigo-950/30 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            CORE RESEARCH PRINCIPLE: "PROVENANCE ISOLATION & EMPIRICAL AUDITABILITY"
          </h3>
          <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded font-mono font-bold">
            STATUS: PASS WITH LIMITATIONS
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          ANVESHA strictly isolates official ground-truth observations (Track A: 2001–2014 NCRB panel) from extended candidate synthetic estimates (Track B: 2015–2023 candidate panel). The Track B 2.80% WAPE result is restricted to candidate synthetic extensions and must NOT be cited as verified real-world forecasting accuracy.
        </p>
      </div>

      {/* Methodology Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Dual-Track Forecasting Methodology */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            1. Dual-Track Spatio-Temporal Forecasting (ST-CFM)
          </h3>

          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p>
              <strong>Target Formulation:</strong> Next-year recorded crime count target y_(i, t+1) for district i and category c.
            </p>
            <p>
              <strong>Calendar-Aware Lag Generation:</strong> Strict calendar-year lookup matching preceding exact years (t-1, t-2, t-3). Missing historical years cause the API to return <code className="text-rose-400 bg-rose-950 px-1 py-0.5 rounded font-mono text-[10px]">INSUFFICIENT_HISTORY</code> rather than zeroing out or filling with obsolete observations.
            </p>
            
            <div className="border border-gray-800 rounded-lg p-3 bg-gray-900/60 space-y-2">
              <div className="text-xs font-bold text-white uppercase">Candidate Comparison on Validation Set (2018–2020)</div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono text-left text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="p-1.5">Candidate Model</th>
                      <th className="p-1.5">MAE</th>
                      <th className="p-1.5">WAPE (%)</th>
                      <th className="p-1.5">R²</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="text-emerald-300 font-bold bg-emerald-950/20">
                      <td className="p-1.5">3-Year Rolling Mean (Selected)</td>
                      <td className="p-1.5">28.25</td>
                      <td className="p-1.5">2.54%</td>
                      <td className="p-1.5">0.9980</td>
                    </tr>
                    <tr>
                      <td className="p-1.5">Previous-Year Baseline</td>
                      <td className="p-1.5">37.99</td>
                      <td className="p-1.5">3.42%</td>
                      <td className="p-1.5">0.9940</td>
                    </tr>
                    <tr>
                      <td className="p-1.5">Ridge Regression</td>
                      <td className="p-1.5">48.05</td>
                      <td className="p-1.5">4.32%</td>
                      <td className="p-1.5">0.9945</td>
                    </tr>
                    <tr>
                      <td className="p-1.5">HistGradientBoosting</td>
                      <td className="p-1.5">106.88</td>
                      <td className="p-1.5">9.61%</td>
                      <td className="p-1.5">0.9704</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dual Track Final Evaluation Metrics */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Layers className="w-4 h-4 text-sky-400" />
            2. Final Held-Out Evaluation Track Isolation
          </h3>

          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-lg space-y-1">
              <div className="font-bold text-emerald-300 uppercase text-xs">Track A: Official Ground-Truth Evaluation (2013–2014)</div>
              <div className="text-[11px] text-gray-300">
                100% Official NCRB FIR panel (363 test observations). Represents true historical baseline accuracy on un-smoothed official data.
              </div>
              <div className="font-mono font-bold text-emerald-400 text-[11px] pt-1">
                MAE = 244.75 | RMSE = 820.29 | WAPE = 20.01% | R² = 0.8743
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/40 p-3.5 rounded-lg space-y-1">
              <div className="font-bold text-indigo-300 uppercase text-xs">Track B: Extended Candidate Synthetic Panel (2021–2023)</div>
              <div className="text-[11px] text-gray-300">
                Candidate synthetic extension panel (639 test observations). High pooled R² driven by crime category/district scale variance.
              </div>
              <div className="font-mono font-bold text-indigo-400 text-[11px] pt-1">
                MAE = 31.21 | RMSE = 85.18 | WAPE = 2.80% | R² = 0.9984
              </div>
            </div>

            <p className="text-[11px] text-amber-300/90 italic">
              Note: Population rates are computed using Census 2001 and 2011 town populations. Polygon spatial statistics are suppressed due to missing historical jurisdiction area shapefiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

