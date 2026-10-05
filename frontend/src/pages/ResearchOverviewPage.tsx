import React from 'react';

export const ResearchOverviewPage: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans text-[#0F172A]">
      {/* Title Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          MODEL-FIRST RESEARCH PLATFORM
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
          ANVESHA — Spatio-Temporal Crime Forecasting System
        </h1>
        <p className="text-base text-[#475569] mt-2 max-w-4xl">
          An evidence-grounded machine learning framework evaluating leakage-safe temporal, population, and spatial modeling strategies for next-year aggregate crime count forecasting across heterogeneous Indian police reporting units.
        </p>
      </div>

      {/* Primary Research Question */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-6 space-y-3">
        <h2 className="text-sm font-mono font-bold text-[#0F172A] uppercase tracking-wide">
          PRIMARY RESEARCH QUESTION
        </h2>
        <blockquote className="text-lg font-serif italic text-[#1E293B] border-l-4 border-[#2563EB] pl-4 py-1">
          "How effectively can leakage-safe spatio-temporal machine-learning models forecast next-year aggregate crime counts across heterogeneous Indian police reporting units under incomplete historical data?"
        </blockquote>
      </div>

      {/* Core Research Pillars */}
      <div className="grid grid-cols-3 gap-6">
        <div className="border border-[#E2E8F0] bg-white p-5 rounded-md shadow-xs space-y-2">
          <div className="text-xs font-mono font-bold text-[#2563EB]">PILLAR 1: DATA INTEGRITY</div>
          <h3 className="font-bold text-base text-[#0F172A]">Official Benchmark</h3>
          <p className="text-xs text-[#64748B]">
            Primary benchmark relies strictly on 9,866 official NCRB district-level observations (2001–2014) with ZERO synthetic contamination.
          </p>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-5 rounded-md shadow-xs space-y-2">
          <div className="text-xs font-mono font-bold text-[#2563EB]">PILLAR 2: LEAKAGE SAFETY</div>
          <h3 className="font-bold text-base text-[#0F172A]">Chronological Backtesting</h3>
          <p className="text-xs text-[#64748B]">
            All feature transformations, scalers, and hyperparameter selections are fitted strictly on historical training windows without future leakage.
          </p>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-5 rounded-md shadow-xs space-y-2">
          <div className="text-xs font-mono font-bold text-[#2563EB]">PILLAR 3: MODEL COMPARISON</div>
          <h3 className="font-bold text-base text-[#0F172A]">Classical vs Deep Learning</h3>
          <p className="text-xs text-[#64748B]">
            Rigorous side-by-side evaluation comparing Persistence baselines, Ridge, Random Forest, XGBoost, and PyTorch sequence models (MLP, LSTM, GRU).
          </p>
        </div>
      </div>

      {/* Secondary Research Questions Table */}
      <div className="border border-[#E2E8F0] rounded-md bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Secondary Research Questions (RQ1–RQ6)</h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono">
              <th className="py-2 px-3 font-semibold w-16">ID</th>
              <th className="py-2 px-3 font-semibold">Research Question</th>
              <th className="py-2 px-3 font-semibold w-32">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans text-[#334155]">
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ1</td>
              <td className="py-3 px-3">Does temporal history provide the strongest predictive signal?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">CONFIRMED</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ2</td>
              <td className="py-3 px-3">Do population features improve forecasting accuracy?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">EVALUATED</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ3</td>
              <td className="py-3 px-3">Do spatial features improve forecasting accuracy?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">EVALUATED</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ4</td>
              <td className="py-3 px-3">Can deep temporal models (MLP, LSTM, GRU) outperform strong classical baselines?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">VERIFIED</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ5</td>
              <td className="py-3 px-3">How stable are model results across chronological backtest folds?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">AUDITED</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">RQ6</td>
              <td className="py-3 px-3">How does controlled synthetic gap filling affect model performance?</td>
              <td className="py-3 px-3 font-mono text-[#166534] font-bold">ISOLATED</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
