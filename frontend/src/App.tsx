import { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { SectionId } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ExplorePage } from './pages/ExplorePage';
import { CrimeAnalysisPage } from './pages/CrimeAnalysisPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { SpatialIntelligencePage } from './pages/SpatialIntelligencePage';
import { EvidencePage } from './pages/EvidencePage';
import { DataProvenancePage } from './pages/DataProvenancePage';
import { ResearchReportPage } from './pages/ResearchReportPage';
import { AboutModal } from './components/AboutModal';
import { districtApi, healthApi } from './services/api';
import type { SummaryResponse } from './types';

export function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('explore');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedUnit, setSelectedUnit] = useState<string>('Pune');
  const [selectedCategory, setSelectedCategory] = useState<string>('ipc_total');
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check API health & load summary telemetry
    healthApi.getHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));

    districtApi.getSummary()
      .then((data) => {
        setSummary(data);
        setBackendOnline(true);
      })
      .catch((err) => {
        console.error('Error connecting to ANVESHA API:', err);
        setBackendOnline(false);
      });
  }, []);

  const handleSelectSection = (sec: SectionId) => {
    if (sec === 'about') {
      setIsAboutOpen(true);
    } else {
      setCurrentSection(sec);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'explore':
        return (
          <ExplorePage
            selectedState={selectedState}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
            onSelectState={setSelectedState}
            onSelectUnit={setSelectedUnit}
            onSelectCategory={setSelectedCategory}
            onSelectYear={setSelectedYear}
            onNavigate={setCurrentSection}
          />
        );
      case 'analyze':
        return (
          <CrimeAnalysisPage
            selectedState={selectedState}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
          />
        );
      case 'forecast':
        return (
          <ForecastingPage
            selectedState={selectedState}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
          />
        );
      case 'map':
        return (
          <SpatialIntelligencePage
            selectedState={selectedState}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
            onSelectUnit={setSelectedUnit}
          />
        );
      case 'evidence':
        return <EvidencePage />;
      case 'data_methods':
        return <DataProvenancePage />;
      case 'research':
        return <ResearchReportPage />;
      default:
        return (
          <ExplorePage
            selectedState={selectedState}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
            onSelectState={setSelectedState}
            onSelectUnit={setSelectedUnit}
            onSelectCategory={setSelectedCategory}
            onSelectYear={setSelectedYear}
            onNavigate={setCurrentSection}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F7F3] text-[#111111] font-sans overflow-hidden selection:bg-[#A61B1B] selection:text-white">
      {/* Editorial Navigation Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        backendOnline={backendOnline}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <Topbar
          selectedState={selectedState}
          onSelectState={setSelectedState}
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          summary={summary}
          backendOnline={backendOnline}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto bg-[#F8F7F3] pb-12">
          {renderSection()}
        </main>
      </div>

      {/* Ethics & Governance Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        summary={summary}
      />
    </div>
  );
}

export default App;
