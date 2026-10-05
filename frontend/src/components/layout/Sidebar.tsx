import React from 'react';
import {
  BookOpen,
  Database,
  Cpu,
  Activity,
  Award,
  LineChart,
  AlertTriangle,
  GitCompare,
  FileCode
} from 'lucide-react';

export type SectionId = 
  | 'command_center'
  | 'data'
  | 'classification'
  | 'anomalies'
  | 'forecast'
  | 'map'
  | 'explain'
  | 'research'
  | 'methodology';

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

const researchNavItems: NavItem[] = [
  { id: 'command_center', label: '1. Command Center', subtitle: 'Tamil Nadu Overview & Live Insights', icon: BookOpen },
  { id: 'data', label: '2. Data', subtitle: 'Source Inventory & Provenance', icon: Database },
  { id: 'classification', label: '3. Classification', subtitle: 'Taxonomy & Supervised Classifier', icon: Cpu },
  { id: 'anomalies', label: '4. Anomalies', subtitle: 'Isolation Forest Anomaly Engine', icon: AlertTriangle },
  { id: 'forecast', label: '5. Forecast', subtitle: '8-Model Expanding Backtesting', icon: LineChart },
  { id: 'map', label: '6. Map', subtitle: 'Tamil Nadu GIS & Police Stations', icon: Activity },
  { id: 'explain', label: '7. Explain', subtitle: 'Evidence-Grounded Ollama/Qwen LLM', icon: GitCompare },
  { id: 'research', label: '8. Research', subtitle: 'OpenAlex, Semantic Scholar & Crossref', icon: Award },
  { id: 'methodology', label: '9. Methodology', subtitle: 'Formulas, Pipeline & Validation', icon: FileCode }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  backendOnline,
  modelVersion = 'V4.0-RESEARCH',
}) => {
  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col h-screen shrink-0 text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-sm rounded-sm">
            A
          </div>
          <div>
            <h1 className="font-sans font-bold text-base tracking-tight text-[#0F172A] leading-none">
              ANVESHA
            </h1>
            <p className="text-[9px] font-mono text-[#2563EB] font-bold tracking-widest uppercase mt-0.5">
              MODEL-FIRST RESEARCH
            </p>
          </div>
        </div>
        <p className="text-[10px] text-[#64748B] mt-2 leading-tight">
          Spatio-Temporal Crime Forecasting Research Platform
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 pb-1.5 text-[9px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
          RESEARCH NAVIGATION
        </div>
        {researchNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 group cursor-pointer rounded-sm ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-l-3 border-[#2563EB]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] border-l-3 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}`} />
              <div className="truncate">
                <div className={`text-xs font-sans truncate ${isActive ? 'font-bold text-[#1E40AF]' : 'font-medium'}`}>
                  {item.label}
                </div>
                <div className={`text-[10px] font-mono truncate ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Metadata */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-[10px] space-y-1 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">BACKEND API:</span>
          <span className={`inline-flex items-center space-x-1 font-bold ${backendOnline ? 'text-[#166534]' : 'text-[#DC2626]'}`}>
            <span>{backendOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">PIPELINE:</span>
          <span className="text-[#0F172A] font-semibold">{modelVersion}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-1 mt-1">
          <span className="text-[#64748B]">BENCHMARK:</span>
          <span className="text-[#166534] font-bold">2001–2014 NCRB</span>
        </div>
      </div>
    </aside>
  );
};
