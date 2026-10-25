import React from 'react';
import { X, ShieldCheck, Database, Calendar, MapPin, Cpu, Hash } from 'lucide-react';

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetValue?: string;
  sourceType?: 'OBSERVED' | 'MODELLED' | 'FORECAST' | 'ESTIMATED';
  datasetName?: string;
  timePeriod?: string;
  geography?: string;
  method?: string;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  targetValue = '14,820 Recorded Cases (Chennai City, 2023)',
  sourceType = 'OBSERVED',
  datasetName = 'ANVESHA Canonical NCRB/SCRB Panel (2001–2023)',
  timePeriod = '2001–2023 (Train <= 2017 | Val 2018–2020 | Test 2021–2023)',
  geography = 'Tamil Nadu (38 Canonical Police Units)',
  method = 'Official Observed Source Reporting & Canonical Crosswalk Harmonization',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity font-sans">
      <div className="w-[420px] bg-white border-l border-[#DCDDD8] h-full flex flex-col shadow-xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#DCDDD8] bg-[#F8F8F5] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#0B7F78]" />
            <div>
              <h2 className="font-bold text-sm text-[#17202A] tracking-tight">
                DATA PROVENANCE & AUDIT LINEAGE
              </h2>
              <p className="text-[10px] font-mono text-[#68727A]">
                ANVESHA Verification Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9AA1A5] hover:text-[#17202A] hover:bg-[#DCDDD8]/40 rounded-xs transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Target Value Box */}
          <div className="p-3.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs space-y-1">
            <span className="text-[10px] font-mono text-[#9AA1A5] uppercase tracking-wider block">
              INSPECTED AUDIT TARGET
            </span>
            <div className="text-sm font-bold text-[#17202A] font-mono">
              {targetValue}
            </div>
          </div>

          {/* Lineage Metadata Grid */}
          <div className="space-y-4">
            {/* Source Type */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  SOURCE TYPE CLASSIFICATION
                </span>
                <span className={`inline-block mt-1 font-mono text-xs font-bold px-2 py-0.5 rounded-xs border ${
                  sourceType === 'OBSERVED' ? 'bg-[#F8F8F5] text-[#17202A] border-[#DCDDD8]' :
                  sourceType === 'MODELLED' ? 'bg-[#F0FDF4] text-[#0B7F78] border-[#99F6E4]' :
                  sourceType === 'FORECAST' ? 'bg-[#EFF6FF] text-[#075E59] border-[#93C5FD]' :
                  'bg-[#F8ECEA] text-[#8E3B3B] border-[#FCA5A5]'
                }`}>
                  ● {sourceType}
                </span>
              </div>
            </div>

            {/* Dataset Name */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  CANONICAL DATASET
                </span>
                <p className="text-xs text-[#17202A] font-medium mt-0.5">
                  {datasetName}
                </p>
              </div>
            </div>

            {/* Time Period */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  TEMPORAL COVERAGE & SPLIT
                </span>
                <p className="text-xs text-[#17202A] font-medium mt-0.5 font-mono">
                  {timePeriod}
                </p>
              </div>
            </div>

            {/* Geography */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  GEOGRAPHIC BOUNDARY & CROSSWALK
                </span>
                <p className="text-xs text-[#17202A] font-medium mt-0.5">
                  {geography}
                </p>
              </div>
            </div>

            {/* Method */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  METHODOLOGY / ALGORITHM
                </span>
                <p className="text-xs text-[#17202A] font-medium mt-0.5">
                  {method}
                </p>
              </div>
            </div>

            {/* SHA-256 Audit Hash */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[#0B7F78] shrink-0">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider block">
                  VERIFICATION SHA-256 HASH
                </span>
                <p className="text-[10px] font-mono text-[#0B7F78] mt-0.5 break-all bg-[#F8F8F5] p-1 border border-[#DCDDD8] rounded-xs">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>
            </div>
          </div>

          {/* Methodological Note */}
          <div className="p-3 bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs text-[11px] text-[#68727A] space-y-1">
            <span className="font-bold text-[#17202A] block font-mono text-[10px] uppercase">
              REPRODUCIBILITY STATEMENT
            </span>
            <p className="leading-relaxed">
              ANVESHA 2.0 strictly separates observed source records from synthetic gap-fills and model-derived estimates. All transition prediction features are constructed strictly at time t to predict y(t+1) without future leakage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#DCDDD8] bg-[#F8F8F5] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#9AA1A5]">
            ANVESHA Provenance Engine v2.0
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-mono font-bold text-white bg-[#0B7F78] rounded-xs hover:bg-[#075E59] transition-all cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
