import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  FileText,
  Newspaper,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
} from 'lucide-react';
import { briefingApi } from '../../services/api';
import type { DistrictBriefingResponse } from '../../types';

interface DistrictIntelligenceBriefingProps {
  district: string;
  category: string;
  year: number;
}

export const DistrictIntelligenceBriefing: React.FC<DistrictIntelligenceBriefingProps> = ({
  district,
  category,
  year,
}) => {
  const [briefing, setBriefing] = useState<DistrictBriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLimitationsExpanded, setIsLimitationsExpanded] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] = useState<string | null>(null);

  // Request cancellation and sequence ID guard to prevent stale out-of-order responses
  const currentReqId = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    currentReqId.current += 1;
    const reqId = currentReqId.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    briefingApi
      .getDistrictBriefing(
        {
          district,
          category,
          year,
        },
        controller.signal
      )
      .then((res) => {
        if (reqId === currentReqId.current) {
          setBriefing(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (reqId === currentReqId.current) {
          setError(err.message || 'Failed to generate district intelligence briefing.');
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [district, category, year]);

  const ctx = briefing?.context;
  const obs = briefing?.observed_pattern;
  const comp = briefing?.historical_comparison;
  const news = briefing?.local_news;
  const research = briefing?.research_evidence;
  const interp = briefing?.interpretation;
  const safety = briefing?.safety_guidance;
  const quality = briefing?.evidence_quality;

  const coverageBadgeColor = (rating?: string) => {
    switch (rating) {
      case 'Strong evidence':
        return 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
      case 'Limited evidence':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
    }
  };

  const trendIcon = (trend?: string) => {
    switch (trend) {
      case 'INCREASING':
        return <TrendingUp className="w-3.5 h-3.5 text-[#DC2626]" />;
      case 'DECREASING':
        return <TrendingDown className="w-3.5 h-3.5 text-[#16A34A]" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-[#64748B]" />;
    }
  };

  return (
    <section className="bg-white border-t border-[#E2E8F0] pt-10 pb-16 font-sans text-[#0F172A]">
      {/* SECTION HEADER & CONTEXT PILL BAR */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0D9488] uppercase">
              DISTRICT INTELLIGENCE BRIEFING
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#0F172A] tracking-tight mt-1">
              Evidence Dossier: {district}
            </h2>
            <p className="text-sm text-[#475569] font-sans mt-1 max-w-3xl leading-relaxed">
              Understand the observed pattern, examine relevant evidence, and distinguish documented facts from possible explanations.
            </p>
          </div>

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-[#0D9488] bg-[#F0FDFA] px-3 py-1.5 rounded-full border border-[#CCFBF1] self-start md:self-auto animate-pulse">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing multi-source evidence...</span>
            </div>
          )}
        </div>

        {/* CONTEXT AUDIT METADATA PILL BAR */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#334155]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-2xs">
              <MapPin className="w-3 h-3 text-[#0D9488]" />
              <strong className="text-[#0F172A]">{district}</strong>
              <span className="text-[#64748B]">({ctx?.state_ut || 'Tamil Nadu'})</span>
            </span>

            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-2xs">
              <FileText className="w-3 h-3 text-[#0D9488]" />
              <span className="text-[#64748B]">CATEGORY:</span>
              <strong className="text-[#0F172A]">{ctx?.category_label || category.replace('_', ' ')}</strong>
            </span>

            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-2xs">
              <Clock className="w-3 h-3 text-[#0D9488]" />
              <span className="text-[#64748B]">CUTOFF YEAR:</span>
              <strong className="text-[#0F172A]">{year}</strong>
            </span>

            {ctx?.population_lakhs != null && (
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-2xs">
                <span className="text-[#64748B]">POPULATION:</span>
                <strong className="text-[#0F172A]">{ctx.population_lakhs} Lakhs</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${coverageBadgeColor(
                quality?.overall_rating
              )}`}
            >
              {quality?.overall_rating || 'Assessing'}
            </span>
            <span className="text-[10px] text-[#94A3B8] hidden sm:inline">
              Retrieved: {ctx?.last_retrieved ? new Date(ctx.last_retrieved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#991B1B] flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* EDITORIAL GRID LAYOUT */}
      <div className="space-y-10">
        {/* ========================================================================= */}
        {/* SECTION A — THE OBSERVED PATTERN */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
                SECTION A
              </div>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
                The Observed Pattern
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#64748B]">STATUS:</span>
              <span className="bg-[#F1F5F9] text-[#334155] px-2.5 py-0.5 rounded font-bold">
                {obs?.data_status || 'Validated Official Records'}
              </span>
            </div>
          </div>

          {obs?.is_missing ? (
            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-2">
              <AlertTriangle className="w-6 h-6 text-[#94A3B8] mx-auto" />
              <p className="text-sm font-semibold text-[#0F172A]">
                No validated observation is available for this context.
              </p>
              <p className="text-xs text-[#64748B] max-w-lg mx-auto">
                {obs.missing_reason || `No historical records were indexed for ${district} under ${category} up to ${year}.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* PRIMARY STATISTICAL SUMMARY TILES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* LATEST COUNT */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">
                    OBSERVED COUNT ({obs?.latest_year})
                  </div>
                  <div className="text-2xl font-sans font-bold text-[#0F172A]">
                    {obs?.latest_count != null ? obs.latest_count.toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono">
                    Like-for-like {ctx?.category_label}
                  </div>
                </div>

                {/* CRIME RATE (%) */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">
                    DISTRICT CRIME RATE (%)
                  </div>
                  <div className="text-2xl font-sans font-bold text-[#0D9488]">
                    {obs?.crime_rate_pct != null ? `${obs.crime_rate_pct.toFixed(2)}%` : 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono">
                    Per {ctx?.population_lakhs} Lakhs population
                  </div>
                </div>

                {/* YOY CHANGE */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">
                    PREVIOUS YEAR COMPARISON
                  </div>
                  <div className="text-2xl font-sans font-bold text-[#0F172A] flex items-center gap-1.5">
                    {comp?.pct_change != null ? (
                      <>
                        <span className={comp.pct_change > 0 ? 'text-[#DC2626]' : comp.pct_change < 0 ? 'text-[#16A34A]' : 'text-[#64748B]'}>
                          {comp.pct_change > 0 ? `+${comp.pct_change}%` : `${comp.pct_change}%`}
                        </span>
                        {trendIcon(comp.long_term_trend)}
                      </>
                    ) : (
                      <span className="text-sm font-sans font-normal text-[#64748B]">N/A</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono">
                    {comp?.prev_year ? `${obs?.latest_year} vs ${comp.prev_year}` : 'Single year observation'}
                  </div>
                </div>

                {/* STRUCTURAL CHANGE POINT & REGIME */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">
                    REGIME & PELT BREAK
                  </div>
                  <div className="text-base font-bold text-[#0F172A] truncate">
                    {obs?.current_regime || 'Stable'}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono">
                    Break: {obs?.detected_change_point_year || 'None'} ({obs?.change_point_confidence_pct || 80}% conf.)
                  </div>
                </div>
              </div>

              {/* DETAILED NARRATIVE COMPARISON */}
              <div className="p-4 bg-[#F8FAFC] border-l-4 border-[#0D9488] rounded-r-xl text-xs leading-relaxed text-[#334155] space-y-2">
                <p>
                  <strong>Validated Trajectory Analysis:</strong> {comp?.comparison_note}
                </p>
                {obs?.formula && (
                  <p className="text-[11px] text-[#64748B] font-mono">
                    Mathematical Baseline: {obs.formula}
                  </p>
                )}
                {obs?.reporting_notes && obs.reporting_notes.length > 0 && (
                  <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#B45309] font-mono">
                    {obs.reporting_notes.map((note, idx) => (
                      <p key={idx}>⚠️ {note}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* COMPACT SVG TRAJECTORY CHART */}
              {obs?.trajectory && obs.trajectory.length >= 3 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#64748B]">
                    <span>HISTORICAL OBSERVATION TRAJECTORY (LIKE-FOR-LIKE {ctx?.category_label})</span>
                    <span>2001 — {obs.latest_year}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                    {(() => {
                      const data = obs.trajectory;
                      const counts = data.map((d) => d.count);
                      const minCount = Math.min(...counts);
                      const maxCount = Math.max(...counts, 1);
                      const range = maxCount - minCount || 1;
                      const height = 120;
                      const width = 640;
                      const padding = 20;

                      const points = data.map((d, i) => {
                        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
                        const y = height - padding - ((d.count - minCount) / range) * (height - 2 * padding);
                        return { x, y, ...d };
                      });

                      const pathStr = points.reduce(
                        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                        ''
                      );

                      return (
                        <div className="w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
                            {/* Gridlines */}
                            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E2E8F0" strokeDasharray="3 3" />
                            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#E2E8F0" strokeDasharray="3 3" />
                            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E2E8F0" />

                            {/* Path */}
                            <path d={pathStr} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />

                            {/* Change point highlight */}
                            {obs.detected_change_point_year &&
                              points.map((p) => {
                                if (p.year === obs.detected_change_point_year) {
                                  return (
                                    <g key={`cp-${p.year}`}>
                                      <line x1={p.x} y1={padding} x2={p.x} y2={height - padding} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
                                      <circle cx={p.x} cy={p.y} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                                      <text x={p.x} y={padding - 4} fontSize="9" textAnchor="middle" fill="#B45309" fontFamily="monospace">
                                        PELT Break ({p.year})
                                      </text>
                                    </g>
                                  );
                                }
                                return null;
                              })}

                            {/* Data points */}
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={i === points.length - 1 ? 4.5 : 2.5}
                                  fill={i === points.length - 1 ? '#0F766E' : '#0D9488'}
                                  stroke="#FFFFFF"
                                  strokeWidth="1.5"
                                />
                                {(i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) && (
                                  <text x={p.x} y={height - 4} fontSize="9" textAnchor="middle" fill="#64748B" fontFamily="monospace">
                                    {p.year}
                                  </text>
                                )}
                              </g>
                            ))}
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION B — LOCAL DEVELOPMENTS & REPORTED INCIDENTS */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
                SECTION B
              </div>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
                Local Developments & Reported Incidents
              </h3>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              Historical Cutoff: &le; {year}
            </div>
          </div>

          {/* LOCAL ARTICLES FEED */}
          <div className="space-y-4">
            {news?.has_local && news.local_articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.local_articles.map((art, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#CBD5E1] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857]">
                          {art.scope || 'LOCAL NEWS'}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
                          {art.stage || 'Investigation'}
                        </span>
                      </div>

                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-sm text-[#0F172A] hover:text-[#0D9488] line-clamp-2 leading-snug flex items-start justify-between gap-1 group"
                      >
                        <span>{art.headline}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>

                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                        {art.factual_summary || art.description}
                      </p>

                      {art.why_relevant && (
                        <p className="text-[11px] text-[#64748B] italic border-l-2 border-[#0D9488] pl-2 line-clamp-2">
                          {art.why_relevant}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono pt-2 border-t border-[#E2E8F0]">
                      <span className="truncate max-w-[140px]">{art.publisher}</span>
                      <span>{art.published_at ? art.published_at.slice(0, 10) : 'Archive'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] italic space-y-1">
                <p className="font-semibold text-[#0F172A] not-italic">
                  No sufficiently relevant local reporting was found for this selection.
                </p>
                <p>
                  Search filtered for local reporting on {category.replace('_', ' ').toLowerCase()} in {district} on or prior to cutoff year {year}. The absence of indexed media reporting does not indicate absence of crime.
                </p>
              </div>
            )}

            {/* REGIONAL CONTEXT SUBSECTION */}
            {news?.regional_articles && news.regional_articles.length > 0 && (
              <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>REGIONAL LAW ENFORCEMENT CONTEXT (TAMIL NADU / UT)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {news.regional_articles.slice(0, 2).map((art, idx) => (
                    <div
                      key={`reg-${idx}`}
                      className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-1.5 text-xs text-[#334155]"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B]">
                        <span className="bg-[#F1F5F9] px-2 py-0.5 rounded text-[#475569]">REGIONAL CONTEXT</span>
                        <span>{art.published_at ? art.published_at.slice(0, 10) : 'Recent'}</span>
                      </div>
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#0F172A] hover:text-[#0D9488] line-clamp-1 block"
                      >
                        {art.headline}
                      </a>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                        {art.factual_summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION C — WHAT THE RESEARCH SAYS */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
                SECTION C
              </div>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
                What the Research Says
              </h3>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              OpenAlex • Crossref • Semantic Scholar • Criminological Panel
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {research?.studies && research.studies.length > 0 ? (
              research.studies.map((study, idx) => (
                <div
                  key={idx}
                  id={`ref-${study.citation_index.replace(/[\[\]]/g, '')}`}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    activeCitation === study.citation_index
                      ? 'bg-[#F0FDFA] border-[#0D9488] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold text-[#0D9488]">
                        {study.citation_index}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[#475569]">
                        {study.geographic_scope}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-base text-[#0F172A] leading-snug line-clamp-2">
                      {study.title}
                    </h4>

                    <p className="text-[11px] font-mono text-[#64748B]">
                      {study.authors} • {study.year} • {study.venue}
                    </p>

                    <div className="text-xs text-[#334155] leading-relaxed pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#0D9488] block">KEY FINDING</span>
                      <p className="line-clamp-3">{study.key_finding}</p>
                    </div>

                    {study.applicability && (
                      <p className="text-[11px] text-[#64748B] italic border-l-2 border-[#0D9488] pl-2 line-clamp-2">
                        {study.applicability}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#94A3B8] text-[10px] truncate max-w-[160px]">{study.research_method}</span>
                    {study.doi ? (
                      <a
                        href={study.url || `https://doi.org/${study.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0D9488] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#94A3B8]">Compendium</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-xs text-[#64748B] italic p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                Metadata available; scholarly literature synthesis in progress.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION D — EVIDENCE-BASED INTERPRETATION (3-LEVEL SYNTHESIS) */}
        {/* ========================================================================= */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="pb-4 border-b border-[#E2E8F0]">
            <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
              SECTION D
            </div>
            <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
              What the Evidence Suggests
            </h3>
            <p className="text-xs text-[#64748B] font-sans mt-0.5">
              Multi-level synthesis separating documented facts from criminological explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* LEVEL 1: OBSERVED */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3 shadow-2xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#F1F5F9]">
                <FileText className="w-4 h-4 text-[#0D9488]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  1. OBSERVED
                </span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                {interp?.observed || 'Validated statistical series establishing official historical counts.'}
              </p>
            </div>

            {/* LEVEL 2: REPORTED */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3 shadow-2xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#F1F5F9]">
                <Newspaper className="w-4 h-4 text-[#0D9488]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  2. REPORTED
                </span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                {interp?.reported || 'Contemporaneous news reporting and public notices.'}
              </p>
            </div>

            {/* LEVEL 3: INTERPRETATION */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3 shadow-2xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#F1F5F9]">
                <BookOpen className="w-4 h-4 text-[#0D9488]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  3. INTERPRETATION
                </span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                {interp?.interpretation ? (
                  // Highlight inline citations [1], [2], [3]
                  interp.interpretation.split(/(\[\d+\])/g).map((part, idx) => {
                    if (/^\[\d+\]$/.test(part)) {
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveCitation(part);
                            const el = document.getElementById(`ref-${part.replace(/[\[\]]/g, '')}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="font-mono font-bold text-[#0D9488] bg-[#F0FDFA] hover:bg-[#CCFBF1] px-1 py-0.2 rounded cursor-pointer mx-0.5 inline-block"
                          title={`Jump to study ${part}`}
                        >
                          {part}
                        </button>
                      );
                    }
                    return part;
                  })
                ) : (
                  'Criminological literature factors explaining observed variance.'
                )}
              </p>
            </div>
          </div>

          {/* CAUTIONARY EMPIRICAL NOTES */}
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] space-y-1 font-mono">
            <p>
              ⚠️ <strong>Causality Caveat:</strong> {interp?.unsupported_causality_warning}
            </p>
            <p>
              ℹ️ <strong>Reporting Bias:</strong> {interp?.conflicting_evidence_note}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION E — PUBLIC-SAFETY INFORMATION */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
                SECTION E
              </div>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] tracking-tight mt-0.5">
                Public-Safety Information
              </h3>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              Verified Police & Statutory Helplines
            </div>
          </div>

          {/* LOCAL PRECINCT & EMERGENCY CONTACTS CARD */}
          {safety?.local_contact && (
            <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#0D9488]" />
                  <h4 className="font-bold text-sm text-[#0F172A]">{safety.local_contact.unit}</h4>
                </div>
                <p className="text-xs text-[#64748B]">{safety.local_contact.address}</p>
                <p className="text-xs font-mono text-[#334155]">
                  Control Room: <strong className="text-[#0F172A]">{safety.local_contact.control_room}</strong> • Emergency:{' '}
                  <strong className="text-[#DC2626]">{safety.local_contact.emergency}</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={safety.local_contact.portal}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5"
                >
                  <span>CCTNS Citizen Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* SPECIFIC ADVISORIES */}
          <div className="space-y-4">
            {safety?.district_specific && safety.district_specific.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488]">
                  VERIFIED ADVISORIES FOR {district.toUpperCase()} ({ctx?.category_label.toUpperCase()})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safety.district_specific.map((adv, idx) => (
                    <div key={idx} className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2 text-xs">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-[#0F172A] leading-snug">{adv.guidance}</p>
                          <p className="text-[#64748B] leading-relaxed">{adv.relevance}</p>
                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono pt-1">
                            <span>Source: {adv.source}</span>
                            <span>Verified: {adv.verified_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GENERAL GUIDANCE SECTION */}
            {safety?.general_guidance && safety.general_guidance.length > 0 && (
              <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                  {safety.general_disclaimer || 'General guidance — not a district-specific risk assessment.'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {safety.general_guidance.map((g, idx) => (
                    <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                      <p className="font-medium text-[#334155]">{g.guidance}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                        <span>{g.source}</span>
                        <span>{g.verified_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION F — EVIDENCE QUALITY & LIMITATIONS (EXPANDABLE) */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
          <button
            onClick={() => setIsLimitationsExpanded(!isLimitationsExpanded)}
            className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold tracking-wider text-[#0D9488] uppercase">
                SECTION F
              </div>
              <h3 className="text-xl font-sans font-bold text-[#0F172A] tracking-tight">
                Evidence Quality & Limitations
              </h3>
              <p className="text-xs text-[#64748B] font-sans">
                Audit assessment: <strong className="text-[#0F172A]">{quality?.overall_rating || 'Assessed'}</strong> ({quality?.score_points || 0} evaluation points)
              </p>
            </div>
            <div className="p-2 rounded-full bg-[#F1F5F9] text-[#64748B]">
              {isLimitationsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {isLimitationsExpanded && (
            <div className="px-6 md:px-8 pb-8 pt-2 border-t border-[#F1F5F9] space-y-6 text-xs text-[#334155]">
              {/* CRITERIA BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    1. OFFICIAL CRIME OBSERVATIONS
                  </span>
                  <p>{quality?.criteria?.official_observations}</p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    2. HISTORICAL COMPLETENESS
                  </span>
                  <p>{quality?.criteria?.historical_completeness}</p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    3. NEWS REPORTING COVERAGE
                  </span>
                  <p>{quality?.criteria?.news_reporting_coverage}</p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    4. SCHOLARLY GROUNDING
                  </span>
                  <p>{quality?.criteria?.scholarly_grounding}</p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    5. GEOGRAPHIC MATCHING
                  </span>
                  <p>{quality?.criteria?.geographic_matching}</p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase text-[#0D9488] block">
                    6. BOUNDARY STABILITY
                  </span>
                  <p>{quality?.criteria?.administrative_boundary_stability}</p>
                </div>
              </div>

              {/* RIGOROUS LIMITATIONS DISCLOSURES */}
              <div className="p-4 bg-[#F8FAFC] border-l-4 border-[#64748B] rounded-r-xl space-y-2">
                <span className="font-mono font-bold text-[10px] uppercase text-[#0F172A] block">
                  DOCUMENTED LIMITATIONS & CITIZEN PRIVACY SAFEGUARDS
                </span>
                <ul className="space-y-1 list-disc list-inside text-[#64748B]">
                  {quality?.limitations_list?.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
