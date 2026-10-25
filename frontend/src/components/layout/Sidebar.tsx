import React from 'react';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  FileCode2,
  Info
} from 'lucide-react';

export type SectionId =
  | 'overview'
  | 'crimeshift'
  | 'map'
  | 'forecasts'
  | 'evidence'
  | 'validation'
  | 'methodology'
  | 'about';

interface SidebarProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  backendOnline: boolean;
}

interface NavItem {
  id: SectionId;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

const analysisItems: NavItem[] = [
  { id: 'overview', label: 'Overview', subtitle: 'Research Briefing & Baseline', icon: LayoutDashboard },
  { id: 'crimeshift', label: 'CRIME-SHIFT Engine', subtitle: 'BOCPD, HMM & Transition', icon: Activity },
  { id: 'map', label: 'Geographic Intelligence', subtitle: 'Interactive GIS Workstation', icon: MapPin },
  { id: 'forecasts', label: 'Forecast Intelligence', subtitle: 'Multi-Horizon & Conformal', icon: TrendingUp },
];

const researchItems: NavItem[] = [
  { id: 'evidence', label: 'Research Evidence', subtitle: 'Literature & Citations', icon: BookOpen },
  { id: 'validation', label: 'Validation & Audits', subtitle: 'Chronological Out-of-Sample', icon: CheckCircle2 },
];

const systemItems: NavItem[] = [
  { id: 'methodology', label: 'Methodology', subtitle: 'Mathematical Definitions', icon: FileCode2 },
  { id: 'about', label: 'About & Provenance', subtitle: 'Governance & Data Lineage', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  backendOnline,
}) => {
  return (
    <aside className="w-[240px] bg-[#FFFFFF] border-r border-[#DCDDD8] flex flex-col h-screen shrink-0 text-[#17202A] font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#DCDDD8] bg-[#F8F8F5]">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSelectSection('overview')}>
          <img
            src="/assets/anvesha_logo.png"
            alt="ANVESHA 2.0"
            className="h-10 w-auto object-contain filter drop-shadow-2xs"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* ANALYSIS */}
        <div>
          <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider">
            ANALYSIS WORKSTATION
          </div>
          <div className="space-y-0.5">
            {analysisItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 cursor-pointer rounded-xs relative ${
                    isActive
                      ? 'bg-[#F8F8F5] text-[#0B7F78] font-semibold'
                      : 'text-[#68727A] hover:bg-[#F8F8F5] hover:text-[#17202A]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0B7F78] rounded-r-xs" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B7F78]' : 'text-[#9AA1A5]'}`} />
                  <div className="truncate">
                    <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#0B7F78]' : 'font-medium'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] font-sans truncate ${isActive ? 'text-[#075E59]' : 'text-[#9AA1A5]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RESEARCH */}
        <div>
          <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider">
            RESEARCH & EVIDENCE
          </div>
          <div className="space-y-0.5">
            {researchItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 cursor-pointer rounded-xs relative ${
                    isActive
                      ? 'bg-[#F8F8F5] text-[#0B7F78] font-semibold'
                      : 'text-[#68727A] hover:bg-[#F8F8F5] hover:text-[#17202A]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0B7F78] rounded-r-xs" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B7F78]' : 'text-[#9AA1A5]'}`} />
                  <div className="truncate">
                    <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#0B7F78]' : 'font-medium'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] font-sans truncate ${isActive ? 'text-[#075E59]' : 'text-[#9AA1A5]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SYSTEM */}
        <div>
          <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#9AA1A5] uppercase tracking-wider">
            SYSTEM & GOVERNANCE
          </div>
          <div className="space-y-0.5">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 cursor-pointer rounded-xs relative ${
                    isActive
                      ? 'bg-[#F8F8F5] text-[#0B7F78] font-semibold'
                      : 'text-[#68727A] hover:bg-[#F8F8F5] hover:text-[#17202A]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0B7F78] rounded-r-xs" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B7F78]' : 'text-[#9AA1A5]'}`} />
                  <div className="truncate">
                    <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#0B7F78]' : 'font-medium'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] font-sans truncate ${isActive ? 'text-[#075E59]' : 'text-[#9AA1A5]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#DCDDD8] bg-[#F8F8F5] text-[10px] font-mono space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[#68727A]">DATA STATUS:</span>
          <span className={`inline-flex items-center space-x-1 font-bold ${backendOnline ? 'text-[#0B7F78]' : 'text-[#8E3B3B]'}`}>
            <span>● {backendOnline ? 'Connected' : 'Offline'}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#68727A]">MODEL ENGINE:</span>
          <span className="text-[#0B7F78] font-bold">● Ready</span>
        </div>
        <div className="pt-1 border-t border-[#DCDDD8] flex items-center justify-between text-[9px] text-[#9AA1A5]">
          <span>ANVESHA 2.0</span>
          <span>NCRB/SCRB Panel</span>
        </div>
      </div>
    </aside>
  );
};
