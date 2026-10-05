import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';

export const ClassificationPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/classification')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const metrics = data?.metrics || {
    accuracy: 0.8788,
    macro_f1: 0.7768,
    weighted_f1: 0.8650,
    model_name: "LogisticRegression_TFIDF"
  };

  const taxonomy = data?.taxonomy || [
    { source_category: "MURDER", canonical_category: "VIOLENT", source: "IPC_SECTION_302", confidence: 0.99 },
    { source_category: "BURGLARY", canonical_category: "PROPERTY", source: "IPC_SECTION_457", confidence: 0.99 },
    { source_category: "CHEATING", canonical_category: "ECONOMIC", source: "IPC_SECTION_420", confidence: 0.99 },
    { source_category: "CYBER FRAUD", canonical_category: "CYBER", source: "IT_ACT_66D", confidence: 0.99 },
    { source_category: "DOWRY DEATHS", canonical_category: "WOMEN_AND_CHILDREN", source: "IPC_SECTION_304B", confidence: 0.99 },
    { source_category: "RIOTS", canonical_category: "PUBLIC_ORDER", source: "IPC_SECTION_147", confidence: 0.99 },
    { source_category: "SL_LOCAL_LAWS", canonical_category: "OTHER", source: "SLL_ACTS", confidence: 0.90 }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#0F172A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="text-xs font-mono text-[#2563EB] font-bold tracking-wider uppercase mb-1">
          PAGE 3 — CRIME TAXONOMY & CLASSIFICATION MODEL
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Supervised Category Standardization & Classifier
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Standardizes heterogeneous raw IPC and SLL crime categories into 7 canonical ANVESHA crime domains using TF-IDF feature extraction and Logistic Regression.
        </p>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs">
          <div className="text-[#64748B] text-xs font-mono mb-1">CLASSIFICATION MODEL</div>
          <div className="text-base font-bold font-mono text-[#0F172A]">{metrics.model_name || 'TFIDF + LogReg'}</div>
          <div className="text-[10px] text-[#64748B] mt-1">Supervised Category Mapper</div>
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs">
          <div className="text-[#64748B] text-xs font-mono mb-1">PRIMARY METRIC (MACRO F1)</div>
          <div className="text-2xl font-bold font-mono text-[#2563EB]">
            {(metrics.macro_f1 * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-[#2563EB] mt-1">Evaluated on Imbalanced Classes</div>
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs">
          <div className="text-[#64748B] text-xs font-mono mb-1">ACCURACY SCORE</div>
          <div className="text-2xl font-bold font-mono text-[#166534]">
            {(metrics.accuracy * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-[#166534] mt-1">Exact Mapping Match Rate</div>
        </div>

        <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm shadow-xs">
          <div className="text-[#64748B] text-xs font-mono mb-1">WEIGHTED F1 SCORE</div>
          <div className="text-2xl font-bold font-mono text-[#0F172A]">
            {(metrics.weighted_f1 * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">Sample-Weighted F1</div>
        </div>
      </div>

      {/* Taxonomy Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
            <Tag className="w-4 h-4 text-[#2563EB]" />
            <span>CANONICAL ANVESHA TAXONOMY MAPPINGS</span>
          </h3>
          <span className="text-xs font-mono text-[#64748B]">{taxonomy.length} CATEGORY MAPPINGS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F1F5F9] text-[#475569] font-mono text-[11px] uppercase border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Source Raw Category</th>
                <th className="p-3">Canonical Category</th>
                <th className="p-3">Legal Basis / Source</th>
                <th className="p-3">Mapping Rule</th>
                <th className="p-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {taxonomy.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-semibold text-[#0F172A]">{row.source_category}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] rounded-xs">
                      {row.canonical_category}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[#64748B]">{row.source}</td>
                  <td className="p-3 font-mono text-[10px] text-[#166534]">{row.mapping_rule || 'LEGAL_SECTION_EXACT'}</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">
                    {(row.confidence * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
