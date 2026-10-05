import React, { useEffect, useRef } from 'react';
import { Map, Marker, Popup, NavigationControl, setWorkerUrl } from 'maplibre-gl';
// @ts-ignore
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SpatialFeatureProperties } from '../types';

setWorkerUrl(workerUrl);

interface MapLibreViewProps {
  selectedState?: string;
  selectedCategory?: string;
  selectedYear?: number;
  activeLayer?: 'observed' | 'forecast' | 'trend' | 'anomaly';
  units: SpatialFeatureProperties[];
  selectedUnit: SpatialFeatureProperties | null;
  onSelectUnit: (unit: SpatialFeatureProperties) => void;
}

export const MapLibreView: React.FC<MapLibreViewProps> = ({
  selectedState = 'All',
  units,
  selectedUnit,
  onSelectUnit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerLng = 78.9629;
    const centerLat = 20.5937;
    const defaultZoom = selectedState && selectedState !== 'All' ? 6.5 : 4.2;

    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [centerLng, centerLat],
      zoom: defaultZoom,
      attributionControl: false,
    });

    map.addControl(new NavigationControl(), 'top-right');
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedState]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !units.length) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    units.forEach((u) => {
      if (!u.latitude || !u.longitude) return;

      const isSelected = selectedUnit?.district === u.district;

      const el = document.createElement('div');
      el.className = `w-6 h-6 rounded-xs flex items-center justify-center font-mono font-bold text-[9px] cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#A61B1B] text-white border-2 border-[#1A1A1A] scale-125 z-30'
          : 'bg-[#FFFFFF] text-[#111111] border border-[#1A1A1A] hover:bg-[#F1F0EB] z-10'
      }`;
      el.innerText = u.district ? u.district.substring(0, 2).toUpperCase() : 'IN';

      const countVal = u.observed_volume ?? u.crime_count_2023 ?? 0;
      const popup = new Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="font-family: 'IBM Plex Mono', monospace; padding: 6px; font-size: 11px; color: #111111; background: #FFFFFF; border: 1px solid #1A1A1A;">
          <strong style="font-family: 'Playfair Display', serif; font-size: 13px;">${u.district}</strong><br/>
          <span style="color: #777777; font-size: 10px;">${u.state_ut || 'India'}</span><br/>
          <span style="color: #A61B1B; font-weight: bold;">${countVal.toLocaleString()} Incidents</span>
        </div>`
      );

      const marker = new Marker({ element: el })
        .setLngLat([u.longitude, u.latitude])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        onSelectUnit(u);
      });

      markersRef.current.push(marker);
    });
  }, [units, selectedUnit, onSelectUnit]);

  return (
    <div className="relative w-full h-[480px] border border-[#D8D6D0] bg-[#F8F7F3]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      <div className="absolute bottom-2 left-2 z-10 bg-[#FFFFFF] px-2.5 py-1 text-[10px] text-[#4B4B4B] border border-[#D8D6D0] font-mono">
        MapLibre GL • India Spatial Workspace
      </div>
    </div>
  );
};
