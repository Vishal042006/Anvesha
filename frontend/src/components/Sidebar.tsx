import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';

export type SectionId = 'overview_explorer' | 'spatial_forecast' | 'deviations_evidence' | 'provenance_method';

interface NavigationProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
}

interface NavTab {
  id: SectionId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const navTabs: NavTab[] = [
  {
    id: 'overview_explorer',
    title: 'Overview & Crime Analytics',
    subtitle: 'Historical patterns & trends (2001–2014)',
    icon: LayoutDashboard,
  },
  {
    id: 'spatial_forecast',
    title: 'Spatial Intelligence & Forecasts',
    subtitle: 'TN unit map & next-year projections',
    icon: MapPin,
  },
  {
    id: 'deviations_evidence',
    title: 'Deviations & Evidence Search',
    subtitle: 'Statistical anomalies & PDF compendiums',
    icon: AlertTriangle,
  },
  {
    id: 'provenance_method',
    title: 'Governance & Data Lineage',
    subtitle: 'SHA256 audit & research specification',
    icon: GitBranch,
  },
];

export const Sidebar: React.FC<NavigationProps> = ({ currentSection, onSelectSection }) => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-xs px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center space-x-1 sm:space-x-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSection(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2.5 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm border border-blue-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <div className="text-left">
                  <div className="leading-none font-bold">{tab.title}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden lg:block">
          Tamil Nadu Police Research Portal | <span className="text-blue-900 font-bold">Official Mode</span>
        </div>
      </div>
    </nav>
  );
};
