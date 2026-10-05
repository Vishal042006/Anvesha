import React from 'react';
import {
  Compass,
  BarChart3,
  LineChart,
  Map,
  BookOpen,
  GitBranch,
  FileText,
  Info,
  Activity,
  ShieldCheck
} from 'lucide-react';

export type SectionId = 
  | 'explore'
  | 'analyze'
  | 'forecast'
  | 'map'
  | 'evidence'
  | 'data_methods'
  | 'research'
  | 'about';

interface SidebarProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  backendOnline: boolean;
  modelVersion?: string;
}

interface NavItem {
  id: SectionId;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

const primaryNavItems: NavItem[] = [
  { id: 'explore', label: 'Explore', subtitle: 'Unified Evidence Workspace', icon: Compass },
  { id: 'analyze', label: 'Analyze', subtitle: 'Historical Crime Trajectory', icon: BarChart3 },
  { id: 'forecast', label: 'Forecast', subtitle: 'Temporal Projections', icon: LineChart },
  { id: 'map', label: 'Map', subtitle: 'Spatial & Forecast Layers', icon: Map },
  { id: 'evidence', label: 'Evidence', subtitle: 'Research Corpus & Guidance', icon: BookOpen },
];

const secondaryNavItems: NavItem[] = [
  { id: 'data_methods', label: 'Data & Methods', subtitle: 'Provenance & Model Registry', icon: GitBranch },
  { id: 'research', label: 'Research', subtitle: 'IEEE Publication Synthesis', icon: FileText },
  { id: 'about', label: 'About', subtitle: 'Ethics & Decision Governance', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  backendOnline,
  modelVersion = 'V3.4_CANONICAL',
}) => {
  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#D8D6D0] flex flex-col h-screen shrink-0 text-[#111111] selection:bg-[#A61B1B] selection:text-white font-sans">
      {/* Sidebar Brand Header */}
      <div className="p-4 border-b border-[#D8D6D0] bg-[#F1F0EB]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-[#1A1A1A] text-white flex items-center justify-center font-serif font-black text-base rounded-xs">
            A
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-base tracking-tight text-[#111111] leading-none">
              ANVESHA
            </h1>
            <p className="text-[9px] font-mono text-[#A61B1B] font-bold tracking-widest uppercase mt-0.5">
              EVIDENCE-GROUNDED AI
            </p>
          </div>
        </div>
        <p className="text-[10px] text-[#4B4B4B] mt-2 leading-tight font-sans">
          Spatio-Temporal Crime Intelligence Decision Support
        </p>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* Primary Navigation */}
        <div className="space-y-0.5">
          <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#777777] uppercase tracking-wider">
            PRIMARY WORKSPACE
          </div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 group cursor-pointer rounded-xs ${
                  isActive
                    ? 'bg-[#F1F0EB] text-[#111111] font-semibold border-l-3 border-[#A61B1B]'
                    : 'text-[#4B4B4B] hover:bg-[#F8F7F3] hover:text-[#111111] border-l-3 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A61B1B]' : 'text-[#777777] group-hover:text-[#111111]'}`} />
                <div className="truncate">
                  <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#111111]' : 'font-medium'}`}>
                    {item.label}
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isActive ? 'text-[#A61B1B]' : 'text-[#777777]'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-0.5 border-t border-[#D8D6D0] pt-3">
          <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#777777] uppercase tracking-wider">
            METHODOLOGY & AUDIT
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 group cursor-pointer rounded-xs ${
                  isActive
                    ? 'bg-[#F1F0EB] text-[#111111] font-semibold border-l-3 border-[#1A1A1A]'
                    : 'text-[#4B4B4B] hover:bg-[#F8F7F3] hover:text-[#111111] border-l-3 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-[#777777] group-hover:text-[#111111]'}`} />
                <div className="truncate">
                  <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#111111]' : 'font-medium'}`}>
                    {item.label}
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isActive ? 'text-[#1A1A1A]' : 'text-[#777777]'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer Metadata */}
      <div className="p-3 border-t border-[#D8D6D0] bg-[#F1F0EB] text-[10px] space-y-1 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[#777777]">API STATUS:</span>
          <span className={`inline-flex items-center space-x-1 font-bold ${backendOnline ? 'text-[#26734D]' : 'text-[#A61B1B]'}`}>
            <Activity className="w-3 h-3 animate-pulse" />
            <span>{backendOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#777777]">MODEL:</span>
          <span className="text-[#111111] font-semibold truncate max-w-[110px]" title={modelVersion}>{modelVersion}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#D8D6D0] pt-1 mt-1">
          <span className="text-[#777777]">PROVENANCE:</span>
          <span className="text-[#26734D] font-bold inline-flex items-center space-x-0.5">
            <ShieldCheck className="w-3 h-3 inline" />
            <span>TRACK A AUDITED</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
