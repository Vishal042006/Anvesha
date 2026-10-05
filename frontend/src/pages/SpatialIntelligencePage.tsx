import React, { useEffect, useState } from 'react';
import { AlertTriangle, Layers, RefreshCw } from 'lucide-react';
import { spatialApi, forecastApi, populationApi } from '../services/api';
import type { SpatialFeatureProperties, ForecastResponse, PopulationResponse } from '../types';
import { ApiLoadingState, ApiErrorState, ApiEmptyState } from '../components/ui/ApiStateHandlers';
import { MapLibreView } from '../components/MapLibreView';

interface SpatialIntelligencePageProps {
  selectedState?: string;
  selectedUnit: string;
  selectedCategory: string;
  selectedYear: number;
  onSelectUnit: (unit: string) => void;
}

export const SpatialIntelligencePage: React.FC<SpatialIntelligencePageProps> = ({
  selectedState = 'All',
  selectedUnit: globalSelectedUnit,
  selectedCategory,
  selectedYear,
  onSelectUnit,
}) => {
  const [spatialUnits, setSpatialUnits] = useState<SpatialFeatureProperties[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<SpatialFeatureProperties | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [popData, setPopData] = useState<PopulationResponse | null>(null);
  const [activeLayer, setActiveLayer] = useState<'observed' | 'forecast' | 'trend' | 'anomaly'>('observed');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchSpatialData = () => {
    setLoading(true);
    setError(false);
    spatialApi
      .getSpatialCrime(selectedState === 'All' ? undefined : selectedState, selectedCategory, selectedYear, activeLayer)
      .then((res) => {
        if (res.features?.length) {
          const propsList = res.features.map((f) => f.properties);
          setSpatialUnits(propsList);
          const matched = propsList.find((u) => u.district.toUpperCase() === globalSelectedUnit.toUpperCase());
          setSelectedUnit(matched || propsList[0]);
        }
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching spatial crime data:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpatialData();
  }, [selectedState, selectedCategory, selectedYear, activeLayer]);

  useEffect(() => {
    if (selectedUnit) {
      onSelectUnit(selectedUnit.district);

      forecastApi
        .getForecast(selectedUnit.district, selectedCategory, selectedYear)
        .then(setForecast)
        .catch(console.error);

      populationApi
        .getPopulation(selectedUnit.district)
        .then(setPopData)
        .catch(console.error);
    }
  }, [selectedUnit]);

  if (loading) return <ApiLoadingState message="Loading MapLibre spatial layers from backend..." />;
  if (error) return <ApiErrorState message="Unable to load spatial data from ANVESHA backend." onRetry={fetchSpatialData} />;

  const population2011 = popData?.data?.population_2011 || popData?.data?.population || 0;
  const crimeCount = selectedUnit?.observed_volume || selectedUnit?.crime_count_2023 || 0;
  const crimeRatePer100k = population2011 > 0 ? ((crimeCount / population2011) * 100000).toFixed(1) : '—';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#111111] font-sans selection:bg-[#A61B1B] selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1A1A] pb-4 gap-4">
        <div>
          <div className="text-xs font-mono text-[#A61B1B] font-bold tracking-wider uppercase mb-1">
            INDIA SPATIAL WORKSPACE / MAP
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#111111] tracking-tight flex items-center gap-2">
            MAP WORKSPACE ({selectedState})
          </h1>
          <p className="text-xs text-[#4B4B4B] font-sans mt-1">
            Official India district boundary polygons, observed crime volume, forecasts, trends, and unusual changes.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="badge-observed">DISTRICTS: {spatialUnits.length} UNITS</span>
          <span className="badge-derived">MAPLIBRE LIGHT VECTOR</span>
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div className="editorial-card p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#777777] uppercase font-bold">SELECT MAP LAYER:</span>
          <button
            onClick={() => setActiveLayer('observed')}
            className={`px-3 py-1 font-bold border transition-colors cursor-pointer ${activeLayer === 'observed' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0]'}`}
          >
            1. OBSERVED VOLUME
          </button>
          <button
            onClick={() => setActiveLayer('forecast')}
            className={`px-3 py-1 font-bold border transition-colors cursor-pointer ${activeLayer === 'forecast' ? 'bg-[#A61B1B] text-white border-[#A61B1B]' : 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0]'}`}
          >
            2. FORECAST LAYER
          </button>
          <button
            onClick={() => setActiveLayer('trend')}
            className={`px-3 py-1 font-bold border transition-colors cursor-pointer ${activeLayer === 'trend' ? 'bg-[#2457A6] text-white border-[#2457A6]' : 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0]'}`}
          >
            3. TREND DIRECTION
          </button>
          <button
            onClick={() => setActiveLayer('anomaly')}
            className={`px-3 py-1 font-bold border transition-colors cursor-pointer ${activeLayer === 'anomaly' ? 'bg-[#B7791F] text-white border-[#B7791F]' : 'bg-[#F1F0EB] text-[#111111] border-[#D8D6D0]'}`}
          >
            4. UNUSUAL CHANGES
          </button>
        </div>

        <div className="text-[11px] text-[#4B4B4B]">
          {activeLayer === 'forecast' ? 'Forecast layer represents modelled aggregate volume estimates.' : 'Observed layer displays official recorded figures.'}
        </div>
      </div>

      {/* Spatial Centroid Location Notice */}
      <div className="editorial-card p-4 border-l-4 border-l-[#B7791F] space-y-1">
        <div className="font-mono font-bold text-[#B7791F] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          APPROXIMATE REPORTING-UNIT LOCATION
        </div>
        <p className="text-[#4B4B4B] text-xs font-sans leading-relaxed">
          "Approximate reporting-unit location" — Official district geometry polygons are displayed. Choropleth boundary extrapolation is suppressed to prevent ecological spatial bias. Statistical anomaly ≠ evidence of individual wrongdoing.
        </p>
      </div>

      {/* Main Map & Side Intelligence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#111111]" />
              <h3 className="font-serif font-bold text-sm text-[#111111] uppercase tracking-wide">
                India District Spatial Boundaries ({selectedState})
              </h3>
            </div>
            <button
              onClick={fetchSpatialData}
              className="p-1 font-mono text-xs text-[#777777] hover:text-[#111111] border border-[#D8D6D0] cursor-pointer"
              title="Refresh Map"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <MapLibreView
            selectedState={selectedState}
            selectedCategory={selectedCategory}
            selectedYear={selectedYear}
            activeLayer={activeLayer}
            units={spatialUnits}
            selectedUnit={selectedUnit}
            onSelectUnit={(u) => setSelectedUnit(u)}
          />
        </div>

        {/* Selected Unit Side Intelligence Drawer */}
        <div className="editorial-card p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-3">
            <h3 className="font-serif font-bold text-base text-[#111111] uppercase">
              AREA INTELLIGENCE
            </h3>
            <span className={selectedYear <= 2014 ? "badge-observed" : "badge-synthetic"}>
              {selectedYear <= 2014 ? "OFFICIAL OBSERVED" : "SYNTHETIC GAP-FILL"}
            </span>
          </div>

          {selectedUnit ? (
            <div className="space-y-4">
              <div className="p-3 bg-[#F1F0EB] border border-[#D8D6D0] space-y-1">
                <div className="text-[10px] text-[#777777] uppercase font-bold">DISTRICT NAME</div>
                <div className="text-lg font-serif font-bold text-[#111111]">{selectedUnit.district}</div>
                <div className="text-[10px] text-[#4B4B4B]">
                  State: {selectedUnit.state_ut || selectedState} | GeoID: {selectedUnit.geo_id || 'IN_ADM2'}
                </div>
              </div>

              <div className="space-y-2 divide-y divide-[#D8D6D0]">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#777777]">OBSERVED VOLUME ({selectedYear}):</span>
                  <span className="font-bold text-[#111111]">{crimeCount ? crimeCount.toLocaleString() : '—'}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-[#777777]">TREND DIRECTION:</span>
                  <span className={`font-bold ${selectedUnit.trend === 'INCREASING' ? 'text-[#A61B1B]' : selectedUnit.trend === 'DECREASING' ? 'text-[#26734D]' : 'text-[#B7791F]'}`}>
                    {selectedUnit.trend || 'STABLE'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-[#777777]">CENSUS POPULATION:</span>
                  <span className="font-bold text-[#111111]">{population2011 > 0 ? population2011.toLocaleString() : 'Unavailable'}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-[#777777]">CRIME RATE (/ 100k):</span>
                  <span className="font-bold text-[#A61B1B]">{crimeRatePer100k}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-[#777777]">ANOMALY STATUS:</span>
                  <span className={`font-bold ${selectedUnit.anomaly_status === 'UNUSUAL TRAJECTORY' ? 'text-[#B7791F]' : 'text-[#26734D]'}`}>
                    {selectedUnit.anomaly_status || 'NORMAL TRAJECTORY'}
                  </span>
                </div>

                {forecast && (
                  <div className="pt-2">
                    <div className="text-[10px] text-[#777777] uppercase mb-1 font-bold">MODEL FORECAST ({forecast.prediction_year}):</div>
                    <div className="p-2.5 bg-[#F1F0EB] border border-[#D8D6D0] flex justify-between items-center">
                      <span className="text-[#4B4B4B] text-[11px] font-sans">{forecast.model}:</span>
                      <span className="font-bold text-[#A61B1B]">
                        {forecast.predicted_count !== null && forecast.predicted_count !== undefined ? forecast.predicted_count.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ApiEmptyState title="No District Selected" message="Click a district on the map or select one in topbar to inspect area intelligence." />
          )}
        </div>
      </div>
    </div>
  );
};
