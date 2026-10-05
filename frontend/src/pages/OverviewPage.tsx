import React, { useEffect, useState } from 'react';
import { ArrowRight, LineChart, BookOpen, BarChart3, AlertCircle, FileText } from 'lucide-react';
import { districtApi } from '../services/api';
import type { SummaryData } from '../types';
import { ApiLoadingState, ApiErrorState } from '../components/ui/ApiStateHandlers';
import type { SectionId } from '../components/layout/Sidebar';

interface OverviewPageProps {
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
  onNavigate: (section: SectionId) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  selectedUnit,
  selectedCategory,
  selectedYear,
  onNavigate,
}) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchSummary = () => {
    setLoading(true);
    setError(false);
    districtApi
      .getSummary()
      .then((res) => {
        if (res.data) {
          setSummaryData(res.data);
        }
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching summary:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <ApiLoadingState message="Loading ANVESHA Editorial Research Archive..." />;
  if (error) return <ApiErrorState message="Unable to connect to ANVESHA backend server." onRetry={fetchSummary} />;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Editorial Journal Banner */}
      <div className="border-b-2 border-[#1A1A1A] pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#A61B1B] font-bold tracking-widest uppercase">
              <span>RESEARCH PUBLICATION</span>
              <span>•</span>
              <span>VOL. IV (2001–2023)</span>
              <span>•</span>
              <span className="badge-observed">TRACK A OBSERVED</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-black text-[#111111] tracking-tight leading-tight">
              ANVESHA
            </h1>
            <p className="text-lg md:text-xl font-serif text-[#4B4B4B] italic">
              Evidence-Grounded AI for Spatio-Temporal Crime Intelligence
            </p>

            <p className="text-sm text-[#4B4B4B] leading-relaxed font-sans border-l-2 border-[#A61B1B] pl-4 py-1">
              "Analyze area-level crime patterns, examine statistical changes, connect findings to research evidence, and produce transparent prevention guidance."
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D8D6D0] p-4 text-xs font-mono space-y-2 min-w-[280px]">
            <div className="text-[10px] uppercase text-[#777777] font-bold border-b border-[#D8D6D0] pb-1">
              SYSTEM STATUS & TELEMETRY
            </div>
            <div className="flex justify-between">
              <span className="text-[#777777]">REPORTING UNIT:</span>
              <span className="font-bold text-[#111111]">{selectedUnit.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777777]">CATEGORY:</span>
              <span className="font-bold text-[#111111]">{selectedCategory.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777777]">EVALUATION YEAR:</span>
              <span className="font-bold text-[#A61B1B]">{selectedYear}</span>
            </div>
            <div className="flex justify-between border-t border-[#D8D6D0] pt-1">
              <span className="text-[#777777]">API PIPELINE:</span>
              <span className="text-[#26734D] font-bold">FASTAPI ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Research Metric Blocks */}
      <div>
        <div className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider mb-3">
          KEY RESEARCH METRICS
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="editorial-card p-4">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-[#111111]">
              {summaryData?.police_units_count || 36}
            </div>
            <div className="text-[10px] font-mono font-bold text-[#A61B1B] uppercase tracking-wider mt-1">
              POLICE UNITS
            </div>
            <div className="text-[11px] text-[#4B4B4B] mt-0.5">Tamil Nadu Administrative Districts</div>
          </div>

          <div className="editorial-card p-4">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-[#111111]">
              2001—2023
            </div>
            <div className="text-[10px] font-mono font-bold text-[#26734D] uppercase tracking-wider mt-1">
              VALIDATED OBSERVATIONS
            </div>
            <div className="text-[11px] text-[#4B4B4B] mt-0.5">NCRB Official Longitudinal Series</div>
          </div>

          <div className="editorial-card p-4">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-[#111111]">
              {summaryData?.categories_count || 6}
            </div>
            <div className="text-[10px] font-mono font-bold text-[#A61B1B] uppercase tracking-wider mt-1">
              CRIME CATEGORIES
            </div>
            <div className="text-[11px] text-[#4B4B4B] mt-0.5">IPC Cognizable Crime Heads</div>
          </div>

          <div className="editorial-card p-4">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-[#111111]">
              TRACK A
            </div>
            <div className="text-[10px] font-mono font-bold text-[#2457A6] uppercase tracking-wider mt-1">
              OFFICIAL OBSERVED
            </div>
            <div className="text-[11px] text-[#4B4B4B] mt-0.5">Synthetic Data Isolated</div>
          </div>
        </div>
      </div>

      {/* Main Investigative Report Composition (4 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: WHAT THE DATA SHOWS */}
        <div className="editorial-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#111111]" />
                <span className="font-serif font-bold text-lg text-[#111111]">01. WHAT THE DATA SHOWS</span>
              </div>
              <span className="badge-observed">OBSERVED</span>
            </div>
            <p className="text-xs text-[#4B4B4B] leading-relaxed">
              Examine historical aggregate crime volume trajectories across reporting units. View raw annual FIR incidence counts, year-over-year percentage shifts, and population-adjusted rates without synthetic padding.
            </p>
            <div className="bg-[#F1F0EB] p-3 border border-[#D8D6D0] text-xs font-mono space-y-1">
              <div className="text-[#777777]">CURRENT SELECTION:</div>
              <div className="font-bold text-[#111111]">{selectedUnit.replace(/_/g, ' ')} — {selectedCategory.replace(/_/g, ' ')}</div>
              <div className="text-[#4B4B4B]">Full 2001–2023 validated observation series available for audit.</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('analyze')}
            className="w-full mt-4 py-2 px-3 bg-[#F1F0EB] hover:bg-[#1A1A1A] hover:text-white border border-[#D8D6D0] hover:border-[#1A1A1A] text-xs font-mono font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>INSPECT HISTORICAL DATA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 2: WHAT THE MODEL ESTIMATES */}
        <div className="editorial-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-2">
              <div className="flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-[#A61B1B]" />
                <span className="font-serif font-bold text-lg text-[#111111]">02. WHAT THE MODEL ESTIMATES</span>
              </div>
              <span className="badge-modelled">MODELLED</span>
            </div>
            <p className="text-xs text-[#4B4B4B] leading-relaxed">
              Leakage-safe temporal forecasting and trend direction classification. Benchmarked against T-1 Persistence (MAE 171.50, R² 0.9142) and evaluated via out-of-sample chronological backtesting.
            </p>
            <div className="bg-[#F1F0EB] p-3 border border-[#D8D6D0] text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-[#777777]">FORECAST BASELINE:</span>
                <span className="font-bold text-[#111111]">T-1 PERSISTENCE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">TREND ACCURACY:</span>
                <span className="font-bold text-[#A61B1B]">80.59% (LightGBM V3.4)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('forecast')}
            className="w-full mt-4 py-2 px-3 bg-[#F1F0EB] hover:bg-[#A61B1B] hover:text-white border border-[#D8D6D0] hover:border-[#A61B1B] text-xs font-mono font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>EXPLORE FORECAST & TRENDS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 3: WHAT THE EVIDENCE SAYS */}
        <div className="editorial-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#2457A6]" />
                <span className="font-serif font-bold text-lg text-[#111111]">03. WHAT THE EVIDENCE SAYS</span>
              </div>
              <span className="badge-derived">RESEARCH CORPUS</span>
            </div>
            <p className="text-xs text-[#4B4B4B] leading-relaxed">
              Connect observed quantitative patterns to 4,052 indexed SCRB compendium tables and criminological literature via BGE dense vector semantic search and exact citations.
            </p>
            <div className="bg-[#F1F0EB] p-3 border border-[#D8D6D0] text-xs font-mono space-y-1">
              <div className="text-[#777777]">INDEXED EVIDENCE CORPUS:</div>
              <div className="font-bold text-[#111111]">4,052 Extracted SCRB PDF Tables</div>
              <div className="text-[#4B4B4B]">BGE-M3 Vector Embeddings + Reranker v2-M3</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('evidence')}
            className="w-full mt-4 py-2 px-3 bg-[#F1F0EB] hover:bg-[#2457A6] hover:text-white border border-[#D8D6D0] hover:border-[#2457A6] text-xs font-mono font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>OPEN EVIDENCE ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 4: WHERE UNCERTAINTY REMAINS */}
        <div className="editorial-card p-6 space-y-4 flex flex-col justify-between border-l-4 border-l-[#B7791F]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-[#B7791F]" />
                <span className="font-serif font-bold text-lg text-[#111111]">04. WHERE UNCERTAINTY REMAINS</span>
              </div>
              <span className="badge-synthetic">LIMITATIONS</span>
            </div>
            <p className="text-xs text-[#4B4B4B] leading-relaxed">
              Transparent disclosure of data boundaries. Statistical anomaly flags represent aggregate trajectory outliers and do not state individual culpability or causality.
            </p>
            <div className="bg-[#F8F7F3] p-3 border border-[#D8D6D0] text-xs space-y-1">
              <div className="font-mono font-bold text-[#B7791F] text-[10px] uppercase">ETHICAL GUARANTEE:</div>
              <div className="text-[#111111] font-serif italic text-xs">
                "ANVESHA is a decision-support framework, not an autonomous policing system."
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('data_methods')}
            className="w-full mt-4 py-2 px-3 bg-[#F1F0EB] hover:bg-[#B7791F] hover:text-white border border-[#D8D6D0] hover:border-[#B7791F] text-xs font-mono font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>AUDIT DATA PROVENANCE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Research Methodology & Publication Notice */}
      <div className="editorial-card-strong p-6 bg-[#FFFFFF] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
          <span className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#A61B1B]" />
            SCIENTIFIC REPRODUCIBILITY & IEEE PUBLICATION SYNTHESIS
          </span>
          <span className="font-mono text-[10px] text-[#777777] font-bold">CANONICAL EVALUATION</span>
        </div>
        <p className="text-xs text-[#4B4B4B] leading-relaxed font-sans">
          ANVESHA adheres to strict IEEE research guidelines for spatio-temporal machine learning on public administration datasets. All models are trained with expanding window cross-validation, zero future data leakage, and cryptographic SHA256 dataset tracking.
        </p>
        <div className="flex flex-wrap gap-4 text-xs font-mono pt-2 border-t border-[#D8D6D0]">
          <div><span className="text-[#777777]">FORECAST MAE:</span> <strong className="text-[#111111]">171.50</strong></div>
          <div><span className="text-[#777777]">FORECAST WAPE:</span> <strong className="text-[#111111]">16.58%</strong></div>
          <div><span className="text-[#777777]">TREND ACCURACY:</span> <strong className="text-[#A61B1B]">80.59%</strong></div>
          <div><span className="text-[#777777]">TREND MACRO-F1:</span> <strong className="text-[#111111]">0.6367</strong></div>
        </div>
      </div>
    </div>
  );
};
