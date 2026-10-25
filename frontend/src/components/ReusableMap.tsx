import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Map, NavigationControl, setWorkerUrl, Popup } from 'maplibre-gl';
// @ts-ignore
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { spatialApi } from '../services/api';
import { getDistrictPopulationRecord, calculateDistrictCrimeRatePct } from '../utils/population';

setWorkerUrl(workerUrl);

// Tamil Nadu State Bounding Box [west, south, east, north]
const TAMIL_NADU_BOUNDS: [[number, number], [number, number]] = [
  [76.13, 8.08], // Southwest (Kanyakumari / Nilgiris)
  [80.35, 13.55]  // Northeast (Chennai / Tiruvallur)
];

interface ReusableMapProps {
  selectedCategory?: string;
  selectedLayer?: 'observed' | 'rate' | 'anomaly' | 'forecast' | 'concern' | 'error';
  selectedForecastYear?: number;
  selectedUnit?: string | null;
  onSelectUnit?: (unitName: string) => void;
  mapMode?: 'units' | 'intensity';
  showStations?: boolean;
  height?: string;
  onLegendChange?: (minVal: number, maxVal: number, unitLabel: string) => void;
}

export const ReusableMap: React.FC<ReusableMapProps> = ({
  selectedCategory = 'ALL_CRIME',
  selectedLayer = 'observed',
  selectedForecastYear = 2023,
  selectedUnit = null,
  onSelectUnit,
  mapMode = 'units',
  showStations = false,
  height = '520px',
  onLegendChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const hoverPopupRef = useRef<Popup | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [stationGeoJson, setStationGeoJson] = useState<any>(null);

  // Compute stats for dynamic choropleth scaling and legend
  const stats = useMemo(() => {
    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
      return { min: 0, median: 0, max: 0, p20: 0, p40: 0, p60: 0, p80: 0, label: 'RECORDED CRIME' };
    }

    const getVal = (f: any) => {
      const p = f.properties || {};
      if (selectedLayer === 'rate') return Number(p.crime_rate_pct ?? p.crime_rate_per_100k ?? 0);
      if (selectedLayer === 'forecast') return Number(p.forecast_value ?? 0);
      return Number(p.crime_count ?? p.observed_2023 ?? 0);
    };

    const vals = geoJsonData.features
      .map(getVal)
      .filter((v: number) => !isNaN(v) && v > 0);

    if (vals.length === 0) {
      return { min: 0, median: 0, max: 0, p20: 0, p40: 0, p60: 0, p80: 0, label: 'RECORDED CRIME' };
    }

    const sorted = [...vals].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const p20 = sorted[Math.floor(sorted.length * 0.20)];
    const p40 = sorted[Math.floor(sorted.length * 0.40)];
    const p60 = sorted[Math.floor(sorted.length * 0.60)];
    const p80 = sorted[Math.floor(sorted.length * 0.80)];

    const label = selectedLayer === 'rate'
      ? 'DISTRICT CRIME RATE (%)'
      : (selectedLayer === 'forecast' ? `${selectedForecastYear} FORECAST VOLUME` : `RECORDED CRIME (${selectedForecastYear})`);

    return { min, median, max, p20, p40, p60, p80, label };
  }, [geoJsonData, selectedLayer, selectedForecastYear]);

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      bounds: TAMIL_NADU_BOUNDS,
      fitBoundsOptions: { padding: 35 },
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Fetch Spatial Polygon GeoJSON
  useEffect(() => {
    spatialApi.getSpatialCrime('TAMIL NADU', selectedCategory, selectedForecastYear, selectedLayer)
      .then((data: any) => {
        if (data && data.features) {
          setGeoJsonData(data);

          if (onLegendChange) {
            const getVal = (f: any) => {
              const p = f.properties || {};
              if (selectedLayer === 'rate') return Number(p.crime_rate_per_100k ?? 0);
              if (selectedLayer === 'forecast') return Number(p.forecast_value ?? 0);
              return Number(p.crime_count ?? p.observed_2023 ?? 0);
            };
            const vals = data.features.map(getVal).filter((v: number) => !isNaN(v) && v > 0);
            if (vals.length > 0) {
              const minV = Math.min(...vals);
              const maxV = Math.max(...vals);
              const label = selectedLayer === 'rate' ? 'CRIME RATE / 100k' : selectedLayer === 'observed' ? 'OBSERVED VOLUME' : 'FORECAST VOLUME';
              onLegendChange(minV, maxV, label);
            }
          }
        }
      })
      .catch(console.error);
  }, [selectedCategory, selectedLayer, selectedForecastYear]);

  // 3. Fetch Police Stations GeoJSON (only when enabled)
  useEffect(() => {
    if (showStations) {
      spatialApi.getPoliceStations()
        .then((data: any) => {
          if (data && data.features) {
            setStationGeoJson(data);
          }
        })
        .catch(console.error);
    }
  }, [showStations]);

  // 4. Update Map Layers & Styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !geoJsonData) return;

    const sourceId = 'tn-districts-source';
    const centroidSourceId = 'tn-centroids-source';
    const fillLayerId = 'tn-districts-fill';
    const borderLayerId = 'tn-districts-border';
    const labelsLayerId = 'tn-districts-labels';
    const selectedBorderLayerId = 'tn-districts-selected-border';
    const heatmapLayerId = 'tn-crime-heatmap';
    
    const stationSourceId = 'police-stations-source';
    const clusterLayerId = 'police-stations-clusters';
    const clusterCountLayerId = 'police-stations-cluster-count';
    const unclusteredLayerId = 'police-stations-unclustered';

    const cleanSelectedUnit = (selectedUnit || '').trim().toUpperCase();

    // Prepare Centroid Point features for Heatmap mode
    const centroidFeatures = (geoJsonData.features || [])
      .filter((f: any) => {
        const p = f.properties || {};
        return (p.lon || p.centroid_lon) && (p.lat || p.centroid_lat);
      })
      .map((f: any) => {
        const p = f.properties || {};
        const lon = p.lon ?? p.centroid_lon;
        const lat = p.lat ?? p.centroid_lat;
        const count = selectedLayer === 'rate'
          ? (p.crime_rate_per_100k ?? 100)
          : (selectedLayer === 'forecast' ? (p.forecast_value ?? 1000) : (p.crime_count ?? p.observed_2023 ?? 1000));
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lon, lat] },
          properties: { ...p, metric_val: count }
        };
      });

    const centroidData = {
      type: 'FeatureCollection',
      features: centroidFeatures
    };

    // Build dynamic choropleth color expression based on metric distribution
    const valAccessor = selectedLayer === 'rate'
      ? ['coalesce', ['get', 'crime_rate_pct'], ['get', 'crime_rate_per_100k'], 0]
      : (selectedLayer === 'forecast'
          ? ['coalesce', ['get', 'forecast_value'], 0]
          : ['coalesce', ['get', 'crime_count'], ['get', 'observed_2023'], 0]);

    const { min, p20, p40, p60, p80, max } = stats;

    // Beautiful high-clarity sequential choropleth color palette: Teal -> Amber -> Crimson
    const dynamicFillColor: any = min < max ? [
      'interpolate',
      ['linear'],
      valAccessor,
      min,               '#CCFBF1', // Teal 100 - Lowest
      Math.max(min + 1, p20), '#5EEAD4', // Teal 300
      Math.max(min + 2, p40), '#0D9488', // Teal 600 - Median
      Math.max(min + 3, p60), '#F59E0B', // Amber 500 - Elevated
      Math.max(min + 4, p80), '#EA580C', // Orange 600 - High
      max,               '#991B1B'  // Crimson 800 - Highest
    ] : '#0D9488';

    const updateMap = () => {
      // 1. Manage Districts Polygon Source
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as any).setData(geoJsonData);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData,
        });

        // Layer 1: Polygon Choropleth Fill
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': dynamicFillColor,
            'fill-opacity': 0.65,
          },
        });

        // Layer 2: District Boundaries Line
        map.addLayer({
          id: borderLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#334155',
            'line-width': 1.2,
          },
        });

        // Layer 2b: Highlighted Selected District Border Line
        map.addLayer({
          id: selectedBorderLayerId,
          type: 'line',
          source: sourceId,
          filter: ['==', ['upcase', ['to-string', ['get', 'district']]], cleanSelectedUnit],
          paint: {
            'line-color': '#0F172A',
            'line-width': 3.5,
          },
        });

        // Manage Centroid Source for single-point district labels and heatmap
        if (!map.getSource(centroidSourceId)) {
          map.addSource(centroidSourceId, {
            type: 'geojson',
            data: centroidData
          });
        }

        // Layer 2c: District Name Labels on Centroid Points (guarantees exactly 1 label per district)
        map.addLayer({
          id: labelsLayerId,
          type: 'symbol',
          source: centroidSourceId,
          layout: {
            'text-field': ['get', 'display_name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              6, 9.5,
              8, 11.5,
              12, 14
            ],
            'text-anchor': 'center',
            'text-allow-overlap': false,
            'text-ignore-placement': false,
          },
          paint: {
            'text-color': '#0F172A',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2.0,
          }
        });

        // District Hover & Click Handlers
        map.on('mousemove', fillLayerId, (e) => {
          if (!e.features || !e.features.length) return;
          map.getCanvas().style.cursor = 'pointer';

          const feat = e.features[0];
          const p = feat.properties || {};
          const dName = p.display_name || p.district || p.reporting_unit || 'District';
          const crimeCnt = p.crime_count ?? p.observed_2023 ?? null;
          const popRec = getDistrictPopulationRecord(dName);
          const popInt = p.population || popRec.population;
          const popLakhs = p.population_lakhs || popRec.lakhs;

          // Official Crime Rate Formula: (Total Volume of Crime / Total Population) * 100
          let ratePct: number | null = null;
          if (p.crime_rate_pct != null) {
            ratePct = Number(p.crime_rate_pct);
          } else if (typeof crimeCnt === 'number' && popInt > 0) {
            ratePct = calculateDistrictCrimeRatePct(crimeCnt, popInt);
          }
          const rateDisplay = ratePct != null ? `${ratePct.toFixed(2)}%` : (p.crime_rate_per_100k != null ? `${p.crime_rate_per_100k} / 100k` : 'N/A');
          const forecastVal = p.forecast_value != null ? Number(p.forecast_value).toLocaleString() : 'N/A';

          if (!hoverPopupRef.current) {
            hoverPopupRef.current = new Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 12
            });
          }

          const tooltipHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px 8px; font-size: 11px; color: #0F172A; min-width: 140px;">
              <div style="font-weight: 700; font-size: 13px; color: #111827; margin-bottom: 4px; border-bottom: 1px solid #E2E8F0; padding-bottom: 2px;">
                ${dName}
              </div>
              <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 3px;">
                <span style="color: #64748B;">Incidents (${selectedForecastYear}):</span>
                <span style="font-weight: 700; color: #0F172A;">${typeof crimeCnt === 'number' ? crimeCnt.toLocaleString() : '—'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 2px;">
                <span style="color: #64748B;">Rate:</span>
                <span style="font-weight: 700; color: #0D9488;">${rateDisplay}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 2px;">
                <span style="color: #64748B;">Population:</span>
                <span style="font-weight: 600; color: #475569;">${popLakhs} Lakhs</span>
              </div>
              ${selectedForecastYear >= 2026 || selectedLayer === 'forecast' ? `
                <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 2px;">
                  <span style="color: #64748B;">Forecast:</span>
                  <span style="font-weight: 600; color: #2563EB;">${forecastVal}</span>
                </div>
              ` : ''}
              <div style="margin-top: 5px; font-size: 9px; color: #94A3B8; text-transform: uppercase; font-weight: 600;">
                Click to inspect district
              </div>
            </div>
          `;

          hoverPopupRef.current
            .setLngLat(e.lngLat)
            .setHTML(tooltipHtml)
            .addTo(map);
        });

        map.on('mouseleave', fillLayerId, () => {
          map.getCanvas().style.cursor = '';
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
        });

        map.on('click', fillLayerId, (e) => {
          if (!e.features || !e.features.length) return;
          const feat = e.features[0];
          const props = feat.properties || {};
          const unitName = (props.display_name || props.district || props.reporting_unit || '').toUpperCase();

          if (onSelectUnit && unitName) {
            onSelectUnit(unitName);
          }
        });
      }

      // Update fill color dynamically on data / layer changes
      if (map.getLayer(fillLayerId)) {
        map.setPaintProperty(fillLayerId, 'fill-color', dynamicFillColor);
        map.setPaintProperty(fillLayerId, 'fill-opacity', 0.65);
      }

      // Manage Centroid Source for single-point district labels
      if (map.getSource(centroidSourceId)) {
        (map.getSource(centroidSourceId) as any).setData(centroidData);
      } else {
        map.addSource(centroidSourceId, {
          type: 'geojson',
          data: centroidData
        });
      }

      // Remove any legacy heatmap layer
      if (map.getLayer(heatmapLayerId)) {
        map.removeLayer(heatmapLayerId);
      }

      // Ensure choropleth layers and district labels are visible
      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(fillLayerId, 'visibility', 'visible');
      }
      if (map.getLayer(borderLayerId)) {
        map.setLayoutProperty(borderLayerId, 'visibility', 'visible');
      }
      if (map.getLayer(labelsLayerId)) {
        map.setLayoutProperty(labelsLayerId, 'visibility', 'visible');
      }

      // 3. Manage Police Stations Layer (Cleanly clustered, hidden by default)
      if (showStations && stationGeoJson) {
        if (map.getSource(stationSourceId)) {
          (map.getSource(stationSourceId) as any).setData(stationGeoJson);
        } else {
          map.addSource(stationSourceId, {
            type: 'geojson',
            data: stationGeoJson,
            cluster: true,
            clusterMaxZoom: 15,
            clusterRadius: 35
          });

          // Layer A: Cluster Circles
          map.addLayer({
            id: clusterLayerId,
            type: 'circle',
            source: stationSourceId,
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#3B82F6', 10,
                '#1D4ED8', 30,
                '#1E3A8A'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                13, 10,
                17, 30,
                22
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF'
            }
          });

          // Layer B: Cluster Count Labels
          map.addLayer({
            id: clusterCountLayerId,
            type: 'symbol',
            source: stationSourceId,
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 11
            },
            paint: {
              'text-color': '#FFFFFF'
            }
          });

          // Layer C: Individual Unclustered Point Markers
          map.addLayer({
            id: unclusteredLayerId,
            type: 'circle',
            source: stationSourceId,
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-radius': 5,
              'circle-color': '#1D4ED8',
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#FFFFFF'
            }
          });

          // Click Cluster to Zoom In
          map.on('click', clusterLayerId, (e) => {
            const feats = map.queryRenderedFeatures(e.point, { layers: [clusterLayerId] });
            if (!feats.length) return;
            const clusterId = feats[0].properties.cluster_id;
            (map.getSource(stationSourceId) as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err) return;
              map.easeTo({
                center: (feats[0].geometry as any).coordinates,
                zoom: zoom
              });
            });
          });

          // Click Individual Station Point to Show Popup
          map.on('click', unclusteredLayerId, (e) => {
            if (!e.features || !e.features.length) return;
            const feat = e.features[0];
            const p = feat.properties || {};
            const html = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 6px; font-size: 11px; color: #0F172A;">
                <div style="font-weight: 700; color: #1D4ED8; font-size: 11px; text-transform: uppercase;">POLICE STATION</div>
                <div style="font-weight: 700; font-size: 13px; margin: 2px 0;">${p.station_name || p.canonical_station_name || 'Station'}</div>
                <div><strong>District:</strong> ${p.district || p.reporting_unit || 'Tamil Nadu'}</div>
                <div><strong>Type:</strong> ${p.station_type || 'General'}</div>
              </div>
            `;
            new Popup({ offset: 8 })
              .setLngLat(e.lngLat)
              .setHTML(html)
              .addTo(map);
          });
        }

        const vis = showStations ? 'visible' : 'none';
        if (map.getLayer(clusterLayerId)) map.setLayoutProperty(clusterLayerId, 'visibility', vis);
        if (map.getLayer(clusterCountLayerId)) map.setLayoutProperty(clusterCountLayerId, 'visibility', vis);
        if (map.getLayer(unclusteredLayerId)) map.setLayoutProperty(unclusteredLayerId, 'visibility', vis);
      } else {
        const vis = 'none';
        if (map.getLayer(clusterLayerId)) map.setLayoutProperty(clusterLayerId, 'visibility', vis);
        if (map.getLayer(clusterCountLayerId)) map.setLayoutProperty(clusterCountLayerId, 'visibility', vis);
        if (map.getLayer(unclusteredLayerId)) map.setLayoutProperty(unclusteredLayerId, 'visibility', vis);
      }

      // Update Selected District Border Filter
      if (map.getLayer(selectedBorderLayerId)) {
        map.setFilter(selectedBorderLayerId, ['==', ['upcase', ['to-string', ['get', 'district']]], cleanSelectedUnit]);
      }
    };

    if (map.isStyleLoaded()) {
      updateMap();
    } else {
      map.once('style.load', updateMap);
    }
  }, [geoJsonData, stationGeoJson, selectedForecastYear, selectedLayer, mapMode, showStations, selectedUnit, stats, onSelectUnit]);

  return (
    <div className="relative w-full border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#F8FAFC]" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Viewport Info Pill (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#CBD5E1] text-[10px] font-mono text-[#475569] shadow-xs flex items-center space-x-2">
        <span className="font-semibold text-[#0D9488]">● 38 DISTRICTS</span>
        <span className="text-[#94A3B8]">|</span>
        <span>CHOROPLETH MAP</span>
        {showStations && (
          <>
            <span className="text-[#94A3B8]">|</span>
            <span className="text-[#1D4ED8] font-bold">1,730 STATIONS OVERLAY</span>
          </>
        )}
      </div>

      {/* Floating Thematic Legend Card (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#CBD5E1] text-xs font-sans text-[#1E293B] shadow-md max-w-[260px]">
        <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
          {stats.label}
        </div>
        <div className="h-2.5 w-full rounded-full overflow-hidden bg-gradient-to-r from-[#CCFBF1] via-[#0D9488] via-[#F59E0B] via-[#EA580C] to-[#991B1B] border border-[#CBD5E1]" />
        <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-[#475569] mt-1">
          <span>{stats.min.toLocaleString()}</span>
          <span className="text-[#64748B] font-normal">Med: {stats.median.toLocaleString()}</span>
          <span className="text-[#991B1B] font-bold">{stats.max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
