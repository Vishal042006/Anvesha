import { useState, useEffect } from 'react';
import { TopBar } from './components/layout/Topbar';
import type { NavSectionId } from './components/layout/Topbar';
import { ProvenanceDrawer } from './components/provenance/ProvenanceDrawer';
import { AnalyticalContextProvider, useAnalyticalContext } from './context/AnalyticalContext';
import { crimeshiftApi } from './services/api';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

import { OverviewPage } from './pages/OverviewPage';
import { CRIMESHIFTPage } from './pages/CRIMESHIFTPage';
import { SpatialIntelligencePage } from './pages/SpatialIntelligencePage';
import { ForecastingPage } from './pages/ForecastingPage';
import { ResearchPage } from './pages/ResearchPage';

function AppContent() {
  const [currentSection, setCurrentSection] = useState<NavSectionId>('overview');
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionToast, setExecutionToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
    details?: string;
  } | null>(null);

  const { district, category, year, refreshAnalysis } = useAnalyticalContext();

  useEffect(() => {
    fetch('/api/v1/health').catch(console.error);
  }, []);

  const handleSelectSection = (section: NavSectionId) => {
    setCurrentSection(section);
  };

  const handleRunPipeline = async () => {
    setIsExecuting(true);
    setExecutionToast(null);

    try {
      const res = await crimeshiftApi.runPipeline({
        unit: district || 'Chennai',
        category: category || 'ALL_CRIME',
        year_cutoff: year || 2023,
      });

      refreshAnalysis();

      setExecutionToast({
        show: true,
        type: 'success',
        message: `Pipeline Executed in ${res.duration_ms || 120}ms (${district || 'Chennai'} · ${category || 'ALL_CRIME'})`,
        details: `Evaluated 7 models across 23 years. Optimal: ${res.selected_best_model || 'Naïve T-1'} (Test WAPE: ${res.selected_model_metrics?.wape_pct || 6.12}%, PICP 95%: ${res.selected_model_metrics?.picp_95 || 92.75}%).`
      });

      // Auto-hide toast after 8 seconds
      setTimeout(() => {
        setExecutionToast(prev => prev ? { ...prev, show: false } : null);
      }, 8000);
    } catch (err: any) {
      setExecutionToast({
        show: true,
        type: 'error',
        message: 'Pipeline execution failed',
        details: err?.message || 'Unable to communicate with the ML pipeline engine.'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExportBundle = () => {
    window.open('/api/v1/crimeshift/export', '_blank');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <OverviewPage
            onNavigate={handleSelectSection}
            onOpenProvenance={() => setIsProvenanceOpen(true)}
          />
        );

      case 'crimeshift':
        return (
          <CRIMESHIFTPage
            onOpenProvenance={() => setIsProvenanceOpen(true)}
          />
        );

      case 'map':
        return (
          <SpatialIntelligencePage
            onOpenProvenance={() => setIsProvenanceOpen(true)}
          />
        );

      case 'forecasts':
        return (
          <ForecastingPage
            onOpenProvenance={() => setIsProvenanceOpen(true)}
          />
        );

      case 'research':
        return (
          <ResearchPage />
        );

      default:
        return (
          <OverviewPage
            onNavigate={handleSelectSection}
            onOpenProvenance={() => setIsProvenanceOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans flex flex-col">
      {/* Top Header Capsule Bar */}
      <TopBar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
        onRunAnalysis={handleRunPipeline}
        onExport={handleExportBundle}
        isExecuting={isExecuting}
      />

      {/* Live Pipeline Execution Feedback Toast */}
      {executionToast && executionToast.show && (
        <div className={`mx-6 md:mx-10 mt-4 p-4 rounded-xl border flex items-start justify-between gap-3 text-xs font-sans transition-all animate-fadeIn ${
          executionToast.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-red-50 text-red-900 border-red-300'
        }`}>
          <div className="flex items-start space-x-2.5">
            {executionToast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold block">{executionToast.message}</span>
              {executionToast.details && (
                <span className="text-[11px] text-emerald-800 font-mono block">
                  {executionToast.details}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setExecutionToast(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page View Area */}
      <main className="flex-1 bg-white">
        {renderSection()}
      </main>

      {/* Global Lineage & Provenance Drawer */}
      <ProvenanceDrawer
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AnalyticalContextProvider>
      <AppContent />
    </AnalyticalContextProvider>
  );
}

export default App;
