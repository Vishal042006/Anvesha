import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  AlertTriangle,
  MapPin,
  BookOpen,
  FileCode,
  Info
} from 'lucide-react';

export type SectionId = 
  | 'overview'
  | 'command_center'
  | 'analysis'
  | 'anomalies'
  | 'map'
  | 'research'
  | 'methodology'
  | 'about'
  | 'forecast'
  | 'explain'
  | 'data'
  | 'classification';

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

const primaryNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', subtitle: 'Crime patterns & forecast signals', icon: LayoutDashboard },
  { id: 'analysis', label: 'Analysis', subtitle: 'Historical & forecasted trends', icon: LineChart },
  { id: 'anomalies', label: 'Anomalies', subtitle: 'Statistically unusual changes', icon: AlertTriangle },
  { id: 'map', label: 'Map', subtitle: 'Spatial GIS intelligence', icon: MapPin },
  { id: 'research', label: 'Research', subtitle: 'Models & literature matrix', icon: BookOpen },
];

const systemNavItems: NavItem[] = [
  { id: 'methodology', label: 'Methodology', subtitle: 'Technical details & validation', icon: FileCode },
  { id: 'about', label: 'About', subtitle: 'System overview & scope', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  backendOnline,
}) => {
  const activeSection = currentSection === 'command_center' ? 'overview' : currentSection;

  return (
    <aside className="w-60 bg-white border-r border-[#E2E8F0] flex flex-col h-screen shrink-0 text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-sm rounded-xs">
            A
          </div>
          <div>
            <h1 className="font-sans font-bold text-base tracking-tight text-[#0F172A] leading-none">
              ANVESHA
            </h1>
            <p className="text-[10px] text-[#64748B] font-medium tracking-wide mt-1">
              Aggregate Crime Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
          INTELLIGENCE
        </div>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 group cursor-pointer rounded-xs ${
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
                <div className={`text-[10px] font-sans truncate ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}

        {/* Subtle Divider */}
        <div className="pt-3 pb-1 px-3">
          <div className="border-t border-[#E2E8F0]" />
        </div>

        <div className="px-3 pb-1 text-[9px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
          SYSTEM
        </div>
        {systemNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full px-3 py-2 text-left transition-all flex items-center space-x-2.5 group cursor-pointer rounded-xs ${
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
                <div className={`text-[10px] font-sans truncate ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Metadata */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">SYSTEM STATUS:</span>
          <span className={`inline-flex items-center space-x-1 font-bold ${backendOnline ? 'text-[#166534]' : 'text-[#DC2626]'}`}>
            <span>{backendOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </span>
        </div>
      </div>
    </aside>
  );
};

