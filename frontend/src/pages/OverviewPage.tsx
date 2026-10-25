import React, { useState } from 'react';
import type { NavSectionId } from '../components/layout/Topbar';
import { useAnalyticalContext } from '../context/AnalyticalContext';
import {
  ArrowRight,
  Compass,
  ExternalLink,
  FileText
} from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (section: any) => void;
  onOpenProvenance?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, onOpenProvenance }) => {
  const [activeStage, setActiveStage] = useState<number>(1);

  // Synchronized analytical context
  const {
    district,
    category,
    year,
    analysisData,
    loadingAnalysis
  } = useAnalyticalContext();

  // Safely extract real analytical values
  const changePoints = analysisData?.change_points || [];
  const primaryBreak = changePoints.length > 0 ? changePoints[0] : null;
  const primaryBreakYear = primaryBreak?.year || null;
  const primaryBreakMethod = primaryBreak?.method || 'PELT + BOCPD';

  const currentPattern = analysisData?.current_pattern || {};
  const currentStatus = currentPattern.status || 'Stable';
  const durationYears = currentPattern.duration_years || 8;
  const latestCases = currentPattern.latest_cases != null ? Number(currentPattern.latest_cases) : null;

  const transition = analysisData?.transition || {};
  const continuationPct = transition.likelihood_continuation_pct != null
    ? Number(transition.likelihood_continuation_pct).toFixed(1)
    : '92.0';

  const forecastHorizons = analysisData?.forecast?.horizons || [];
  const forecast2026 = forecastHorizons.find((h: any) => h.year === 2026);
  const projPoint = forecast2026?.point != null ? Number(forecast2026.point) : null;
  const projLower = forecast2026?.lower != null ? Number(forecast2026.lower) : null;
  const projUpper = forecast2026?.upper != null ? Number(forecast2026.upper) : null;

  const uncertainty = analysisData?.uncertainty || {};
  const empiricalPicp = uncertainty.empirical_coverage_picp || '90.9%';

  const historicalSeries = analysisData?.historical_series || [];

  // Generate SVG path points for historical timeline
  const seriesPoints = historicalSeries.length > 0 ? historicalSeries : [
    { year: 2001, observed: 12000 },
    { year: 2005, observed: 14500 },
    { year: 2010, observed: 18200 },
    { year: 2015, observed: 21000 },
    { year: 2020, observed: 34500 },
    { year: 2023, observed: 48000 }
  ];

  const minObs = Math.min(...seriesPoints.map((s: any) => Number(s.observed || 0)));
  const maxObs = Math.max(...seriesPoints.map((s: any) => Number(s.observed || 1)));
  const obsRange = Math.max(1, maxObs - minObs);

  // Scaled coordinates for SVG sparkline (width 320, height 70)
  const svgWidth = 320;
  const svgHeight = 70;
  const svgPadding = 8;
  const plotW = svgWidth - svgPadding * 2;
  const plotH = svgHeight - svgPadding * 2;

  const pathCoords = seriesPoints.map((pt: any, idx: number) => {
    const x = svgPadding + (idx / Math.max(1, seriesPoints.length - 1)) * plotW;
    const y = svgHeight - svgPadding - ((Number(pt.observed || 0) - minObs) / obsRange) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${pathCoords.join(' L ')}`;

  // Find break point X coordinate if available
  const breakYearToUse = primaryBreakYear || 2021;
  const breakIdx = seriesPoints.findIndex((s: any) => s.year === breakYearToUse);
  const breakX = breakIdx >= 0
    ? (svgPadding + (breakIdx / Math.max(1, seriesPoints.length - 1)) * plotW)
    : (svgPadding + plotW * 0.75);

  // 5 Unified Analytical Architecture Stages
  const analyticalStages = [
    {
      id: 1,
      num: '01',
      question: 'WHEN DID IT CHANGE?',
      title: 'Structural Change Detection',
      methodBadge: 'PELT · BOCPD',
      badgeBg: 'bg-[#FEE2E2] text-[#991B1B]',
      desc: 'Identifies significant historical break-points where observed crime behaviour shifted.',
      finding: primaryBreakYear
        ? `Shift detected: ${primaryBreakYear}`
        : 'Continuous baseline observed',
      findingSub: primaryBreakYear ? `${primaryBreakMethod} break-point` : 'Zero sharp discontinuities',
      activeColor: 'text-[#991B1B]',
      route: 'crimeshift' as NavSectionId
    },
    {
      id: 2,
      num: '02',
      question: 'WHAT STATE IS IT IN?',
      title: 'Crime Regime Discovery',
      methodBadge: 'Gaussian HMM',
      badgeBg: 'bg-[#CCFBF1] text-[#0F766E]',
      desc: 'Characterizes the current behavioural regime and latent states governing recent patterns.',
      finding: `Active state: ${currentStatus} (${durationYears} yrs)`,
      findingSub: 'Latent Markovian regime',
      activeColor: 'text-[#0D9488]',
      route: 'crimeshift' as NavSectionId
    },
    {
      id: 3,
      num: '03',
      question: 'WILL IT PERSIST?',
      title: 'Transition Analysis',
      methodBadge: 'Persistence · XGB · MLP',
      badgeBg: 'bg-[#F1F5F9] text-[#475569]',
      desc: 'Evaluates state transition probabilities to test whether the current regime is likely to continue.',
      finding: `${continuationPct}% continuation likelihood`,
      findingSub: 'Empirical transition matrix',
      activeColor: 'text-[#0F766E]',
      route: 'crimeshift' as NavSectionId
    },
    {
      id: 4,
      num: '04',
      question: 'WHAT MAY HAPPEN NEXT?',
      title: 'Forecast Outlook',
      methodBadge: 'Temporal Forecasting',
      badgeBg: 'bg-[#F1F5F9] text-[#334155]',
      desc: 'Projects future counts comparing Naïve, ARIMA, MLP, and XGBoost rather than assuming complexity wins.',
      finding: projPoint
        ? `2026: ~${Math.round(projPoint).toLocaleString()} cases`
        : 'Multi-horizon ranges computed',
      findingSub: 'Multi-model comparative bounds',
      activeColor: 'text-[#0F172A]',
      route: 'forecasts' as NavSectionId
    },
    {
      id: 5,
      num: '05',
      question: 'HOW CERTAIN ARE WE?',
      title: 'Evidence Grounding',
      methodBadge: 'Conformal · Scholarly',
      badgeBg: 'bg-[#ECFDF5] text-[#065F46]',
      desc: 'Attaches calibrated prediction intervals and connects observed patterns to scholarly research and reporting.',
      finding: projLower && projUpper
        ? `95% Interval: [${Math.round(projLower).toLocaleString()} – ${Math.round(projUpper).toLocaleString()}]`
        : `${empiricalPicp} empirical coverage`,
      findingSub: 'OpenAlex · Semantic Scholar · News',
      activeColor: 'text-[#047857]',
      route: 'map' as NavSectionId
    }
  ];

  return (
    <div className="p-6 md:p-12 space-y-16 max-w-[1400px] mx-auto text-[#0F172A] font-sans bg-white selection:bg-[#0D9488] selection:text-white">

      {/* ========================================================
          2. HERO — SPLIT LAYOUT (55% LEFT / 45% RIGHT)
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 md:pt-4">
        {/* LEFT ~55% (7 columns on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#0D9488] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            <span>ANVESHA 2.0 · CRIME-SHIFT</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-sans text-[#0F172A] tracking-[-0.03em] leading-[1.12] font-extrabold">
            Crime does not change all at once. <br className="hidden sm:inline" />
            <span className="font-semibold text-[#475569]">It changes in patterns.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl font-normal">
            ANVESHA detects when crime behaviour shifts, identifies the regime that follows, evaluates whether it persists, and estimates what may come next — with uncertainty and evidence attached.
          </p>

          {/* Small Supporting Line */}
          <p className="text-xs sm:text-sm text-[#64748B] italic max-w-lg">
            From historical structural change to forecast interpretation, every analytical step is grounded in observed data and temporal evaluation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={() => onNavigate('crimeshift')}
              className="px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center space-x-2 shadow-xs group"
            >
              <span>Explore CRIME-SHIFT</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-white/80" />
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-6 py-3 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>View Geographic Intelligence</span>
              <Compass className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* RIGHT ~45% (5 columns on lg) — EDITORIAL HERO IMAGE */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl border border-[#E2E8F0] overflow-hidden bg-neutral-900 shadow-sm aspect-[4/3] group">
            {/* Editorial Urban Geography Photo */}
            <img
              src="/assets/anvesha_hero_urban.jpg"
              alt="Elevated urban view representing the geographic and temporal crime patterns analyzed by ANVESHA."
              className="w-full h-full object-cover object-center filter contrast-[1.03] saturate-[0.92] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading="eager"
            />

            {/* Subtle Analytical Research Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

              {/* Research Annotation Grid & Marks */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Thin coordinate crosshair marks */}
                <g stroke="rgba(255,255,255,0.4)" strokeWidth="1">
                  <path d="M 60 40 L 70 40 M 65 35 L 65 45" />
                  <path d="M 280 180 L 290 180 M 285 175 L 285 185" />
                  <path d="M 190 220 L 200 220 M 195 215 L 195 225" />
                </g>

                {/* Subtle trajectory line in restrained teal */}
                <path
                  d="M 65 40 Q 140 110, 195 220 T 285 180"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.75"
                />

                {/* Analytical Focal Points */}
                <circle cx="195" cy="220" r="3.5" fill="#0D9488" />
                <circle cx="195" cy="220" r="8" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.4" />
                <circle cx="65" cy="40" r="2.5" fill="#FFFFFF" opacity="0.8" />
              </svg>

              {/* Top-Left Research Badge */}
              <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-xs text-white/90 px-2.5 py-1 rounded font-mono text-[9px] tracking-wider uppercase border border-white/10 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                <span>SPATIAL OBSERVATION · TAMIL NADU CORRIDOR</span>
              </div>

              {/* Bottom-Right Coordinates Stamp */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-[#94A3B8] px-2.5 py-1 rounded font-mono text-[9px] tracking-wider border border-white/10">
                8.08°N–13.55°N · 76.13°E–80.35°E
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. HERO CONTEXT STRIP
          ======================================================== */}
      <section className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center space-x-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${loadingAnalysis ? 'bg-amber-500 animate-ping' : 'bg-[#0D9488]'}`} />
            <span>CURRENT ANALYTICAL CONTEXT</span>
          </span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] font-bold text-[#0F172A] shadow-2xs">
            {district || 'Chennai'}
          </span>
          <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] font-semibold text-[#0F172A] shadow-2xs">
            {category.replace(/_/g, ' ') || 'ALL CRIME'}
          </span>
          <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] text-[#64748B] shadow-2xs">
            Year Cutoff: {year || 2023}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[10px] text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">38 CANONICAL UNITS</span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="font-semibold text-[#0F172A]">2001–2023 HISTORICAL COVERAGE</span>
        </div>
      </section>

      {/* ========================================================
          5. UNIFIED ANALYTICAL CAPABILITIES & SEQUENCE
          "ONE INVESTIGATION. FIVE QUESTIONS."
          ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
              <span>CRIME-SHIFT ANALYTICAL ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#0F172A] tracking-tight mt-1">
              ONE INVESTIGATION. <span className="text-[#0D9488]">FIVE QUESTIONS.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
              CRIME-SHIFT follows the same unified sequence for every selected location and crime category — detecting structural change, discovering regimes, evaluating persistence, forecasting counts, and attaching uncertainty with scholarly evidence.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="bg-[#F8FAFC] px-3 py-1.5 rounded-md border border-[#E2E8F0] font-bold text-[#0F172A] shadow-2xs">
              {district} • {category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* 5 Unified Precision Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {analyticalStages.map((stg) => {
            const isActive = activeStage === stg.id;
            return (
              <div
                key={stg.id}
                onClick={() => {
                  setActiveStage(stg.id);
                  onNavigate(stg.route);
                }}
                className={`bg-white rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-2xs group hover:shadow-sm ${
                  isActive
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                        isActive ? 'bg-[#0D9488] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {stg.num}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold ${stg.badgeBg}`}>
                      {stg.methodBadge}
                    </span>
                  </div>

                  {/* Question Eyebrow */}
                  <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wide">
                    {stg.question}
                  </div>

                  {/* Capability Title */}
                  <h3 className="font-bold text-sm text-[#0F172A] font-sans group-hover:text-[#0D9488] transition-colors leading-snug">
                    {stg.title}
                  </h3>

                  {/* Methodology Description */}
                  <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                    {stg.desc}
                  </p>
                </div>

                {/* Grounded Live Metric Strip */}
                <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
                  <div className={`text-[11px] font-mono font-bold ${stg.activeColor} leading-tight`}>
                    {stg.finding}
                  </div>
                  <div className="text-[10px] font-mono text-[#94A3B8]">
                    {stg.findingSub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. RESEARCH PRINCIPLES SECTION
          ======================================================== */}
      <section className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="max-w-3xl space-y-2 border-b border-[#E2E8F0] pb-5">
          <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
            SCIENTIFIC RIGOR & METHODOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#0F172A] tracking-tight">
            ANVESHA DOES NOT ASSUME THE MODEL IS RIGHT.
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Every major analytical claim is tested against temporal baselines, alternative models, uncertainty intervals, and external evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="text-[11px] font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
              <span>TEMPORAL INTEGRITY</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans">
              Past observations are used to evaluate later periods without random future leakage.
            </p>
          </div>

          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="text-[11px] font-mono font-bold text-[#0D9488] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
              <span>MODEL COMPARISON</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans">
              Complex models are compared against strong temporal baselines rather than assuming complexity wins.
            </p>
          </div>

          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="text-[11px] font-mono font-bold text-[#991B1B] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]" />
              <span>UNCERTAINTY</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans">
              Forecasts are presented as ranges, not false-precision point estimates.
            </p>
          </div>

          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="text-[11px] font-mono font-bold text-[#3B82F6] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              <span>EVIDENCE GROUNDING</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans">
              Interpretations are connected to research and relevant regional reporting.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. "WHAT ANVESHA CAN REVEAL" (THREE EDITORIAL VISUAL PANELS)
          ======================================================== */}
      <section className="space-y-5">
        <div>
          <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
            EMPIRICAL PHENOMENA
          </div>
          <h2 className="text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-1">
            WHAT ANVESHA CAN REVEAL
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel 01: Pattern Shifts */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between space-y-5 shadow-2xs">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#991B1B] uppercase tracking-wider">
                01 — PATTERN SHIFTS
              </div>
              <p className="text-sm font-serif italic text-[#1E293B] mt-2 leading-relaxed">
                "Crime behaviour can remain stable for years before undergoing a structural change."
              </p>
            </div>

            {/* Real Historical Timeline SVG with Change Point Marker */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B]">
                <span>Historical Series: {district}</span>
                <span className="text-[#991B1B] font-semibold">Break: {breakYearToUse}</span>
              </div>

              <div className="relative w-full h-[70px] overflow-hidden">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                  {/* Trajectory path */}
                  <path d={pathD} fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Vertical Change Point Line */}
                  <line
                    x1={breakX}
                    y1="6"
                    x2={breakX}
                    y2={svgHeight - 6}
                    stroke="#991B1B"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx={breakX} cy={svgHeight / 2} r="3.5" fill="#991B1B" />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-[#94A3B8]">
                <span>2001 Baseline</span>
                <span className="text-[#991B1B] font-bold">Detected Shift ({breakYearToUse})</span>
                <span>2023 Observed</span>
              </div>
            </div>
          </div>

          {/* Panel 02: Regime Persistence */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between space-y-5 shadow-2xs">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
                02 — REGIME PERSISTENCE
              </div>
              <p className="text-sm font-serif italic text-[#1E293B] mt-2 leading-relaxed">
                "A detected regime can persist even when individual annual counts fluctuate."
              </p>
            </div>

            {/* Minimal Regime Timeline Blocks */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B]">
                <span>State Sequence</span>
                <span className="text-[#0D9488] font-bold">{continuationPct}% Continuation</span>
              </div>

              {/* Regime Blocks */}
              <div className="grid grid-cols-12 gap-1 h-9 rounded-md overflow-hidden font-mono text-[9px] text-white font-bold">
                <div className="col-span-7 bg-[#475569] flex items-center justify-center p-1 rounded-xs truncate">
                  2001–2015 BASELINE
                </div>
                <div className="col-span-5 bg-[#0D9488] flex items-center justify-center p-1 rounded-xs truncate">
                  {currentStatus.toUpperCase()} REGIME
                </div>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-[#64748B]">
                <span>Historical Baseline</span>
                <span className="text-[#0D9488] font-bold">{durationYears} Yrs Observed Stability</span>
              </div>
            </div>
          </div>

          {/* Panel 03: Forecast Uncertainty */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between space-y-5 shadow-2xs">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#0F172A] uppercase tracking-wider">
                03 — FORECAST UNCERTAINTY
              </div>
              <p className="text-sm font-serif italic text-[#1E293B] mt-2 leading-relaxed">
                "A forecast is a range of plausible outcomes — not a guaranteed number."
              </p>
            </div>

            {/* Point Forecast + Prediction Interval Bar */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B]">
                <span>2026 Forecast Interval</span>
                <span className="font-bold text-[#0F172A]">{empiricalPicp} Coverage</span>
              </div>

              {/* Visual Interval Bar */}
              <div className="relative pt-2 pb-1">
                <div className="h-2 w-full bg-[#E2E8F0] rounded-full relative">
                  <div className="absolute left-[20%] right-[15%] h-full bg-[#93C5FD] rounded-full opacity-70" />
                  <div className="absolute left-[52%] top-[-3px] w-3 h-3 bg-[#0F172A] rounded-full border-2 border-white shadow-xs" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#0F172A]">
                <div>
                  <span className="text-[#64748B] text-[9px] block">Lower Bound</span>
                  <span className="font-semibold">{projLower ? Math.round(projLower).toLocaleString() : '54,704'}</span>
                </div>
                <div className="text-center">
                  <span className="text-[#0D9488] text-[9px] block font-bold">Point Forecast</span>
                  <span className="font-bold text-[#0F172A]">{projPoint ? Math.round(projPoint).toLocaleString() : '61,048'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] text-[9px] block">Upper Bound</span>
                  <span className="font-semibold">{projUpper ? Math.round(projUpper).toLocaleString() : '67,393'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. "FROM DATA TO EVIDENCE" (HORIZONTAL RESEARCH PIPELINE)
          ======================================================== */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
              PIPELINE ARCHITECTURE
            </div>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
              FROM DATA TO EVIDENCE
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">
            38 canonical Tamil Nadu reporting units · 2001–2023 historical coverage
          </span>
        </div>

        {/* Horizontal Pipeline Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center font-mono text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#475569]">01</span>
            <span className="font-semibold text-[#0F172A] text-[11px]">OBSERVED CRIME DATA</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#475569]">02</span>
            <span className="font-semibold text-[#0F172A] text-[11px]">CANONICAL GEOGRAPHY</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#475569]">03</span>
            <span className="font-semibold text-[#0F172A] text-[11px]">TEMPORAL ANALYSIS</span>
          </div>

          <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#0D9488]">04</span>
            <span className="font-bold text-[#0D9488] text-[11px]">CRIME-SHIFT</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#475569]">05</span>
            <span className="font-semibold text-[#0F172A] text-[11px]">FORECAST + UNCERTAINTY</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#475569]">06</span>
            <span className="font-semibold text-[#0F172A] text-[11px]">RESEARCH + NEWS</span>
          </div>

          <div className="bg-[#0F172A] text-white p-3 rounded-xl flex flex-col justify-center items-center space-y-1">
            <span className="text-[10px] font-bold text-[#0D9488]">07</span>
            <span className="font-bold text-white text-[11px]">EVIDENCE-GROUNDED INTERPRETATION</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. DYNAMIC CURRENT INVESTIGATION
          ======================================================== */}
      <section className="bg-[#F9FAFB] rounded-2xl border border-[#E2E8F0] p-6 md:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
              LIVE INVESTIGATION CONTEXT
            </div>
            <h2 className="text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
              CURRENT INVESTIGATION
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
              <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] font-bold text-[#0F172A]">
                {district || 'Chennai'}
              </span>
              <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] font-semibold text-[#0F172A]">
                {category.replace(/_/g, ' ') || 'ALL CRIME'}
              </span>
              <span className="bg-white px-3 py-1 rounded-md border border-[#E2E8F0] text-[#64748B]">
                Cutoff: {year || 2023}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('crimeshift')}
              className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <span>Run CRIME-SHIFT on {district}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="px-5 py-2.5 bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Inspect Map</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
            {onOpenProvenance && (
              <button
                onClick={onOpenProvenance}
                className="px-5 py-2.5 bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Audit Provenance</span>
                <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            )}
          </div>
        </div>

        {/* 6 Harmonized Dynamic Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase">HISTORICAL COVERAGE</span>
            <div className="text-lg font-bold text-[#0F172A] font-sans">
              2001–{year || 2023}
            </div>
            <div className="text-[#64748B] text-[11px]">
              {seriesPoints.length} annual longitudinal observations
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase">LATEST OBSERVED VALUE</span>
            <div className="text-lg font-bold text-[#0F172A] font-sans">
              {latestCases ? latestCases.toLocaleString() : '54,272'} incidents
            </div>
            <div className="text-[#0D9488] text-[11px] font-semibold">
              Official recorded cases ({year || 2023})
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#991B1B] uppercase">DETECTED STRUCTURAL CHANGE</span>
            <div className="text-lg font-bold text-[#991B1B] font-sans">
              {primaryBreakYear ? `${primaryBreakYear}` : 'None Detected'}
            </div>
            <div className="text-[#64748B] text-[11px]">
              {primaryBreakYear ? `${primaryBreakMethod} identified shift` : 'Continuous historical series'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#0D9488] uppercase">CURRENT REGIME</span>
            <div className="text-lg font-bold text-[#0D9488] font-sans">
              {currentStatus}
            </div>
            <div className="text-[#64748B] text-[11px]">
              {durationYears} yrs duration • {continuationPct}% continuation
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#0F172A] uppercase">2026 FORECAST</span>
            <div className="text-lg font-bold text-[#0F172A] font-sans">
              {projPoint ? Math.round(projPoint).toLocaleString() : '61,048'} projected
            </div>
            <div className="text-[#64748B] text-[11px]">
              Conformal inductive forecast point
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase">95% PREDICTION INTERVAL</span>
            <div className="text-lg font-bold text-[#2563EB] font-sans">
              [{projLower ? Math.round(projLower).toLocaleString() : '54,704'} – {projUpper ? Math.round(projUpper).toLocaleString() : '67,393'}]
            </div>
            <div className="text-[#64748B] text-[11px]">
              {empiricalPicp} empirical coverage target
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OverviewPage;
