import React, { useState } from 'react';
import { ShieldCheck, Info, AlertTriangle, Cpu, FileText, Database } from 'lucide-react';

export type ProvenanceType = 
  | 'OBSERVED' 
  | 'DERIVED' 
  | 'MODELLED' 
  | 'FORECAST' 
  | 'ESTIMATED' 
  | 'SYNTHETIC' 
  | 'ANOMALY' 
  | 'INSUFFICIENT_HISTORY';

interface ProvenanceBadgeProps {
  type: ProvenanceType | string;
  sourceText?: string;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ type, sourceText, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const normalizedType = (type || 'OBSERVED').toUpperCase() as ProvenanceType;

  const getConfig = (t: ProvenanceType) => {
    switch (t) {
      case 'OBSERVED':
        return {
          bg: 'bg-[#F1F0EB] text-[#111111] border-[#1A1A1A]',
          icon: ShieldCheck,
          label: 'OFFICIAL OBSERVED',
          description: '100% verified FIR incident count from official annual compendiums.',
          isOfficial: true,
        };
      case 'DERIVED':
        return {
          bg: 'bg-[#EFF6FF] text-[#2457A6] border-[#BFDBFE]',
          icon: FileText,
          label: 'DERIVED STATISTIC',
          description: 'Calculated rate per 100,000 population or year-over-year percentage change derived from official counts.',
          isOfficial: true,
        };
      case 'FORECAST':
      case 'MODELLED':
        return {
          bg: 'bg-[#FEF2F2] text-[#A61B1B] border-[#FECACA]',
          icon: Cpu,
          label: 'MODEL FORECAST',
          description: 'Out-of-sample point forecast computed using leakage-free autoregressive models (Persistence T-1 / Ridge).',
          isOfficial: false,
        };
      case 'SYNTHETIC':
      case 'ESTIMATED':
        return {
          bg: 'bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]',
          icon: AlertTriangle,
          label: 'SYNTHETIC ESTIMATE',
          description: 'Post-2014 extension record generated via trend drift rule. NOT verified real-world accuracy.',
          isOfficial: false,
        };
      case 'ANOMALY':
        return {
          bg: 'bg-[#FFFBEB] text-[#B7791F] border-[#B7791F]',
          icon: AlertTriangle,
          label: 'STATISTICAL ANOMALY FLAG',
          description: 'Volume outlier score computed via IsolationForest. Indicates volume trajectory shifts, NOT individual wrongdoing.',
          isOfficial: false,
        };
      case 'INSUFFICIENT_HISTORY':
        return {
          bg: 'bg-[#F1F0EB] text-[#777777] border-[#D8D6D0]',
          icon: Info,
          label: 'INSUFFICIENT HISTORY',
          description: 'Historical continuous series contains less than 3 continuous years. Automated forecast generation refused.',
          isOfficial: false,
        };
      default:
        return {
          bg: 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0]',
          icon: Database,
          label: t,
          description: sourceText || 'Analytical data product.',
          isOfficial: false,
        };
    }
  };

  const config = getConfig(normalizedType);
  const IconComponent = config.icon;

  return (
    <div className="relative inline-block font-mono">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold border transition-colors cursor-pointer ${config.bg} ${className}`}
      >
        <IconComponent className="w-3 h-3" />
        <span>[{config.label}]</span>
      </button>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-[#FFFFFF] text-[#111111] text-xs border-2 border-[#1A1A1A] pointer-events-none font-sans shadow-lg">
          <div className="font-bold text-[#111111] mb-1 flex items-center justify-between font-mono">
            <span>{config.label}</span>
            <span className={config.isOfficial ? 'text-[#26734D] text-[10px]' : 'text-[#B7791F] text-[10px]'}>
              {config.isOfficial ? '✔ OFFICIAL' : '⚠ NON-OFFICIAL'}
            </span>
          </div>
          <p className="text-[#4B4B4B] text-[11px] leading-relaxed mb-2">{config.description}</p>
          {sourceText && (
            <div className="text-[10px] text-[#777777] border-t border-[#D8D6D0] pt-1.5 font-mono">
              <strong>Source:</strong> {sourceText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
