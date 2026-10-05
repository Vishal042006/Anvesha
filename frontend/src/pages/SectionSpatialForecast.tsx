import React, { useEffect, useState } from 'react';
import { MapPin, Info, Layers, TrendingUp, Users, Filter, ArrowUpRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { SpatialFeatureProperties, ForecastResponse, PopulationResponse } from '../types';
import { MapLibreView } from '../components/MapLibreView';

export const SectionSpatialForecast: React.FC = () => {
  const [spatialUnits, setSpatialUnits] = useState<SpatialFeatureProperties[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<SpatialFeatureProperties | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>('PROPERTY_CRIME');
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [popData, setPopData] = useState<PopulationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getSpatialSummary()
      .then((res) => {
        if (res.features) {
          const propsList = res.features.map((f) => f.properties);
          setSpatialUnits(propsList);
          if (propsList.length > 0) setSelectedUnit(propsList[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      api.getForecast(selectedUnit.district, targetCategory)
        .then(setForecast)
        .catch(console.error);

      api.getPopulation(selectedUnit.district)
        .then(setPopData)
        .catch(console.error);
    }
  }, [selectedUnit, targetCategory]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-[#17243B]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4EAF1]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#2457A7]" />
            Map & Forecasts
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Explore geography, compare reporting-unit locations, and view validated next-year forecasts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-[#64748B] font-medium border border-slate-200">
            36 Tamil Nadu Police Units
          </span>
        </div>
      </div>

      {/* Location Disclaimer Tooltip Notice */}
      <div className="p-4 bg-slate-50 border border-[#E4EAF1] rounded-xl flex items-start gap-3 text-xs text-[#64748B]">
        <Info className="w-4 h-4 text-[#2457A7] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#17243B]">Geographic Note: </span>
          Location markers represent approximate reporting-unit positions. Historical jurisdiction boundaries are not available for all units.
        </div>
      </div>

      {/* Main Map + Selected Location Panel Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Tamil Nadu Map */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4 flex flex-col justify-between min-h-[540px]">
          <div className="flex justify-between items-center border-b border-[#E4EAF1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2457A7]" />
                Tamil Nadu Police Units Map
              </h3>
              <p className="text-xs text-[#64748B]">Click a location marker to inspect statistics & forecasts</p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              36 UNITS
            </span>
          </div>

          {/* Interactive Tamil Nadu MapLibre Map Canvas */}
          <div className="relative w-full h-[480px] bg-[#F8FAFC] rounded-xl border border-[#E4EAF1] overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#64748B]">
                Loading Tamil Nadu map locations...
              </div>
            ) : (
              <MapLibreView
                units={spatialUnits}
                selectedUnit={selectedUnit}
                onSelectUnit={setSelectedUnit}
              />
            )}
          </div>
        </div>

        {/* Right Column: Selected-Location Analysis Panel */}
        <div className="bg-white p-5 rounded-xl border border-[#E4EAF1] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#E4EAF1] pb-3 mb-4">
              <span className="text-[10px] font-bold text-[#087F8C] uppercase tracking-wide">SELECTED LOCATION</span>
              <h2 className="text-lg font-bold text-[#17243B]">
                {selectedUnit ? (selectedUnit.name || selectedUnit.district) : 'Select a Unit'}
              </h2>
              {selectedUnit && (
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Centroid: {selectedUnit.latitude.toFixed(4)}°N, {selectedUnit.longitude.toFixed(4)}°E
                </p>
              )}
            </div>

            {selectedUnit ? (
              <div className="space-y-4 text-xs">
                {/* Category Dropdown Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#17243B] uppercase flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-[#2457A7]" /> Target Category:
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E4EAF1] text-[#17243B] text-xs rounded-lg p-2 font-semibold focus:ring-2 focus:ring-[#2457A7]"
                  >
                    <option value="PROPERTY_CRIME">PROPERTY & GRAVE CRIME</option>
                    <option value="VIOLENT_CRIME">VIOLENT CRIME</option>
                    <option value="CRIME_AGAINST_WOMEN">CRIME AGAINST WOMEN</option>
                    <option value="CRIME_AGAINST_CHILDREN">CRIME AGAINST CHILDREN</option>
                    <option value="TOTAL_IPC">TOTAL IPC CRIMES</option>
                  </select>
                </div>

                {/* Next-Year Forecast Card (Plain-Language, No Model Jargon) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-[#E4EAF1] space-y-2">
                  <div className="flex justify-between items-center text-[#2457A7] font-bold uppercase text-[11px]">
                    <span>Crime Forecast</span>
                    <TrendingUp className="w-4 h-4 text-[#2457A7]" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-[#17243B] font-mono">
                      {forecast?.predicted_count !== null && forecast?.predicted_count !== undefined ? forecast.predicted_count.toLocaleString() : '...'}
                      <span className="text-xs font-sans font-normal text-[#64748B] ml-1.5">estimated incidents</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Based on available historical observations.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E4EAF1] space-y-1">
                    <div className="text-[11px] font-semibold text-[#17243B]">Contributing Historical Drivers:</div>
                    <ul className="text-[11px] text-[#64748B] space-y-0.5 list-disc list-inside">
                      <li>Previous 3-year baseline trend momentum</li>
                      <li>Recent year-over-year rate of change</li>
                      <li>Validated regional population density context</li>
                    </ul>
                  </div>
                </div>

                {/* Population Context Card */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E4EAF1] space-y-2">
                  <div className="flex justify-between items-center text-[#17243B] font-bold text-[11px]">
                    <span>Census Population Context</span>
                    <Users className="w-4 h-4 text-[#087F8C]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-[#E4EAF1]">
                      <div className="text-[10px] text-[#64748B]">2001 Census</div>
                      <div className="font-bold text-[#17243B]">
                        {popData?.data?.population_2001 ? popData.data.population_2001.toLocaleString() : 'N/A'}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-[#E4EAF1]">
                      <div className="text-[10px] text-[#64748B]">2011 Census</div>
                      <div className="font-bold text-[#17243B]">
                        {popData?.data?.population_2011 ? popData.data.population_2011.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#64748B] flex justify-between pt-1 font-mono">
                    <span>Mapping Status:</span>
                    <span className="font-bold text-[#2457A7]">{popData?.data?.mapping_type || 'PARTIAL'}</span>
                  </div>
                </div>

                {/* Related Documentary Evidence Link */}
                <div className="p-3 bg-white border border-[#E4EAF1] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-[#64748B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#087F8C]" />
                    <span>Search SCRB PDF evidence for this unit</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#2457A7]" />
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#64748B] text-center py-8">Select a police unit from the map.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
