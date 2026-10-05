import React from 'react';
import { Cpu, Layers } from 'lucide-react';
import { modelsApi } from '../services/api';
import { ApiLoadingState, ApiErrorState } from '../components/ui/ApiStateHandlers';

export const ModelLabPage: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  const fetchModels = () => {
    setLoading(true);
    setError(false);
    modelsApi
      .getModels()
      .then(() => {
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching model registry:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchModels();
  }, []);

  if (loading) return <ApiLoadingState message="Connecting to ANVESHA Model Evaluation Registry..." />;
  if (error) return <ApiErrorState message="Unable to load model registry from ANVESHA backend." onRetry={fetchModels} />;

  const analyticalModels = [
    {
      model_name: 'Previous-Year Persistence (T-1)',
      task: 'Point Forecasting',
      track: 'Track A Official',
      period: '2004–2014 / 2023',
      mae: '171.50',
      rmse: '581.57',
      wape: '16.58%',
      r2: '0.9142',
      acc: '—',
      f1: '—',
      status: 'PASS WITH LIMITATIONS',
    },
    {
      model_name: 'Ridge Autoregressive (L2)',
      task: 'Point Forecasting',
      track: 'Track A Official',
      period: '2004–2014',
      mae: '185.25',
      rmse: '622.25',
      wape: '17.91%',
      r2: '0.9018',
      acc: '—',
      f1: '—',
      status: 'PASS WITH LIMITATIONS',
    },
    {
      model_name: 'LightGBM Trend Classifier',
      task: 'Trend Classification',
      track: 'Target A (±5% YoY)',
      period: '2021–2023 (N=639)',
      mae: '—',
      rmse: '—',
      wape: '—',
      r2: '—',
      acc: '80.59%',
      f1: '0.6367',
      status: 'BEST OBSERVED V3.4',
    },
    {
      model_name: 'Balanced Random Forest',
      task: 'Trend Classification',
      track: 'Target A (±5% YoY)',
      period: '2021–2023 (N=639)',
      mae: '—',
      rmse: '—',
      wape: '—',
      r2: '—',
      acc: '79.66%',
      f1: '0.6367',
      status: 'PASS WITH LIMITATIONS',
    },
    {
      model_name: 'Voting Ensemble Classifier',
      task: 'Trend Classification',
      track: 'Target A (±5% YoY)',
      period: '2021–2023 (N=639)',
      mae: '—',
      rmse: '—',
      wape: '—',
      r2: '—',
      acc: '80.59%',
      f1: '0.6210',
      status: 'PASS WITH LIMITATIONS',
    },
    {
      model_name: 'IsolationForest Detector',
      task: 'Anomaly Detection',
      track: 'Track A Official',
      period: '2001–2023',
      mae: '—',
      rmse: '—',
      wape: '—',
      r2: '—',
      acc: '3.76% Rate',
      f1: '—',
      status: 'UNSUPERVISED OUTLIER',
    },
  ];

  const evidenceReasoningStack = [
    {
      name: 'BGE-M3 Embedding Model',
      task: 'Dense Vector Representation',
      scope: '4,052 SCRB Extracted PDF Tables',
      dimensions: '1,024 Dense Dimensions',
      status: 'INDEX ACTIVE',
    },
    {
      name: 'BGE Reranker v2-M3',
      task: 'Semantic Cross-Encoder Reranking',
      scope: 'Top-20 Candidate Evidence Chunks',
      dimensions: 'Cross-Attention Score',
      status: 'ACTIVE RERANKER',
    },
    {
      name: 'Qwen3-8B Reasoning Core',
      task: 'Non-Causal Action Plan Synthesis',
      scope: 'Grounding Verification & Policy Drafts',
      dimensions: 'Structured Guidance Generation',
      status: 'ACTIVE SYNTHESIZER',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            RESEARCH WORKSPACE / DATA & METHODS
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            MODEL LAB & REGISTRY
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            "Evaluation registry for ANVESHA analytical models." — Strict separation of analytical statistical models from evidence reasoning models.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="badge-observed">REGISTRY: V3.4 CANONICAL</span>
          <span className="badge-derived">PASS WITH LIMITATIONS</span>
        </div>
      </div>

      {/* 01. ANALYTICAL MODELS TABLE */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#111111]" />
            <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
              01. ANALYTICAL & FORECASTING MODELS
            </h3>
          </div>
          <span className="badge-observed">TIME-SERIES / CLASSIFICATION</span>
        </div>

        <div className="border border-[#D8D6D0] overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F0EB] border-b border-[#D8D6D0] text-[#777777] text-[10px] uppercase">
                <th className="py-2.5 px-3">MODEL</th>
                <th className="py-2.5 px-3">TASK</th>
                <th className="py-2.5 px-3">DATASET TRACK</th>
                <th className="py-2.5 px-3">EVAL PERIOD</th>
                <th className="py-2.5 px-3 text-right">MAE</th>
                <th className="py-2.5 px-3 text-right">RMSE</th>
                <th className="py-2.5 px-3 text-right">WAPE</th>
                <th className="py-2.5 px-3 text-right">R²</th>
                <th className="py-2.5 px-3 text-right">ACCURACY</th>
                <th className="py-2.5 px-3 text-right">MACRO-F1</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D6D0] text-[#111111]">
              {analyticalModels.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F7F3]">
                  <td className="py-2.5 px-3 font-bold">{row.model_name}</td>
                  <td className="py-2.5 px-3 text-[#4B4B4B]">{row.task}</td>
                  <td className="py-2.5 px-3 text-[#777777]">{row.track}</td>
                  <td className="py-2.5 px-3">{row.period}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{row.mae}</td>
                  <td className="py-2.5 px-3 text-right text-[#4B4B4B]">{row.rmse}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#26734D]">{row.wape}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#2457A6]">{row.r2}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#A61B1B]">{row.acc}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{row.f1}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="badge-observed text-[9px]">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 02. EVIDENCE & REASONING STACK */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#2457A6]" />
            <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
              02. EVIDENCE & REASONING STACK
            </h3>
          </div>
          <span className="badge-derived font-mono">RETRIEVAL & SYNTHESIS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {evidenceReasoningStack.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#F1F0EB] border border-[#D8D6D0] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#111111] font-serif text-sm">{item.name}</span>
                <span className="badge-derived text-[9px]">{item.status}</span>
              </div>
              <div className="text-[10px] text-[#777777] uppercase font-bold">TASK: {item.task}</div>
              <div className="text-[11px] text-[#4B4B4B] font-sans leading-relaxed">
                Scope: {item.scope}
              </div>
              <div className="text-[10px] text-[#2457A6] font-bold">
                Spec: {item.dimensions}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
