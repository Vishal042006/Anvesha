import React, { useEffect, useState } from 'react';
import { Database, Activity, Search, MapPin, Sparkles, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { api } from '../services/api';
import type { SummaryData } from '../types';
import type { SectionId } from '../components/Navbar';

interface SectionOverviewProps {
  onNavigate?: (section: SectionId) => void;
}

interface HistoryPoint {
  year: number;
  crime_count: number;
  yoy_change_pct?: number;
}

export const SectionOverviewAnalytics: React.FC<SectionOverviewProps> = ({ onNavigate }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai');
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ name: string; count: number }[]>([]);

  const districts = [
    'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kancheepuram', 'Kanniyakumari', 'Karur', 'Krishnagiri',
    'Madurai', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Salem', 'Sivagangai', 'Thanjavur', 'The Nilgiris', 'Theni',
    'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
    'Tiruvarur', 'Vellore', 'Villupuram', 'Virudhunagar'
  ];

  useEffect(() => {
    api.getSummary().then((res) => {
      if (res.data) {
        setSummaryData(res.data);
        if (res.data.category_totals) {
          const breakdown = Object.entries(res.data.category_totals).map(([cat, val]) => ({
            name: cat.replace('CRIME AGAINST ', 'AGAINST '),
            count: Number(val)
          }));
          setCategoryBreakdown(breakdown);
        }
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    api.getDistrictHistory(selectedDistrict)
      .then((res) => {
        if (res.data) {
          const rawHist = res.data.historical_crime || [];
          const computedHist: HistoryPoint[] = rawHist.map((item, idx) => {
            const prev = idx > 0 ? rawHist[idx - 1].crime_count : null;
            const yoy = prev ? Math.round(((item.crime_count - prev) / prev) * 1000) / 10 : undefined;
            return { year: item.year, crime_count: item.crime_count, yoy_change_pct: yoy };
          });
          setHistoryData(computedHist);
        }
      })
      .catch(console.error);
  }, [selectedDistrict]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-[#17243B]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2457A7] via-[#1C4689] to-[#087F8C] rounded-xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Geographic Line Vector Texture Backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
            <path d="M50 300 Q 200 100 400 250 T 750 150" stroke="currentColor" strokeWidth="3" />
            <path d="M100 350 Q 300 200 500 300 T 800 200" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="180" r="12" fill="currentColor" opacity="0.4" />
            <circle cx="400" cy="250" r="18" fill="currentColor" opacity="0.3" />
            <circle cx="600" cy="190" r="14" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-sky-100 border border-white/20">
            <span>Tamil Nadu Research Study</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Understand crime patterns. Explore the evidence.
          </h1>

          <p className="text-sm text-sky-100 leading-relaxed max-w-2xl">
            Explore historical crime records, geographic patterns, population context, and research-backed forecasts across 36 police reporting units in Tamil Nadu.
          </p>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#64748B] text-xs font-medium">
            <span>Recorded Crime Observations</span>
            <Database className="w-4 h-4 text-[#2457A7]" />
          </div>
          <div className="text-2xl font-bold text-[#17243B] font-mono">
            {summaryData ? summaryData.total_observations.toLocaleString() : '2,640'}
          </div>
          <div className="text-[11px] text-[#64748B]">2001–2014 Validated Primary Panel</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#64748B] text-xs font-medium">
            <span>Geographic Units</span>
            <MapPin className="w-4 h-4 text-[#087F8C]" />
          </div>
          <div className="text-2xl font-bold text-[#17243B]">
            {summaryData ? summaryData.police_units_count : 36} Reporting Units
          </div>
          <div className="text-[11px] text-[#64748B]">District & Commissionerates</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#64748B] text-xs font-medium">
            <span>Crime Categories</span>
            <Activity className="w-4 h-4 text-[#2457A7]" />
          </div>
          <div className="text-2xl font-bold text-[#17243B]">
            {summaryData ? summaryData.categories_count : 7} Categories
          </div>
          <div className="text-[11px] text-[#64748B]">IPC & Special Local Laws</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#64748B] text-xs font-medium">
            <span>Reporting Period</span>
            <Sparkles className="w-4 h-4 text-[#087F8C]" />
          </div>
          <div className="text-2xl font-bold text-[#17243B] font-mono">2001–2014</div>
          <div className="text-[11px] text-[#13856B] font-semibold">14-Year Benchmark Dataset</div>
        </div>
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4EAF1]">
            <div>
              <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2457A7]" />
                Recorded Crime Trend
              </h3>
              <p className="text-xs text-[#64748B]">Annual recorded incidents for selected location</p>
            </div>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E4EAF1] text-[#17243B] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2457A7] font-semibold"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF1" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4EAF1', borderRadius: '0.5rem', color: '#17243B', fontSize: '12px' }}
                  formatter={(val: any) => [Number(val).toLocaleString(), 'Incidents']}
                />
                <Line type="monotone" dataKey="crime_count" stroke="#2457A7" strokeWidth={2.5} dot={{ r: 4, fill: '#2457A7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart (1 Col) */}
        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E4EAF1]">
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#087F8C]" />
              State Category Distribution
            </h3>
            <p className="text-xs text-[#64748B]">Proportional crime category total</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF1" />
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={9} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4EAF1', borderRadius: '0.5rem', color: '#17243B', fontSize: '11px' }}
                  formatter={(val: any) => [Number(val).toLocaleString(), 'Incidents']}
                />
                <Bar dataKey="count" fill="#087F8C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Exploration Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#17243B]">Quick Exploration Triggers</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('explorer')}
            className="p-4 bg-white border border-[#E4EAF1] hover:border-[#2457A7] rounded-xl text-left transition-all hover:shadow-sm group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2457A7] flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-[#17243B] group-hover:text-[#2457A7] flex items-center justify-between">
              <span>Explore Trends</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-[#64748B]">Inspect historical time-series, YoY % changes, and statistical deviations.</p>
          </button>

          <button
            onClick={() => onNavigate?.('map_forecasts')}
            className="p-4 bg-white border border-[#E4EAF1] hover:border-[#2457A7] rounded-xl text-left transition-all hover:shadow-sm group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#087F8C] flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-[#17243B] group-hover:text-[#2457A7] flex items-center justify-between">
              <span>Tamil Nadu Map</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-[#64748B]">Explore reporting-unit point locations and regional concentrations.</p>
          </button>

          <button
            onClick={() => onNavigate?.('map_forecasts')}
            className="p-4 bg-white border border-[#E4EAF1] hover:border-[#2457A7] rounded-xl text-left transition-all hover:shadow-sm group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-[#17243B] group-hover:text-[#2457A7] flex items-center justify-between">
              <span>View Forecasts</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-[#64748B]">Evaluate next-year crime estimates and plain-language driver breakdowns.</p>
          </button>

          <button
            onClick={() => onNavigate?.('assistant')}
            className="p-4 bg-white border border-[#E4EAF1] hover:border-[#2457A7] rounded-xl text-left transition-all hover:shadow-sm group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#B86A16] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-[#17243B] group-hover:text-[#2457A7] flex items-center justify-between">
              <span>Search Evidence</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-[#64748B]">Search 4,052 SCRB compendium tables for documentary evidence citations.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
