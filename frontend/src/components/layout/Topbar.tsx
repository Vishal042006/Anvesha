import React, { useState, useEffect } from 'react';
import { Info, Server, ShieldAlert } from 'lucide-react';
import type { SummaryResponse } from '../../types';
import { AboutModal } from '../AboutModal';
import { geographyApi } from '../../services/api';

interface TopbarProps {
  selectedState?: string;
  onSelectState?: (state: string) => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedYear: number;
  onSelectYear: (year: number) => void;
  summary: SummaryResponse | null;
  backendOnline: boolean;
  policeUnits?: string[];
  categories?: string[];
}

export const Topbar: React.FC<TopbarProps> = ({
  selectedState = 'All',
  onSelectState,
  selectedUnit,
  onSelectUnit,
  selectedCategory,
  onSelectCategory,
  selectedYear,
  onSelectYear,
  summary,
  backendOnline,
  policeUnits = ['Pune', 'Chennai', 'Mumbai', 'Lucknow', 'Bangalore', 'Kolkata', 'Delhi', 'Jaipur', 'Hyderabad', 'Ahmedabad'],
  categories = ['ipc_total', 'property_crime_derived', 'violent_crime_derived', 'crime_against_women_derived', 'murder', 'rape', 'robbery', 'theft', 'riots'],
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statesList, setStatesList] = useState<string[]>(['All']);
  const [districtsList, setDistrictsList] = useState<string[]>(policeUnits);

  useEffect(() => {
    geographyApi.getStates()
      .then((res) => {
        if (res?.states?.length) {
          setStatesList(['All', ...res.states]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    geographyApi.getDistricts(selectedState === 'All' ? undefined : selectedState)
      .then((res) => {
        if (res?.districts?.length) {
          setDistrictsList(res.districts);
        }
      })
      .catch(() => {});
  }, [selectedState]);

  const yearOptions = Array.from({ length: 23 }, (_, i) => 2001 + i); // 2001..2023

  return (
    <>
      <header className="bg-[#FFFFFF] border-b border-[#D8D6D0] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[#111111] font-sans">
        {/* Left: Editorial Tag & Subtitle */}
        <div className="flex items-center space-x-3">
          <span className="font-mono text-[10px] uppercase font-bold text-[#A61B1B] bg-[#F1F0EB] px-2 py-0.5 border border-[#D8D6D0]">
            INDIA CRIME INTELLIGENCE
          </span>
          <span className="text-[#D8D6D0] hidden md:inline">|</span>
          <span className="text-xs text-[#4B4B4B] font-sans hidden md:inline">
            Evidence-Grounded Spatio-Temporal Platform
          </span>
        </div>

        {/* Center: Global Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
          {/* State / UT */}
          {onSelectState && (
            <div className="flex items-center bg-[#F1F0EB] border border-[#D8D6D0] px-2.5 py-1">
              <span className="text-[#777777] font-mono text-[10px] mr-2 uppercase font-bold">STATE:</span>
              <select
                value={selectedState}
                onChange={(e) => onSelectState(e.target.value)}
                className="bg-transparent text-[#111111] font-bold focus:outline-hidden cursor-pointer text-xs pr-1 font-sans"
              >
                {statesList.map((s) => (
                  <option key={s} value={s} className="bg-white text-[#111111]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* District / Administrative Unit */}
          <div className="flex items-center bg-[#F1F0EB] border border-[#D8D6D0] px-2.5 py-1">
            <span className="text-[#777777] font-mono text-[10px] mr-2 uppercase font-bold">DISTRICT:</span>
            <select
              value={selectedUnit}
              onChange={(e) => onSelectUnit(e.target.value)}
              className="bg-transparent text-[#111111] font-bold focus:outline-hidden cursor-pointer text-xs pr-1 font-sans"
            >
              {districtsList.map((u) => (
                <option key={u} value={u} className="bg-white text-[#111111]">
                  {u.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Crime Category */}
          <div className="flex items-center bg-[#F1F0EB] border border-[#D8D6D0] px-2.5 py-1">
            <span className="text-[#777777] font-mono text-[10px] mr-2 uppercase font-bold">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-transparent text-[#111111] font-bold focus:outline-hidden cursor-pointer text-xs pr-1 font-sans"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-white text-[#111111]">
                  {c.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Target Year */}
          <div className="flex items-center bg-[#F1F0EB] border border-[#D8D6D0] px-2.5 py-1">
            <span className="text-[#777777] font-mono text-[10px] mr-2 uppercase font-bold">YEAR:</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-transparent text-[#111111] font-bold focus:outline-hidden cursor-pointer text-xs pr-1 font-mono font-bold"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y} className="bg-white text-[#111111]">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Telemetry Status & Info Modal Trigger */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsStatusOpen(true)}
            className={`px-2.5 py-1 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors border cursor-pointer ${
              backendOnline
                ? 'bg-[#ECFDF5] text-[#26734D] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                : 'bg-[#FEF2F2] text-[#A61B1B] border-[#FECACA] hover:bg-[#FEE2E2]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-[#26734D]' : 'bg-[#A61B1B]'}`} />
            <span>API {backendOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={() => setIsAboutOpen(true)}
            className="p-1 text-[#4B4B4B] hover:text-[#111111] hover:bg-[#F1F0EB] border border-[#D8D6D0] transition-colors cursor-pointer"
            title="Ethics & Research Principles"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Ethics & Principles Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        summary={summary}
      />

      {/* System Lineage & Status Modal */}
      {isStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-sans">
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] max-w-lg w-full p-6 space-y-4 text-[#111111] shadow-lg">
            <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-[#A61B1B]" />
                <h3 className="font-serif font-bold text-base text-[#111111]">
                  ANVESHA Backend Status & System Lineage
                </h3>
              </div>
              <button
                onClick={() => setIsStatusOpen(false)}
                className="text-[#777777] hover:text-[#111111] text-xs font-mono cursor-pointer font-bold"
              >
                [ESC] ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 bg-[#F1F0EB] border border-[#D8D6D0]">
                <span className="text-[#777777]">FastAPI Server:</span>
                <span className="text-[#111111] font-bold">http://localhost:8000/api/v1</span>
              </div>

              <div className="flex justify-between p-2.5 bg-[#F1F0EB] border border-[#D8D6D0]">
                <span className="text-[#777777]">Status Code:</span>
                <span className={backendOnline ? 'text-[#26734D] font-bold' : 'text-[#A61B1B] font-bold'}>
                  {backendOnline ? '200 OK — ACTIVE' : 'DISCONNECTED'}
                </span>
              </div>

              <div className="flex justify-between p-2.5 bg-[#F1F0EB] border border-[#D8D6D0]">
                <span className="text-[#777777]">Official Data Track:</span>
                <span className="text-[#111111] font-semibold">2001–2014 NCRB District Observations</span>
              </div>

              <div className="flex justify-between p-2.5 bg-[#F1F0EB] border border-[#D8D6D0]">
                <span className="text-[#777777]">Synthetic Gap-Fill Track:</span>
                <span className="text-[#111111] font-semibold">2015–2023 Statistically Constrained</span>
              </div>

              <div className="flex justify-between p-2.5 bg-[#F1F0EB] border border-[#D8D6D0]">
                <span className="text-[#777777]">Primary Baseline:</span>
                <span className="text-[#111111] font-semibold">T-1 Persistence (MAE 171.50, R² 0.9142)</span>
              </div>
            </div>

            <div className="text-xs text-[#4B4B4B] bg-[#F8F7F3] p-3 border border-[#D8D6D0] leading-relaxed font-sans">
              <div className="font-bold text-[#111111] mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#B7791F]" />
                PROVENANCE PROTECTION GUARANTEE
              </div>
              ANVESHA enforces strict boundary isolation between official observations and synthetic candidate estimates.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsStatusOpen(false)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#A61B1B] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                ACKNOWLEDGE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
