import React, { useEffect, useState } from 'react';
import { AlertTriangle, Search, FileText, BookOpen, ShieldCheck, Info, RefreshCw, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { AnomalyItem, EvidenceSearchItem } from '../types';

export const SectionDeviationsEvidence: React.FC = () => {
  const [subTab, setSubTab] = useState<'anomalies' | 'evidence'>('anomalies');
  
  // Anomalies state
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [filterOnlyAnomalies, setFilterOnlyAnomalies] = useState<boolean>(true);
  const [anomalyLoading, setAnomalyLoading] = useState<boolean>(true);

  // RAG Evidence state
  const [query, setQuery] = useState<string>('Crime Against Women');
  const [results, setResults] = useState<EvidenceSearchItem[]>([]);
  const [evidenceLoading, setEvidenceLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  useEffect(() => {
    api.getAnomalies()
      .then((res) => {
        if (res.anomalies) setAnomalies(res.anomalies);
      })
      .catch(console.error)
      .finally(() => setAnomalyLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setEvidenceLoading(true);
    setSearched(true);
    api.searchEvidence(query)
      .then((res) => {
        if (res.results) setResults(res.results);
      })
      .catch(console.error)
      .finally(() => setEvidenceLoading(false));
  };

  const displayedAnomalies = filterOnlyAnomalies ? anomalies.filter((a) => a.anomaly_flag) : anomalies;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide uppercase flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Statistical Deviations & Documentary Evidence
          </h2>
          <p className="text-xs text-slate-500">
            Unsupervised statistical outlier detection and RAG documentary evidence retrieval across SCRB compendiums
          </p>
        </div>

        {/* Sub-Tab Navigation Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setSubTab('anomalies')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'anomalies'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Statistical Deviations</span>
          </button>
          <button
            onClick={() => setSubTab('evidence')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'evidence'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentary PDF Evidence</span>
          </button>
        </div>
      </div>

      {subTab === 'anomalies' ? (
        <div className="space-y-6">
          {/* Policy Banner */}
          <div className="gov-card p-4 border-l-4 border-l-blue-800 bg-blue-50/50 flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-blue-950 uppercase">
                NEUTRAL RESEARCH TERMINOLOGY POLICY ACTIVE
              </div>
              <div className="text-blue-900 leading-relaxed">
                Anomalies indicate <em>statistical deviations from learned historical patterns</em>, not subjective risk. Subjective terms such as "dangerous location" or "high-risk area" are strictly prohibited.
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="gov-card p-4 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilterOnlyAnomalies(!filterOnlyAnomalies)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  filterOnlyAnomalies
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filterOnlyAnomalies ? 'Showing Flagged Deviations Only' : 'Showing All Observations'}
              </button>
              <span className="text-slate-600">
                Flagged Outliers: <strong className="text-amber-800">{anomalies.filter((a) => a.anomaly_flag).length}</strong>
              </span>
            </div>

            <span className="badge-info text-[10px] px-2.5 py-0.5 rounded font-bold">
              UNSUPERVISED OUTLIER SCAN
            </span>
          </div>

          {/* Deviation Table */}
          <div className="gov-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
              <Activity className="w-4 h-4 text-amber-600" />
              Statistical Deviation Records
            </h3>

            {anomalyLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">Scanning historical records for statistical outliers...</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Year</th>
                      <th className="px-4 py-2.5">Police Unit</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Observed Count</th>
                      <th className="px-4 py-2.5">Historical Baseline</th>
                      <th className="px-4 py-2.5">Percentage Deviation</th>
                      <th className="px-4 py-2.5">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {displayedAnomalies.map((row, idx) => (
                      <tr key={`${row.district}-${row.year}-${idx}`} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-900">{row.year}</td>
                        <td className="px-4 py-2 text-blue-900 font-semibold">{row.district}</td>
                        <td className="px-4 py-2 text-slate-600">{row.crime_category}</td>
                        <td className="px-4 py-2 font-bold text-slate-900">{row.observed_count.toLocaleString()}</td>
                        <td className="px-4 py-2 text-slate-500">{row.historical_baseline.toLocaleString()}</td>
                        <td className="px-4 py-2 font-bold text-amber-700">
                          {row.supporting_features?.percentage_deviation ? `+${row.supporting_features.percentage_deviation}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                          {row.anomaly_flag ? (
                            <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-bold">STATISTICAL OUTLIER</span>
                          ) : (
                            <span className="badge-validated text-[10px] px-2 py-0.5 rounded">EXPECTED PATTERN</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* RAG Search Form */}
          <form onSubmit={handleSearch} className="gov-card p-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentary evidence (e.g. 'Crime against women 2023', 'Property theft Chennai')..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={evidenceLoading}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              {evidenceLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Retrieve Evidence</span>
            </button>
          </form>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>
                Retrieval Status: {searched ? `Found ${results.length} evidence matches` : 'Enter a query to search official compendiums'}
              </span>
              <span className="badge-info text-[10px] px-2.5 py-0.5 rounded font-bold">
                2017–2023 SCRB PDF EVIDENCE
              </span>
            </div>

            {evidenceLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">Searching 4,052 indexed SCRB PDF tables...</div>
            ) : searched && results.length === 0 ? (
              <div className="gov-card p-6 border-amber-300 text-center space-y-2 bg-amber-50/40">
                <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto" />
                <div className="text-sm font-bold text-slate-900">No Matching Documentary Evidence Found</div>
                <div className="text-xs text-slate-600">
                  No matching records exist in the 2017–2023 SCRB compendiums for this query. Hallucination is strictly prohibited.
                </div>
              </div>
            ) : (
              results.map((item, idx) => (
                <div key={idx} className="gov-card p-5 space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-800" />
                        {item.citation}
                      </h3>
                      <div className="text-xs text-blue-900 font-mono mt-0.5 font-semibold">
                        Source: {item.document} | Year: {item.year} | Page: {item.page}
                      </div>
                    </div>
                    <span className="badge-validated text-[10px] px-2 py-0.5 rounded font-mono">
                      RELEVANCE: {(item.similarity_score * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
                    {item.text_snippet}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                    <div>Source: <span className="text-slate-800 font-bold">{item.source}</span> | Scope: <span className="text-slate-800 font-bold">{item.geography}</span></div>
                    <div className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Document: {item.document_type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
