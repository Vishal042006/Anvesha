import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { SectionId } from './components/layout/Sidebar';

import { OverviewPage } from './pages/OverviewPage';
import { CrimeAnalysisPage } from './pages/CrimeAnalysisPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { MapPage } from './pages/MapPage';
import { ResearchPage } from './pages/ResearchPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AboutModal } from './components/AboutModal';

export function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('overview');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/v1/health')
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const handleSelectSection = (section: SectionId) => {
    if (section === 'about') {
      setShowAboutModal(true);
    } else {
      setCurrentSection(section);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
      case 'command_center':
        return <OverviewPage onNavigate={handleSelectSection} />;

      case 'analysis':
      case 'forecast':
      case 'explain':
        return <CrimeAnalysisPage onNavigate={handleSelectSection} />;

      case 'anomalies':
        return <AnomaliesPage />;

      case 'map':
        return <MapPage />;

      case 'research':
      case 'data':
      case 'classification':
        return <ResearchPage />;

      case 'methodology':
        return <MethodologyPage />;

      default:
        return <OverviewPage onNavigate={handleSelectSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      {/* Compact Research Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-12">
        {renderSection()}
      </main>

      {/* About System & Scope Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  );
}

export default App;
