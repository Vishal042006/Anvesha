import React from 'react';
import { Award, AlertTriangle } from 'lucide-react';

export const ResearchReportPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Editorial Journal Paper Title Header */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#777777]">
          <span>IEEE ACADEMIC PUBLICATION SYNTHESIS</span>
          <span>DOCUMENT ID: IEEE-ANVESHA-2026-V3.5</span>
          <span className="badge-observed">STATUS: AUDITED & DEFENSIBLE</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-black text-[#111111] tracking-tight leading-tight">
          ANVESHA: A Provenance-Aware and Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence
        </h1>

        <div className="text-xs font-mono text-[#4B4B4B] space-y-1">
          <div><strong className="text-[#111111]">ANALYTICAL SCOPE:</strong> 36 Tamil Nadu Police Units • 2001–2023 Master Dataset • 6 IPC Categories</div>
          <div><strong className="text-[#111111]">GROUND TRUTH BENCHMARK:</strong> Track A (2001–2014 NCRB) • SHA256: <code className="text-[#26734D]">768a899b7c5e...</code></div>
        </div>
      </div>

      {/* 3 Core Defensible Research Contributions */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-2">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#A61B1B]" />
            <h2 className="font-serif font-bold text-lg text-[#111111]">
              CANONICAL RESEARCH CONTRIBUTIONS (V3.5 RECONCILIATION)
            </h2>
          </div>
          <span className="badge-observed font-mono">IEEE PUBLICATION STANDARDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-2">
            <div className="font-mono text-[10px] font-bold text-[#A61B1B] uppercase">CONTRIBUTION 01</div>
            <div className="font-serif font-bold text-sm text-[#111111]">Dual-Track Provenance Architecture</div>
            <p className="text-[#4B4B4B] leading-relaxed">
              Establishes strict cryptographic and lineage boundary isolation between official ground-truth NCRB observations (2001–2014) and candidate extensions (2015–2023) to prevent target contamination.
            </p>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-2">
            <div className="font-mono text-[10px] font-bold text-[#2457A6] uppercase">CONTRIBUTION 02</div>
            <div className="font-serif font-bold text-sm text-[#111111]">Leakage-Safe Persistence Baseline</div>
            <p className="text-[#4B4B4B] leading-relaxed">
              Demonstrates that in sparse administrative panel settings, autoregressive persistence ($T-1$) achieves the strongest verified point forecast performance (MAE = 171.50, WAPE = 16.58%, R² = 0.9142).
            </p>
          </div>

          <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-2">
            <div className="font-mono text-[10px] font-bold text-[#26734D] uppercase">CONTRIBUTION 03</div>
            <div className="font-serif font-bold text-sm text-[#111111]">Evidence Grounding & RAG Retrieval</div>
            <p className="text-[#4B4B4B] leading-relaxed">
              Couples quantitative models with BGE dense vector semantic search over 4,052 SCRB extracted tables, with explicit non-causal safeguards to prevent predictive policing harms.
            </p>
          </div>
        </div>
      </div>

      {/* Numbered Academic Publication Sections (01 through 07) */}
      <div className="editorial-card p-8 space-y-8 text-xs text-[#111111] leading-relaxed font-sans">
        {/* 01 INTRODUCTION */}
        <section className="space-y-2 border-b border-[#D8D6D0] pb-6">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 01</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">01. INTRODUCTION & EXECUTIVE SUMMARY</h3>
          <p className="text-[#4B4B4B] leading-relaxed">
            ANVESHA is an evidence-grounded AI framework designed for district-level spatio-temporal crime intelligence in Tamil Nadu, India. Operating across 36 police districts over a 23-year longitudinal horizon (2001–2023), ANVESHA provides transparent point forecasting, trend direction classification, anomaly detection, spatial analytics, and semantic evidence retrieval while enforcing strict data provenance.
          </p>
        </section>

        {/* 02 DATA & PROVENANCE */}
        <section className="space-y-2 border-b border-[#D8D6D0] pb-6">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 02</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">02. DATA & PROVENANCE ARCHITECTURE</h3>
          <p className="text-[#4B4B4B] leading-relaxed">
            The framework ingests official publications from the National Crime Records Bureau (NCRB) and State Crime Records Bureau (SCRB). To prevent target leakage and unverified claims, ANVESHA isolates Track A Ground Truth (2001–2014 NCRB, 2,640 verified observations, SHA256 verified <code className="font-mono bg-[#F1F0EB] px-1 text-[#26734D]">768a899b7c5e...</code>) from Track B Candidate Extensions (2015–2023). Every output carries an immutable provenance badge.
          </p>
        </section>

        {/* 03 METHODOLOGY */}
        <section className="space-y-2 border-b border-[#D8D6D0] pb-6">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 03</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">03. EVALUATION METHODOLOGY</h3>
          <p className="text-[#4B4B4B] leading-relaxed">
            Model evaluation uses expanding-window chronological splits (2004–2014 for forecasting; 2021–2023 for trend classification). Future information is strictly isolated from model training ($T+1$ predictions strictly use features from $\le T$).
          </p>
        </section>

        {/* 04 RESULTS */}
        <section className="space-y-3 border-b border-[#D8D6D0] pb-6">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 04</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">04. FORECASTING & TREND CLASSIFICATION RESULTS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-2">
            <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
              <div className="font-bold text-[#111111]">POINT FORECASTING (2004–2014)</div>
              <div>MAE: <strong className="text-[#111111]">171.50</strong></div>
              <div>RMSE: <strong className="text-[#111111]">581.57</strong></div>
              <div>WAPE: <strong className="text-[#26734D]">16.58%</strong></div>
              <div>R²: <strong className="text-[#2457A6]">0.9142</strong></div>
            </div>

            <div className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
              <div className="font-bold text-[#111111]">TREND CLASSIFICATION (TARGET A 2021–2023)</div>
              <div>Accuracy: <strong className="text-[#A61B1B]">80.59%</strong> (LightGBM)</div>
              <div>Macro-F1: <strong className="text-[#2457A6]">0.6367</strong> (Balanced RF)</div>
              <div>Majority Baseline: <strong className="text-[#777777]">76.06%</strong></div>
              <div>Balanced Acc: <strong className="text-[#26734D]">65.41%</strong></div>
            </div>
          </div>
        </section>

        {/* 05 EVIDENCE GROUNDING */}
        <section className="space-y-2 border-b border-[#D8D6D0] pb-6">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 05</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">05. EVIDENCE GROUNDING & RETRIEVAL</h3>
          <p className="text-[#4B4B4B] leading-relaxed">
            ANVESHA couples quantitative forecasts with semantic retrieval over 4,052 SCRB extracted tables using BAAI/bge-small-en-v1.5 embeddings. Guidance is structured across explicit provenance chains: Observation → Statistic → Model Output → Research Evidence → Non-Causal Guidance.
          </p>
        </section>

        {/* 06 LIMITATIONS */}
        <section className="space-y-2 border-l-4 border-l-[#A61B1B] bg-[#F8F7F3] p-4 border border-[#D8D6D0]">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            SECTION 06. PERMANENT RESEARCH LIMITATIONS & NON-CAUSAL SAFEGUARDS
          </div>
          <ul className="list-disc list-inside space-y-1 text-[#4B4B4B] font-sans">
            <li>Annual temporal resolution limits real-time tactical police deployments.</li>
            <li>Official ground-truth observation benchmark period is frozen to 2001–2014.</li>
            <li>ANVESHA does NOT identify individuals, predict criminal intent, or replace human decision-makers.</li>
            <li>Model feature attributions describe model behavior; they do NOT establish causation.</li>
          </ul>
        </section>

        {/* 07 CONCLUSION */}
        <section className="space-y-2 pt-2">
          <div className="font-mono text-xs font-bold text-[#A61B1B] uppercase tracking-wider">SECTION 07</div>
          <h3 className="font-serif font-bold text-xl text-[#111111]">07. CONCLUSION & REPRODUCIBILITY</h3>
          <p className="text-[#4B4B4B] leading-relaxed">
            ANVESHA demonstrates that in sparse administrative panel settings, complex deep learning models risk overfitting and data leakage. Simple, provenance-aware autoregressive persistence combined with semantic evidence grounding provides superior reliability, ethical safety, and transparent decision support.
          </p>
        </section>
      </div>
    </div>
  );
};
