import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { SectionId } from './components/layout/Sidebar';

import { CommandCenterPage } from './pages/CommandCenterPage';
import { DataPage } from './pages/DataPage';
import { ClassificationPage } from './pages/ClassificationPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { ForecastPage } from './pages/ForecastPage';
import { MapPage } from './pages/MapPage';
import { ExplainPage } from './pages/ExplainPage';
import { ResearchPage } from './pages/ResearchPage';
import { MethodologyPage } from './pages/MethodologyPage';

export function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('command_center');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/health')
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'command_center':
        return <CommandCenterPage onNavigate={setCurrentSection} />;
      case 'data':
        return <DataPage />;
      case 'classification':
        return <ClassificationPage />;
      case 'anomalies':
        return <AnomaliesPage />;
      case 'forecast':
        return <ForecastPage />;
      case 'map':
        return <MapPage />;
      case 'explain':
        return <ExplainPage />;
      case 'research':
        return <ResearchPage />;
      case 'methodology':
        return <MethodologyPage />;
      default:
        return <CommandCenterPage onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      {/* Research Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        backendOnline={backendOnline}
      />

      {/* Main Research Content View */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-12">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
