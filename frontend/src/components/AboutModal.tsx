import React from 'react';
import { Database, Layers, AlertOctagon, ShieldCheck } from 'lucide-react';
import type { SummaryResponse } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary?: SummaryResponse | null;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, summary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-sans animate-in fade-in duration-150">
      <div 
        className="bg-[#FFFFFF] border-2 border-[#1A1A1A] w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D8D6D0] flex items-center justify-between bg-[#F1F0EB]">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/anvesha_logo.png"
              alt="ANVESHA 2.0"
              className="h-9 w-auto object-contain filter drop-shadow-2xs"
            />
            <div>
              <h2 className="text-base font-serif font-bold text-[#111111]">ANVESHA Framework & Ethical Governance</h2>
              <p className="text-xs text-[#4B4B4B] font-mono">Provenance-Aware Crime Intelligence Research Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777777] hover:text-[#111111] font-mono text-xs font-bold"
            aria-label="Close modal"
          >
            [ESC] ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#111111]">
          {/* Mandatory Research System Notice */}
          <div className="bg-[#F8F7F3] border-l-4 border-[#A61B1B] p-4 border border-[#D8D6D0] space-y-2">
            <h3 className="font-serif font-bold text-sm text-[#A61B1B] uppercase tracking-wide flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              ANVESHA IS A RESEARCH DECISION-SUPPORT SYSTEM, NOT AN AUTONOMOUS POLICING SYSTEM.
            </h3>
            <p className="text-xs text-[#4B4B4B] leading-relaxed">
              ANVESHA evaluates historical, aggregate area-level statistics from official public records. The framework does NOT:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px] text-[#111111] font-mono pt-1">
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Identify individuals</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Score or rate individuals</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Predict individual criminality</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Perform facial recognition</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Conduct surveillance</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Determine criminal guilt</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Assert causal relationships</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A61B1B] font-bold">✕</span> Autonomously direct policing</li>
            </ul>
          </div>

          {/* Temporal Coverage & Data Product Matrix */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs text-[#111111] uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-[#A61B1B]" />
              Track A Official Data & Document Corpus Matrix
            </h3>

            <div className="border border-[#D8D6D0] overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1F0EB] border-b border-[#D8D6D0] text-[#777777] font-mono text-[10px] uppercase">
                    <th className="py-2 px-3">Data Product</th>
                    <th className="py-2 px-3">Coverage</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Scope / Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D6D0] font-sans">
                  <tr>
                    <td className="py-2 px-3 font-bold font-mono text-[#111111]">ANVESHA_CRIME_MASTER</td>
                    <td className="py-2 px-3 font-mono">2001–2023</td>
                    <td className="py-2 px-3">
                      <span className="badge-observed">OFFICIAL OBSERVED</span>
                    </td>
                    <td className="py-2 px-3 text-[#4B4B4B]">NCRB & SCRB Official Statistics ({summary?.data?.total_observations || 4558} records)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold font-mono text-[#111111]">DOCUMENTARY_EVIDENCE</td>
                    <td className="py-2 px-3 font-mono">2017–2023</td>
                    <td className="py-2 px-3">
                      <span className="badge-derived">VECTOR INDEXED</span>
                    </td>
                    <td className="py-2 px-3 text-[#4B4B4B]">4,052 Extracted PDF Document Tables (BGE-M3 RAG)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold font-mono text-[#111111]">CENSUS_POPULATION</td>
                    <td className="py-2 px-3 font-mono">2001 / 2011</td>
                    <td className="py-2 px-3">
                      <span className="badge-derived">POPULATION LAYER</span>
                    </td>
                    <td className="py-2 px-3 text-[#4B4B4B]">District & City Population Denominators</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Research & Leakage Integrity */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs text-[#111111] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A61B1B]" />
              Scientific Protocol & Data Integrity Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 border border-[#D8D6D0] bg-[#FFFFFF] space-y-1">
                <div className="font-bold text-[#111111]">Zero Temporal Leakage</div>
                <div className="text-[#4B4B4B]">Strict chronological evaluation. Forecasts at time $T+1$ utilize observations up to $T$ only.</div>
              </div>

              <div className="p-3 border border-[#D8D6D0] bg-[#FFFFFF] space-y-1">
                <div className="font-bold text-[#111111]">Zero Synthetic Contamination</div>
                <div className="text-[#4B4B4B]">Synthetic candidate estimates are isolated from official observations and explicitly tagged.</div>
              </div>

              <div className="p-3 border border-[#D8D6D0] bg-[#FFFFFF] space-y-1">
                <div className="font-bold text-[#111111]">Baseline Honesty</div>
                <div className="text-[#4B4B4B]">Models are benchmarked against T-1 Persistence baseline (MAE 171.50, RMSE 581.57, R² 0.9142).</div>
              </div>

              <div className="p-3 border border-[#D8D6D0] bg-[#FFFFFF] space-y-1">
                <div className="font-bold text-[#111111]">No Causal Claims</div>
                <div className="text-[#4B4B4B]">Feature importance scores represent statistical model behavior and do not state physical causation.</div>
              </div>
            </div>
          </div>

          {/* Cryptographic Lineage Footer */}
          <div className="pt-3 border-t border-[#D8D6D0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B4B4B] font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#26734D]" />
              <span>SHA256 BENCHMARK HASH:</span>
              <span className="font-bold text-[#111111] bg-[#F1F0EB] px-2 py-0.5 border border-[#D8D6D0]">
                768a899b7c5e1df41ce2cd2a...
              </span>
            </div>
            <div className="text-[11px] text-[#777777]">
              NCRB / SCRB Public Research Record
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#D8D6D0] bg-[#F1F0EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#A61B1B] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            CLOSE ETHICS & GOVERNANCE
          </button>
        </div>
      </div>
    </div>
  );
};
