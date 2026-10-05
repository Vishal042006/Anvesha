import React, { useEffect, useState } from 'react';
import { Layers, MapPin, Info } from 'lucide-react';
import { spatialApi, policeStationsApi } from '../services/api';
import { MapLibreView } from '../components/MapLibreView';

export const MapPage: React.FC = () => {
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('observed');
  const [showPoliceStations, setShowPoliceStations] = useState<boolean>(true);

  useEffect(() => {
    spatialApi
      .getSpatialCrime('TAMIL NADU', 'TOTAL_IPC', 2023, activeLayer)
      .then((res) => {
        if (res?.features?.length) {
          const props = res.features.map((f: any) => f.properties);
          setGeoFeatures(props);
          setSelectedUnit(props[0]);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    policeStationsApi
      .getPoliceStations()
      .then((res) => {
        if (res?.features?.length) {
          // stations loaded
        }
      })
      .catch(console.error);
  }, [activeLayer]);

  const layersList = [
    { id: 'observed', label: '1. Crime Count', desc: 'Observed aggregate crime volume' },
    { id: 'rate', label: '2. Crime Rate', desc: 'Population-normalized per 100,000' },
    { id: 'hotspot', label: '3. Hotspots', desc: 'Observed crime intensity quantiles' },
    { id: 'anomaly', label: '4. Anomalies', desc: 'Isolation Forest anomaly severity' },
    { id: 'forecast', label: '5. Forecast', desc: 'Next-year aggregate prediction' },
    { id: 'forecast_concern', label: '6. Forecast Concern', desc: 'Model-derived indication level' },
    { id: 'forecast_error', label: '7. Forecast Error', desc: 'Historical model residual error' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#0F172A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-[#2563EB] font-bold tracking-wider uppercase mb-1">
            PAGE 6 — TAMIL NADU GEOSPATIAL INTELLIGENCE MAP
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-[#2563EB]" />
            <span>Tamil Nadu GIS & Police Station Layer</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Academic cartography displaying district boundaries, police station reference markers, observed hotspots, and aggregate forecast concern.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#1E40AF] font-bold rounded-xs">
            40 DISTRICT UNITS
          </span>
          <span className="px-2.5 py-1 bg-[#F0FDF4] text-[#166534] font-bold rounded-xs">
            791 POLICE STATIONS
          </span>
        </div>
      </div>

      {/* Map Control Bar */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          <span className="font-bold text-[#0F172A]">SELECT MAP LAYER:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {layersList.map((lyr) => (
            <button
              key={lyr.id}
              onClick={() => setActiveLayer(lyr.id)}
              className={`px-2.5 py-1 rounded-xs cursor-pointer transition-all border ${
                activeLayer === lyr.id
                  ? 'bg-[#1E3A8A] text-white font-bold border-[#1E3A8A]'
                  : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-[#EFF6FF]'
              }`}
            >
              {lyr.label}
            </button>
          ))}
        </div>

        <label className="flex items-center space-x-2 cursor-pointer font-mono font-bold text-xs">
          <input
            type="checkbox"
            checked={showPoliceStations}
            onChange={(e) => setShowPoliceStations(e.target.checked)}
            className="rounded-xs text-[#2563EB]"
          />
          <span>Show 791 Police Stations</span>
        </label>
      </div>

      {/* Map & Detail Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 border border-[#E2E8F0] rounded-sm overflow-hidden bg-white shadow-xs">
          <MapLibreView
            selectedState="TAMIL NADU"
            units={geoFeatures}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
          />
        </div>

        {/* Selected Unit Details Panel */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-sm shadow-xs space-y-4">
          {selectedUnit ? (
            <>
              <div className="border-b border-[#E2E8F0] pb-3">
                <span className="text-[10px] font-mono font-bold text-[#2563EB] tracking-wider uppercase">
                  REPORTING UNIT DETAILS
                </span>
                <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">{selectedUnit.district || selectedUnit.reporting_unit}</h2>
                <p className="text-xs text-[#64748B] font-mono">State: Tamil Nadu • Data Source: NCRB / SCRB</p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Observed Crime:</span>
                  <span className="font-bold text-[#0F172A]">{selectedUnit.observed_count || selectedUnit.observed_volume || '—'}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Crime Rate / 100k:</span>
                  <span className="font-bold text-[#0F172A]">{selectedUnit.crime_rate_per_100k || '—'}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Recent YoY Trend:</span>
                  <span className="font-bold text-[#2563EB]">{selectedUnit.trend_pct ? `+${selectedUnit.trend_pct}%` : '—'}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Anomaly Status:</span>
                  <span className="font-bold text-[#D97706]">{selectedUnit.anomaly_status || 'NORMAL'}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Next-Year Forecast:</span>
                  <span className="font-bold text-[#166534]">{selectedUnit.forecast_next_year || '—'}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <span className="text-[#64748B]">Forecast Concern:</span>
                  <span className="font-bold text-[#1E3A8A]">{selectedUnit.forecast_concern || 'MODERATE'}</span>
                </div>
              </div>

              <div className="bg-[#EFF6FF] p-3 rounded-xs border border-[#BFDBFE] text-xs space-y-1">
                <div className="font-bold text-[#1E40AF] font-mono flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>POLICE STATION CONTEXT</span>
                </div>
                <p className="text-[11px] text-[#1E3A8A]">
                  Police station markers represent reference locations. Crime data is reported at the subdivision reporting-unit level.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-[#64748B] font-mono">
              Click a district unit on the map to inspect metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
