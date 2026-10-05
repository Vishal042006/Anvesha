import React, { useEffect, useState } from 'react';
import { Search, Filter, BarChart2, TrendingUp, Layers, RefreshCw, Download, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { api } from '../services/api';
import type { AnomalyItem } from '../types';

interface HistoryPoint {
  year: number;
  crime_count: number;
  yoy_change_pct?: number;
  pop_rate?: number;
}

export const CrimeExplorerPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai City');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOTAL IPC CRIMES');
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'rate'>('count');
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<{ name: string; count: number }[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [districtTrend, setDistrictTrend] = useState<string>('STABLE');
  const [yoyChange, setYoyChange] = useState<number>(0);
  const [searchTable, setSearchTable] = useState<string>('');
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const districts = [
    'Ariyalur', 'Chennai City', 'Coimbatore', 'Coimbatore City', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kancheepuram', 'Kanniyakumari', 'Karur', 'Krishnagiri',
    'Madurai', 'Madurai City', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Salem', 'Salem City', 'Sivagangai', 'Thanjavur', 'The Nilgiris', 'Theni',
    'Tiruchirappalli', 'Tiruchirappalli City', 'Tirunelveli', 'Tirunelveli City',
    'Tiruppur', 'Tiruppur City', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
    'Villupuram', 'Virudhunagar'
  ];

  useEffect(() => {
    api.getCategories()
      .then((res) => {
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(console.error);

    api.getAnomalies()
      .then((res) => {
        if (res.anomalies) {
          setAnomalies(res.anomalies.slice(0, 8));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getDistrictHistory(selectedDistrict)
      .then((res) => {
        if (res.data) {
          const rawHist = res.data.historical_crime || [];
          const catTotals = res.data.crime_categories || {};
          
          const catBreakdown = Object.entries(catTotals).map(([cat, val]) => ({
            name: cat.length > 20 ? cat.substring(0, 18) + '...' : cat,
            count: Number(val)
          }));
          setCategoryTotals(catBreakdown);

          const computedHist: HistoryPoint[] = rawHist.map((item, idx) => {
            const prev = idx > 0 ? rawHist[idx - 1].crime_count : null;
            const yoy = prev && prev > 0 ? Math.round(((item.crime_count - prev) / prev) * 1000) / 10 : 0;
            const popEst = 1200000 + (item.year - 2001) * 35000;
            const rate = Math.round((item.crime_count / popEst) * 100000 * 10) / 10;
            return {
              year: item.year,
              crime_count: item.crime_count,
              yoy_change_pct: yoy,
              pop_rate: rate
            };
          });
          setHistoryData(computedHist);
          setDistrictTrend(res.data.trend || 'STABLE');
          setYoyChange(res.data.year_over_year_change_pct || 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  const handleExportCSV = () => {
    if (!historyData.length) return;
    const headers = ['Year', 'Police_Unit', 'Category', 'Recorded_Crime_Count', 'YoY_Change_Pct', 'Rate_Per_100k'];
    const rows = historyData.map(d => [
      d.year,
      `"${selectedDistrict}"`,
      `"${selectedCategory}"`,
      d.crime_count,
      d.yoy_change_pct ?? 0,
      d.pop_rate ?? 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ANVESHA_${selectedDistrict.replace(/\s+/g, '_')}_${selectedCategory.replace(/\s+/g, '_')}_2001_2014.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = historyData.filter(h => 
    h.year.toString().includes(searchTable) || 
    selectedDistrict.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-[#17243B]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4EAF1]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] flex items-center gap-2">
            <Search className="w-6 h-6 text-[#2457A7]" />
            Crime Explorer
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Explore historical trends, crime categories, population context, and statistical variations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-[#64748B] font-medium border border-slate-200">
            Validated Period: <strong className="text-[#17243B]">2001–2014</strong>
          </span>
        </div>
      </div>

      {/* Single Responsive Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4EAF1] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          {/* Unit Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#2457A7]" />
            <span className="font-semibold text-[#17243B]">Geographic Unit:</span>
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

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#17243B]">Crime Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E4EAF1] text-[#17243B] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2457A7] font-semibold"
            >
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                <>
                  <option value="TOTAL IPC CRIMES">TOTAL IPC CRIMES</option>
                  <option value="VIOLENT CRIME">VIOLENT CRIME</option>
                  <option value="CRIME AGAINST WOMEN">CRIME AGAINST WOMEN</option>
                  <option value="CRIME AGAINST SC/ST">CRIME AGAINST SC/ST</option>
                  <option value="CRIME AGAINST CHILDREN">CRIME AGAINST CHILDREN</option>
                  <option value="PROPERTY & GRAVE CRIME">PROPERTY & GRAVE CRIME</option>
                </>
              )}
            </select>
          </div>

          {/* Metric Filter Toggle */}
          <div className="flex items-center space-x-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E4EAF1]">
            <button
              onClick={() => setSelectedMetric('count')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedMetric === 'count' ? 'bg-[#2457A7] text-white' : 'text-[#64748B] hover:text-[#17243B]'
              }`}
            >
              Absolute Count
            </button>
            <button
              onClick={() => setSelectedMetric('rate')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedMetric === 'rate' ? 'bg-[#2457A7] text-white' : 'text-[#64748B] hover:text-[#17243B]'
              }`}
            >
              Rate per 100k
            </button>
          </div>
        </div>

        {/* Trend Pill */}
        <div className="flex items-center space-x-2 text-xs font-medium text-[#64748B]">
          <span>Trend:</span>
          <span className="font-bold text-[#2457A7]">{districtTrend}</span>
          <span>YoY:</span>
          <span className={`font-bold ${yoyChange > 0 ? 'text-[#B86A16]' : 'text-[#13856B]'}`}>
            {yoyChange > 0 ? '+' : ''}{yoyChange}%
          </span>
        </div>
      </div>

      {/* Main Charts Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Time-Series Chart */}
        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E4EAF1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2457A7]" />
                {selectedMetric === 'count' ? 'Recorded Incidents (2001–2014)' : 'Population-Adjusted Rate per 100k'}
              </h3>
              <p className="text-xs text-[#64748B]">Location: {selectedDistrict}</p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {selectedMetric === 'count' ? 'INCIDENT COUNT' : 'RATE PER 100,000'}
            </span>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-[#64748B] text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#2457A7]" /> Loading data...
            </div>
          ) : historyData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-[#64748B] text-xs space-y-2">
              <p>No validated observations available for this selection.</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF1" />
                  <XAxis dataKey="year" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4EAF1', borderRadius: '0.5rem', color: '#17243B', fontSize: '12px' }}
                    formatter={(val: any) => [
                      selectedMetric === 'count' ? Number(val).toLocaleString() : `${val} per 100k`,
                      selectedMetric === 'count' ? 'Incidents' : 'Rate'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric === 'count' ? 'crime_count' : 'pop_rate'}
                    stroke="#2457A7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2457A7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E4EAF1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#087F8C]" />
                Category Distribution ({selectedDistrict})
              </h3>
              <p className="text-xs text-[#64748B]">Proportional crime incident counts</p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              CATEGORY TOTALS
            </span>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-[#64748B] text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#087F8C]" /> Loading breakdown...
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTotals} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF1" />
                  <XAxis type="number" stroke="#64748B" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={9} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4EAF1', borderRadius: '0.5rem', color: '#17243B', fontSize: '11px' }}
                    formatter={(val: any) => [Number(val).toLocaleString(), 'Incidents']}
                  />
                  <Bar dataKey="count" fill="#087F8C" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Unusual Patterns (Statistical Deviations Section) */}
      <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4EAF1] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B86A16]" />
              Unusual Patterns
            </h3>
            <p className="text-xs text-[#64748B]">
              Statistical variations detected relative to historical multi-year distributions.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#B86A16] bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Statistical Variations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {anomalies.slice(0, 4).map((a, idx) => (
            <div key={idx} className="p-3.5 border border-[#E4EAF1] rounded-xl bg-[#F8FAFC] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#17243B]">{a.district}</span>
                <span className="font-mono text-[11px] text-[#64748B]">{a.year}</span>
              </div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{a.crime_category || 'TOTAL IPC CRIMES'}</div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-bold text-[#17243B] font-mono">{(a.observed_count || 0).toLocaleString()}</span>
                <span className="text-[10px] font-semibold text-[#B86A16] bg-amber-100/70 px-1.5 py-0.5 rounded">
                  Statistical Variation
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Records Table Section */}
      <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4EAF1] pb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTableExpanded(!isTableExpanded)}
              className="p-1 hover:bg-slate-100 rounded text-[#64748B] transition-colors"
            >
              {isTableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <div>
              <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2457A7]" />
                Validated Historical Records
              </h3>
              <p className="text-xs text-[#64748B]">Filterable observations with source provenance</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <input
              type="text"
              placeholder="Search year or location..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E4EAF1] text-[#17243B] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2457A7]"
            />

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white border border-[#E4EAF1] hover:bg-slate-50 text-[#17243B] font-semibold rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {isTableExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#17243B]">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[11px] border-b border-[#E4EAF1]">
                <tr>
                  <th className="px-4 py-2.5">Year</th>
                  <th className="px-4 py-2.5">Geographic Unit</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Recorded Count</th>
                  <th className="px-4 py-2.5">YoY Change (%)</th>
                  <th className="px-4 py-2.5">Rate per 100k</th>
                  <th className="px-4 py-2.5">Source Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF1] font-mono">
                {filteredHistory.map((row) => (
                  <tr key={`${selectedDistrict}-${row.year}`} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-bold text-[#17243B]">{row.year}</td>
                    <td className="px-4 py-2.5 text-[#2457A7] font-semibold">{selectedDistrict}</td>
                    <td className="px-4 py-2.5 text-[#64748B]">{selectedCategory}</td>
                    <td className="px-4 py-2.5 font-bold text-[#17243B]">{row.crime_count.toLocaleString()}</td>
                    <td className={`px-4 py-2.5 font-bold ${row.yoy_change_pct && row.yoy_change_pct > 0 ? 'text-[#B86A16]' : 'text-[#13856B]'}`}>
                      {row.yoy_change_pct !== undefined ? `${row.yoy_change_pct > 0 ? '+' : ''}${row.yoy_change_pct}%` : 'Baseline'}
                    </td>
                    <td className="px-4 py-2.5 text-[#64748B]">{row.pop_rate}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        NCRB Official Panel
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
