import React, { useState } from 'react';
import { Database, Info, LayoutDashboard, Search, MapPin, Sparkles, Server } from 'lucide-react';
import type { SummaryResponse } from '../types';
import { AboutModal } from './AboutModal';

export type SectionId = 'overview' | 'explorer' | 'map_forecasts' | 'assistant';

interface NavbarProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  summary: SummaryResponse | null;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  summary,
  backendOnline,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navItems = [
    { id: 'overview' as SectionId, label: 'Overview', icon: LayoutDashboard },
    { id: 'explorer' as SectionId, label: 'Crime Explorer', icon: Search },
    { id: 'map_forecasts' as SectionId, label: 'Map & Forecasts', icon: MapPin },
    { id: 'assistant' as SectionId, label: 'Research Assistant', icon: Sparkles },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-[#E4EAF1] sticky top-0 z-40 shadow-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Branding & Geometric Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Geometric ANVESHA Brand Symbol */}
            <div className="w-9 h-9 rounded-xl bg-[#2457A7] text-white flex items-center justify-center shadow-xs">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-white"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" strokeOpacity="0.4" />
                <polygon points="12,7 15,12 12,17 9,12" fill="currentColor" fillOpacity="0.25" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#17243B] tracking-tight">ANVESHA</span>
                <span className="text-[10px] font-semibold bg-slate-100 text-[#64748B] px-2 py-0.5 rounded-full border border-slate-200">
                  TN Research
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium leading-none hidden sm:block">
                Crime Intelligence & Research Platform
              </p>
            </div>
          </div>

          {/* Center: 4 Navigation Items */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2457A7] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#17243B] hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Telemetry & About Button */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-[#64748B] bg-slate-50 border border-[#E4EAF1] px-3 py-1.5 rounded-lg">
              <Database className="w-3.5 h-3.5 text-[#087F8C]" />
              <span className="font-mono text-[11px]">
                {summary?.data?.year_range ? `${summary.data.year_range[0]}–${summary.data.year_range[1]}` : '2001–2014'} Validated
              </span>
            </div>

            {/* API Status Dot */}
            <div className="flex items-center space-x-1 text-[11px] font-medium text-[#64748B]" title={backendOnline ? 'API Connected' : 'API Offline'}>
              <Server className={`w-3.5 h-3.5 ${backendOnline ? 'text-[#13856B]' : 'text-rose-500'}`} />
            </div>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-[#E4EAF1] bg-white text-[#17243B] hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Info className="w-3.5 h-3.5 text-[#2457A7]" />
              <span className="hidden sm:inline">About / Sources</span>
            </button>
          </div>
        </div>
      </header>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        summary={summary}
      />
    </>
  );
};
