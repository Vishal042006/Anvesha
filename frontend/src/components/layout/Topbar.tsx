import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { useAnalyticalContext } from '../../context/AnalyticalContext';

export type NavSectionId =
  | 'overview'
  | 'crimeshift'
  | 'map'
  | 'forecasts'
  | 'research';

interface TopbarProps {
  currentSection?: NavSectionId;
  onSelectSection?: (section: NavSectionId) => void;
  onSearch?: (query: string) => void;
  onOpenProvenance?: () => void;
  onRunAnalysis?: () => void;
  onExport?: () => void;
  isExecuting?: boolean;
}

export const TopBar: React.FC<TopbarProps> = ({
  currentSection = 'overview',
  onSelectSection,
  onSearch,
  onRunAnalysis,
  onExport,
  isExecuting = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { district, category, year } = useAnalyticalContext();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const navItems: { id: NavSectionId; label: string }[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'crimeshift', label: 'CRIME-SHIFT' },
    { id: 'map', label: 'GEOGRAPHIC INTELLIGENCE' },
    { id: 'forecasts', label: 'FORECAST INTELLIGENCE' },
    { id: 'research', label: 'DECISION & MODEL LAB' },
  ];

  return (
    <header className="h-20 bg-white border-b border-[#E5E7EB] px-6 md:px-10 flex items-center justify-between shrink-0 font-sans sticky top-0 z-40 transition-all">
      {/* Left Brand & Context Capsule */}
      <div className="flex items-center space-x-4">
        <div
          className="flex items-center cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => onSelectSection && onSelectSection('overview')}
          title="Return to Overview"
        >
          <img
            src="/assets/anvesha_logo.png"
            alt="ANVESHA 2.0"
            className="h-12 sm:h-14 md:h-[58px] w-auto object-contain filter drop-shadow-2xs"
          />
        </div>

        <div className="h-6 w-px bg-[#E5E7EB]" />

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-[#111827]">Crime-Shift</span>
          <span className="text-[#9CA3AF]">/</span>
          <span className="bg-[#F3F4F6] px-2.5 py-1 rounded-full text-[11px] font-medium text-[#374151] flex items-center space-x-1.5" title={`${category.replace('_', ' ')} (${year})`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold text-[#111827]">{district}</span>
            <span className="text-[#6B7280] text-[10px] hidden sm:inline">({category.replace('_', ' ')})</span>
          </span>
        </div>
      </div>

      {/* Center Navigation Capsule */}
      <div className="bg-[#F3F4F6] p-1 rounded-full flex items-center space-x-0.5 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection && onSelectSection(item.id)}
              className={`px-3 py-1 text-[11px] font-mono font-semibold tracking-wide rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#111827] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Search & Action Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden xl:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search precincts, IPC codes..."
            className="w-48 pl-8 pr-3 py-1.5 text-xs bg-[#F3F4F6] border-none rounded-full text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0D9488] font-sans transition-all"
          />
        </form>

        {/* Export Button */}
        <button
          onClick={onExport || (() => window.open('/api/v1/crimeshift/export', '_blank'))}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#F9FAFB] transition-all cursor-pointer shadow-2xs"
          title="Export Verified Research & Dataset Bundle (JSON/Parquet)"
        >
          <Upload className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Export Bundle</span>
        </button>

        {/* Primary Retest Button with live state */}
        <button
          onClick={onRunAnalysis}
          disabled={isExecuting}
          className={`inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer ${
            isExecuting
              ? 'bg-[#0D9488] text-white opacity-90 cursor-wait'
              : 'text-white bg-[#0F172A] hover:bg-[#1E293B]'
          }`}
          title="Trigger CRIME-SHIFT Spatio-Temporal Pipeline Execution"
        >
          {isExecuting ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running ML Pipeline...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Run Pipeline</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
