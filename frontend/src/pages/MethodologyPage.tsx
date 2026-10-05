import React from 'react';
import { FileCode } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#0F172A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="text-xs font-mono text-[#2563EB] font-bold tracking-wider uppercase mb-1">
          PAGE 9 — SCIENTIFIC METHODOLOGY & ACADEMIC DOCUMENTATION
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
          <FileCode className="w-6 h-6 text-[#2563EB]" />
          <span>Research Methodology & Validation Guarantees</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Comprehensive formal documentation of the ANVESHA pipeline, taxonomy mapping rules, Isolation Forest formulation, expanding backtest validation, and risk score weights.
        </p>
      </div>

      {/* Methodology Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Taxonomy & Classification */}
        <div className="bg-white p-5 border border-[#E2E8F0] rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
            <span className="w-6 h-6 bg-[#1E3A8A] text-white flex items-center justify-center font-mono font-bold text-xs rounded-xs">
              1
            </span>
            <h2 className="font-bold text-base text-[#0F172A]">Taxonomy & Supervised Classifier</h2>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Raw IPC legal sections (Sections 302, 379, 420, 147, IT Act 66) are normalized into 7 canonical high-level crime categories using exact legal mapping rules supplemented by a TF-IDF + Logistic Regression supervised classifier (Macro F1: 0.7768).
          </p>
          <div className="bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xs font-mono text-[11px] text-[#334155] space-y-1">
            <div className="font-bold text-[#0F172A]">Categories:</div>
            <div>VIOLENT, PROPERTY, ECONOMIC, CYBER, WOMEN_AND_CHILDREN, PUBLIC_ORDER, OTHER</div>
          </div>
        </div>

        {/* 2. Anomaly Detection Engine */}
        <div className="bg-white p-5 border border-[#E2E8F0] rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
            <span className="w-6 h-6 bg-[#1E3A8A] text-white flex items-center justify-center font-mono font-bold text-xs rounded-xs">
              2
            </span>
            <h2 className="font-bold text-base text-[#0F172A]">Isolation Forest Anomaly Detection</h2>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Operates on temporal features (rolling 3-year mean, rolling std, YoY percentage change, growth rate). Isolates aggregate trajectory outliers into 4 documented severity tiers: NORMAL, WATCH, ANOMALOUS, and SEVERE_ANOMALY.
          </p>
          <div className="bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xs font-mono text-[11px] text-[#334155] space-y-1">
            <div className="font-bold text-[#0F172A]">Contamination:</div>
            <div>0.08 • Score Function: decision_function min-max normalized</div>
          </div>
        </div>

        {/* 3. Expanding Window Backtesting */}
        <div className="bg-white p-5 border border-[#E2E8F0] rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
            <span className="w-6 h-6 bg-[#1E3A8A] text-white flex items-center justify-center font-mono font-bold text-xs rounded-xs">
              3
            </span>
            <h2 className="font-bold text-base text-[#0F172A]">Chronological Expanding Backtest</h2>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Strictly prevents future leakage. Folds expand sequentially from 2001–2005 train / 2006 test up to 2001–2013 train / 2014 test across 8 forecasting architectures. All feature scaling is fitted strictly on the training window.
          </p>
          <div className="bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xs font-mono text-[11px] text-[#334155] space-y-1">
            <div className="font-bold text-[#0F172A]">Evaluation Folds:</div>
            <div>2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014</div>
          </div>
        </div>

        {/* 4. Risk & Indication Engine */}
        <div className="bg-white p-5 border border-[#E2E8F0] rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
            <span className="w-6 h-6 bg-[#1E3A8A] text-white flex items-center justify-center font-mono font-bold text-xs rounded-xs">
              4
            </span>
            <h2 className="font-bold text-base text-[#0F172A]">ANVESHA Risk / Indication Formula</h2>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Calculates an aggregate statistical indication score using equal 25% weights across recent trend growth, anomaly score, forecast change percentage, and normalized crime volume.
          </p>
          <div className="bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xs font-mono text-[11px] text-[#334155] space-y-1">
            <div className="font-bold text-[#0F172A]">Indication Levels:</div>
            <div>LOW (&lt;0.35), MODERATE (&lt;0.55), HIGH (&lt;0.75), CRITICAL (&ge;0.75)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
