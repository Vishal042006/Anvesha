import React from 'react';
import { FileCode } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-[#17202A] font-sans">
      {/* Header */}
      <div className="border-b border-[#DCDDD8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-[#0B7F78] uppercase tracking-wider">
            MATHEMATICAL DEFINITIONS & FORMULAS
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#17202A] tracking-tight mt-1 flex items-center space-x-2">
            <FileCode className="w-6 h-6 text-[#0B7F78]" />
            <span>CRIME-SHIFT MATHEMATICAL METHODOLOGY</span>
          </h1>
          <p className="text-xs text-[#68727A] font-sans mt-1">
            Formal mathematical formulations for change-point detection, Markovian regime discovery, conformal forecasting bounds, and evaluation metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs font-bold text-[#0B7F78]">
            DETERMINISTIC FORMULATION
          </span>
        </div>
      </div>

      {/* Grid of Mathematical Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. PELT & BOCPD */}
        <div className="bg-[#FFFFFF] p-6 border border-[#DCDDD8] rounded-xs shadow-2xs space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 border-b border-[#DCDDD8] pb-3">
            <span className="w-6 h-6 bg-[#0B7F78] text-white flex items-center justify-center font-bold text-xs rounded-xs">
              01
            </span>
            <h2 className="font-serif font-bold text-base text-[#17202A]">Change Point Detection (PELT + BOCPD)</h2>
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            PELT minimizes the penalized cost function over time series y<sub>1:n</sub>:
          </p>
          <div className="p-3 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#17202A] font-bold">
            min<sub>m, τ</sub> &Sigma;<sub>i=1..m+1</sub> [ C(y<sub>(&tau;<sub>i-1</sub>+1):&tau;<sub>i</sub></sub>) ] + &beta; m
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            BOCPD calculates exact posterior run-length probabilities P(r<sub>t</sub> | y<sub>1:t</sub>) online. Wording rule: "Structural break detected", avoiding unverified causal assertions.
          </p>
        </div>

        {/* 2. GAUSSIAN HMM */}
        <div className="bg-[#FFFFFF] p-6 border border-[#DCDDD8] rounded-xs shadow-2xs space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 border-b border-[#DCDDD8] pb-3">
            <span className="w-6 h-6 bg-[#0B7F78] text-white flex items-center justify-center font-bold text-xs rounded-xs">
              02
            </span>
            <h2 className="font-serif font-bold text-base text-[#17202A]">Gaussian HMM Latent Regime Discovery</h2>
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            Models latent crime states S<sub>t</sub> &isin; {"{S_1, S_2, S_3}"} using emission probability distributions:
          </p>
          <div className="p-3 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#17202A] font-bold">
            P(y<sub>t</sub> | S<sub>t</sub> = k) = N(y<sub>t</sub> | &mu;<sub>k</sub>, &Sigma;<sub>k</sub>)
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            Number of hidden states k=3 is selected by minimizing AIC / BIC information criteria across administrative units.
          </p>
        </div>

        {/* 3. CONFORMAL PREDICTION */}
        <div className="bg-[#FFFFFF] p-6 border border-[#DCDDD8] rounded-xs shadow-2xs space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 border-b border-[#DCDDD8] pb-3">
            <span className="w-6 h-6 bg-[#0B7F78] text-white flex items-center justify-center font-bold text-xs rounded-xs">
              03
            </span>
            <h2 className="font-serif font-bold text-base text-[#17202A]">Conformal Prediction Bounds</h2>
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            Derives distribution-free interval bounds C(x<sub>n+1</sub>) = [ y&#770;<sub>n+1</sub> - q, y&#770;<sub>n+1</sub> + q ] satisfying:
          </p>
          <div className="p-3 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#17202A] font-bold">
            P(Y<sub>n+1</sub> &isin; C(X<sub>n+1</sub>)) &ge; 1 - &alpha;
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            Guarantees marginal coverage under exchangeability without parametric distribution assumptions.
          </p>
        </div>

        {/* 4. EVALUATION METRICS */}
        <div className="bg-[#FFFFFF] p-6 border border-[#DCDDD8] rounded-xs shadow-2xs space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 border-b border-[#DCDDD8] pb-3">
            <span className="w-6 h-6 bg-[#0B7F78] text-white flex items-center justify-center font-bold text-xs rounded-xs">
              04
            </span>
            <h2 className="font-serif font-bold text-base text-[#17202A]">Weighted Absolute Percentage Error (WAPE)</h2>
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            WAPE evaluates volume accuracy scale-independently across units:
          </p>
          <div className="p-3 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#17202A] font-bold">
            WAPE = ( &Sigma; |y<sub>i</sub> - y&#770;<sub>i</sub>| / &Sigma; y<sub>i</sub> ) &times; 100%
          </div>
          <p className="text-[#68727A] leading-relaxed font-sans text-xs">
            Prevents zero-division distortions inherent in MAPE when crime volumes are small.
          </p>
        </div>
      </div>
    </div>
  );
};
