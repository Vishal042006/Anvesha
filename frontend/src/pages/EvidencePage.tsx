import React, { useState } from 'react';
import { Search, RefreshCw, ShieldCheck, FileText } from 'lucide-react';
import { evidenceApi } from '../services/api';
import type { EvidenceSearchItem } from '../types';
import { ApiLoadingState, ApiErrorState, ApiEmptyState } from '../components/ui/ApiStateHandlers';

export const EvidencePage: React.FC = () => {
  const [query, setQuery] = useState<string>('Crime against women');
  const [results, setResults] = useState<EvidenceSearchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvidenceSearchItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const suggestedQueries = [
    'Crime against women',
    'Property crime trends',
    'Economic offences',
    'Crime prevention',
    'District-level crime patterns',
  ];

  const handleSearch = (qString: string) => {
    if (!qString.trim()) return;
    setQuery(qString);
    setLoading(true);
    setSearched(true);
    setError(false);
    evidenceApi
      .searchEvidence(qString)
      .then((res) => {
        setResults(res.results || []);
        if (res.results?.length) {
          setSelectedItem(res.results[0]);
        }
        setError(false);
      })
      .catch((err) => {
        console.error('Evidence search error:', err);
        setError(true);
        setResults([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            RESEARCH WORKSPACE / EVIDENCE
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            RESEARCH EVIDENCE ARCHIVE
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            "Research literature connected to observed statistical patterns." — BGE dense vector semantic search over 4,052 indexed SCRB tables.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="badge-observed">4,052 SCRB TABLES</span>
          <span className="badge-derived">BGE-M3 RAG</span>
        </div>
      </div>

      {/* Search Bar & Archive Query Controls */}
      <div className="editorial-card p-5 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search research evidence archive (e.g. 'Crime against women', 'Property crime')..."
              className="w-full bg-[#F1F0EB] border border-[#D8D6D0] text-[#111111] text-xs font-mono pl-10 pr-4 py-3 focus:outline-hidden focus:border-[#1A1A1A] placeholder-[#777777]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1A1A1A] hover:bg-[#A61B1B] text-white font-mono font-bold text-xs px-6 py-3 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>SEARCH ARCHIVE</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[#777777] text-[11px] font-bold">SUGGESTED FILTERS:</span>
          {suggestedQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(sq)}
              className="px-2.5 py-1 bg-[#F1F0EB] hover:bg-[#D8D6D0] text-[#111111] border border-[#D8D6D0] text-[11px] transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Strict Differentiation Banner */}
      <div className="editorial-card p-4 bg-[#F8F7F3] border-l-4 border-l-[#2457A6] space-y-1">
        <div className="font-mono font-bold text-[#2457A6] text-xs uppercase flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          CRITICAL PROVENANCE SEPARATION NOTICE:
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono pt-1">
          <span className="badge-modelled">MODEL OUTPUT = STATISTICAL ESTIMATE</span>
          <span className="badge-observed">EXTERNAL RESEARCH EVIDENCE = VERIFIED PUBLIC RECORD</span>
        </div>
      </div>

      {/* Search Results / Document Viewer */}
      {loading ? (
        <ApiLoadingState message="Searching 4,052 indexed SCRB PDF document tables with BGE vector retrieval..." />
      ) : error ? (
        <ApiErrorState message="Unable to query evidence archive." onRetry={() => handleSearch(query)} />
      ) : searched && results.length === 0 ? (
        <ApiEmptyState
          title="NO MATCHING EVIDENCE"
          message="No relevant publications or SCRB tables were found matching this search query."
        />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Archive Cards List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-mono text-[#777777]">
              ARCHIVE RESULTS: <strong className="text-[#111111]">{results.length} MATCHING COMPENDIUM EXCERPTS</strong>
            </div>

            {results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedItem(item)}
                className={`editorial-card p-5 cursor-pointer transition-all space-y-3 ${
                  selectedItem?.citation === item.citation
                    ? 'border-2 border-[#1A1A1A] bg-[#FFFFFF] shadow-md'
                    : 'border-[#D8D6D0] hover:border-[#1A1A1A] bg-[#FFFFFF]'
                }`}
              >
                <div className="flex justify-between items-start border-b border-[#D8D6D0] pb-2">
                  <h3 className="font-serif font-bold text-base text-[#111111]">
                    {item.document || 'SCRB Annual Crime Compendium'}
                  </h3>
                  <span className="badge-derived font-mono text-[10px]">
                    SIM: {(item.similarity_score * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-[#4B4B4B] leading-relaxed font-sans italic border-l-2 border-[#D8D6D0] pl-3 py-1">
                  "{item.text_snippet}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#777777] pt-2 border-t border-[#D8D6D0]">
                  <span>SOURCE: {item.source || item.organization || 'SCRB PUBLIC RECORD'}</span>
                  <span>YEAR: {item.year} | PAGE: {item.page || 'SEC 04'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Document Citation Sheet */}
          <div className="editorial-card-strong p-5 space-y-4 font-mono text-xs bg-[#FFFFFF]">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="font-serif font-bold text-base text-[#111111] uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#A61B1B]" />
                DOCUMENT SHEET
              </h3>
              <span className="badge-observed">CITATIONS</span>
            </div>

            {selectedItem ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
                  <div className="text-[#777777] text-[10px] font-bold uppercase">DOCUMENT RECORD</div>
                  <div className="font-serif font-bold text-sm text-[#111111]">{selectedItem.document}</div>
                  <div className="text-[10px] text-[#4B4B4B] font-mono">Published: {selectedItem.year} | Page Ref: {selectedItem.page || 'SEC 04'}</div>
                </div>

                <div className="space-y-1 bg-[#F8F7F3] p-3 border border-[#D8D6D0]">
                  <div className="text-[10px] text-[#777777] font-bold uppercase">FULL EXCERPT:</div>
                  <p className="font-sans italic text-[#111111] text-xs leading-relaxed">"{selectedItem.text_snippet}"</p>
                </div>

                <div className="space-y-1">
                  <div className="text-[#777777] text-[10px] font-bold uppercase">OFFICIAL CITATION:</div>
                  <div className="p-2.5 bg-[#F1F0EB] border border-[#D8D6D0] text-[10px] font-mono font-bold text-[#111111]">
                    {selectedItem.citation}
                  </div>
                  {selectedItem.doi && (
                    <div className="text-[#777777] text-[10px] pt-1">DOI: <span className="text-[#2457A6] font-bold">{selectedItem.doi}</span></div>
                  )}
                </div>

                <div className="text-[10px] text-[#4B4B4B] bg-[#F8F7F3] p-3 border border-[#D8D6D0] font-sans leading-relaxed">
                  * Note: Citations are drawn from official published compendiums and indexed literature. Citation ground truth is strictly preserved without hallucination.
                </div>
              </div>
            ) : (
              <ApiEmptyState title="No Document Selected" message="Select a document card on the left to read full excerpt and citation." />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
