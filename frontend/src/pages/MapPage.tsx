import React from 'react';
import { SpatialIntelligencePage } from './SpatialIntelligencePage';

interface MapPageProps {
  onOpenProvenance?: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onOpenProvenance }) => {
  return <SpatialIntelligencePage onOpenProvenance={onOpenProvenance} />;
};

export default MapPage;
