import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Search, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { ReusableMap } from '../components/ReusableMap';
import { UnitPanel } from '../components/geography/UnitPanel';
import { UnitTrajectoryModal } from '../components/geography/UnitTrajectoryModal';
import { researchApi, newsApi } from '../services/api';
import { useAnalyticalContext } from '../context/AnalyticalContext';

interface SpatialIntelligencePageProps {
  onOpenProvenance?: () => void;
}

export const SpatialIntelligencePage: React.FC<SpatialIntelligencePageProps> = ({ onOpenProvenance }) => {
  const {
    district,
    category,
    year,
    allDistricts,
    allCategories,
    setDistrict,
    setCategory,
    setYear,
  } = useAnalyticalContext();

  const [isTrajectoryModalOpen, setIsTrajectoryModalOpen] = useState<boolean>(false);
  const [showStations, setShowStations] = useState<boolean>(false);

  // Dynamic news and analyst explanation state
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [analystExplanation, setAnalystExplanation] = useState<any>(null);
  const [loadingEvidence, setLoadingEvidence] = useState<boolean>(false);

  // Fetch dynamic news and analyst explanation when selected context changes
  useEffect(() => {
    let isCancelled = false;
    setLoadingEvidence(true);

    const query = `${district} ${category.replace('_', ' ')}`;

    Promise.allSettled([
      newsApi.searchNews(district, category),
      researchApi.explainAreaFindings({
        query,
        district,
        category,
        year,
        state_ut: district.toUpperCase() === 'PUDUCHERRY' || district.toUpperCase() === 'KARAIKAL' ? 'PUDUCHERRY' : 'TAMIL NADU',
        trend_note: `Selected historical year ${year}`
      })
    ]).then(([newsRes, explainRes]) => {
      if (isCancelled) return;
      if (newsRes.status === 'fulfilled') {
        setNewsArticles(newsRes.value?.articles || []);
      } else {
        setNewsArticles([]);
      }

      if (explainRes.status === 'fulfilled') {
        setAnalystExplanation(explainRes.value?.explanation || explainRes.value);
      } else {
        setAnalystExplanation(null);
      }
      setLoadingEvidence(false);
    }).catch(() => {
      if (!isCancelled) setLoadingEvidence(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [district, category, year]);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto text-[#111827] font-sans bg-white">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-[#0D9488] uppercase tracking-wider">
            GEOGRAPHIC INTELLIGENCE WORKSTATION
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mt-1 flex items-center space-x-2">
            <MapPin className="w-7 h-7 text-[#0D9488]" />
            <span>Tamil Nadu Geographic Crime Analysis</span>
          </h1>
          <p className="text-xs md:text-sm text-[#6B7280] font-sans mt-1">
            Interactive map & spatial crime distribution for all 38 Tamil Nadu administrative districts and police reporting units. Click any district polygon on the map to inspect.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer flex items-center space-x-1.5 border ${
              showStations
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
            title="Toggle Police Station Markers"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>POLICE STATIONS</span>
          </button>
        </div>
      </div>

      {/* TOP CONTROLS BAR */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-sans shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* STATE */}
          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">STATE:</span>
            <span className="bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1.5 rounded-lg font-semibold text-[#111827]">
              Tamil Nadu
            </span>
          </div>

          {/* YEAR */}
          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">YEAR:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {[2023, 2022, 2020, 2016, 2010, 2005, 2001].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* CRIME CATEGORY */}
          <div className="flex items-center space-x-2">
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">CATEGORY:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-w-[180px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {allCategories.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* SEARCH/PAN DISTRICT */}
          <div className="flex items-center space-x-2 border-l border-[#E5E7EB] pl-3">
            <Search className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-wider">FIND DISTRICT:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="min-w-[160px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none cursor-pointer hover:border-[#D1D5DB] transition-all"
            >
              {allDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* WORKSTATION LAYOUT: LEFT MAP 70%, RIGHT PANEL 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP CONTAINER ~70% (8 columns on lg) */}
        <div className="lg:col-span-8 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-2xs flex flex-col p-4">
          <ReusableMap
            selectedCategory={category}
            selectedLayer={year > 2023 ? 'forecast' : 'observed'}
            selectedForecastYear={year}
            selectedUnit={district}
            onSelectUnit={(u) => setDistrict(u)}
            mapMode="units"
            showStations={showStations}
            height="560px"
          />
        </div>

        {/* UNIT INVESTIGATION PANEL ~30% (4 columns on lg) */}
        <div className="lg:col-span-4 h-full flex">
          <UnitPanel
            unitName={district}
            year={year}
            category={category}
            geographyId={`TN_${district.toUpperCase().replace(/\s+/g, '_')}`}
            onViewTrajectory={() => setIsTrajectoryModalOpen(true)}
            onOpenProvenance={onOpenProvenance}
          />
        </div>
      </div>

      {/* DYNAMIC DISTRICT EVIDENCE & SAFETY INTELLIGENCE (2-CARD LAYOUT) */}
      <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0D9488] uppercase tracking-wider">
              DISTRICT SAFETY & EVIDENCE INTELLIGENCE
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-0.5">
              {district} — {allCategories.find((c) => c.code === category)?.label || category.replace(/_/g, ' ')}
            </h2>
          </div>
          {loadingEvidence && (
            <span className="text-xs font-mono text-[#0D9488] animate-pulse">
              Synthesizing local evidence, latest news & safety tips...
            </span>
          )}
        </div>

        {/* 2-COLUMN SECTION: WHY THIS AREA? & HOW TO STAY SAFER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* CARD 1: WHY THIS AREA? */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 border-b border-[#E5E7EB] pb-3">
                <FileText className="w-5 h-5 text-[#0D9488]" />
                <h3 className="font-bold text-base text-[#111827]">Why This Area?</h3>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-[#374151] mt-4">
                <div>
                  <span className="font-bold text-[#111827] block text-[10px] uppercase font-mono text-[#0D9488] tracking-wider">
                    OBSERVED PATTERN
                  </span>
                  <p className="mt-1 leading-relaxed">
                    {analystExplanation?.what_is_happening || `Loading observed metrics for ${district}...`}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#111827] block text-[10px] uppercase font-mono text-[#0D9488] tracking-wider">
                    WHY IT IS THIS WAY & RECENT NEWS
                  </span>
                  <p className="mt-1 leading-relaxed">
                    {analystExplanation?.why_it_may_be_happening || `Analyzing local urban drivers and recent news reporting for ${district}...`}
                  </p>
                </div>

                {/* REAL RECENT NEWS WITH NEWSPAPER HERO IMAGE */}
                {newsArticles.length > 0 && (
                  <div className="pt-2 border-t border-[#E5E7EB] space-y-2.5">
                    <span className="font-bold text-[#111827] block text-[10px] uppercase font-mono text-[#0D9488] tracking-wider">
                      RECENT REPORTING & ARTICLES REFERENCED
                    </span>
                    <div className="space-y-2.5">
                      {newsArticles.slice(0, 2).map((art, idx) => (
                        <a
                          key={idx}
                          href={art.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-2.5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0D9488] hover:shadow-xs transition-all group overflow-hidden"
                        >
                          {/* NEWSPAPER HERO / FEATURED PHOTO */}
                          <div className="w-20 h-16 sm:w-24 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB] relative">
                            {art.image_url ? (
                              <img
                                src={art.image_url}
                                alt={art.headline}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  // Fallback to placeholder styling if image fails
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          {/* ARTICLE DETAILS */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] mb-1">
                                <span className="font-semibold text-[#0D9488] truncate max-w-[140px]">
                                  {art.publisher || 'Verified Press'}
                                </span>
                                <span className="shrink-0">{art.published_at || 'Recent'}</span>
                              </div>
                              <h4 className="font-semibold text-xs text-[#111827] group-hover:text-[#0D9488] line-clamp-2 leading-snug">
                                {art.headline}
                              </h4>
                            </div>
                            <div className="flex items-center text-[10px] font-mono text-[#6B7280] group-hover:text-[#0D9488] mt-1.5">
                              <span>Read coverage</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-1 inline" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB]">
              <span className="font-bold text-[#111827] block text-[10px] uppercase font-mono text-[#6B7280] tracking-wider">
                LIMITATION
              </span>
              <p className="mt-0.5 text-[11px] text-[#6B7280] leading-relaxed">
                {analystExplanation?.limitations || `Observational administrative data reflects reported cases. Higher figures often reflect active reporting accessibility and proactive policing drives rather than direct causation.`}
              </p>
            </div>
          </div>

          {/* CARD 2: HOW TO STAY SAFER */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 border-b border-[#E5E7EB] pb-3">
                <Shield className="w-5 h-5 text-[#0D9488]" />
                <h3 className="font-bold text-base text-[#111827]">How To Stay Safer</h3>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed text-[#374151] mt-4">
                <p className="text-[#6B7280] italic">
                  Practical, evidence-grounded guidance for {district}:
                </p>

                <ul className="space-y-2.5">
                  {analystExplanation?.safety_guidance?.length ? (
                    analystExplanation.safety_guidance.map((sg: string, idx: number) => {
                      const parts = sg.split(': ');
                      if (parts.length > 1) {
                        return (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-[#0D9488] font-bold text-sm leading-none mt-0.5">•</span>
                            <span>
                              <strong className="text-[#111827]">{parts[0]}:</strong>{' '}
                              <span>{parts.slice(1).join(': ')}</span>
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#0D9488] font-bold text-sm leading-none mt-0.5">•</span>
                          <span>{sg}</span>
                        </li>
                      );
                    })
                  ) : (
                    <>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#0D9488] font-bold text-sm leading-none mt-0.5">•</span>
                        <span><strong className="text-[#111827]">Emergency Dispatch (112):</strong> Dial 112 immediately for emergency patrol vehicle assistance across {district}.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#0D9488] font-bold text-sm leading-none mt-0.5">•</span>
                        <span><strong className="text-[#111827]">Digital FIR Verification:</strong> Utilize official TN Police CCTNS citizen portal (eservices.tnpolice.gov.in) for prompt digital complaints.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#0D9488] font-bold text-sm leading-none mt-0.5">•</span>
                        <span><strong className="text-[#111827]">Transit Security:</strong> Exercise heightened awareness in commercial corridors, bus terminuses, and crowded market areas.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* QUICK EMERGENCY DIAL CHIPS */}
            <div className="pt-3 border-t border-[#E5E7EB]">
              <span className="font-bold text-[#111827] block text-[10px] uppercase font-mono text-[#0D9488] mb-2 tracking-wider">
                RAPID RESPONSE ASSISTANCE
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 bg-white text-[#111827] rounded-lg border border-[#E5E7EB] font-bold shadow-2xs">
                  🚨 Police Dispatch: 112
                </span>
                {category === 'cyber' && (
                  <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] rounded-lg border border-[#BFDBFE] font-bold">
                    💳 Cyber Fraud: 1930
                  </span>
                )}
                {category === 'women_and_children' && (
                  <>
                    <span className="px-2.5 py-1 bg-[#FDF2F8] text-[#BE185D] rounded-lg border border-[#FBCFE8] font-bold">
                      👩 Women Helpline: 181
                    </span>
                    <span className="px-2.5 py-1 bg-[#FFFBEB] text-[#B45309] rounded-lg border border-[#FDE68A] font-bold">
                      👶 Childline: 1098
                    </span>
                  </>
                )}
                <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#047857] rounded-lg border border-[#A7F3D0] font-bold">
                  📱 TN Police Kavalan SOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Modal */}
      <UnitTrajectoryModal
        unitName={district}
        isOpen={isTrajectoryModalOpen}
        onClose={() => setIsTrajectoryModalOpen(false)}
        onOpenProvenance={onOpenProvenance}
      />
    </div>
  );
};
