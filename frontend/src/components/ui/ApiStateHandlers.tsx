import React from 'react';
import { RefreshCw, Database, Info, WifiOff } from 'lucide-react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ApiLoadingState: React.FC<{ message?: string }> = ({ message = 'Connecting to ANVESHA Backend...' }) => (
  <div className="p-8 editorial-card text-center font-sans">
    <RefreshCw className="w-6 h-6 text-[#A61B1B] animate-spin mx-auto mb-3" />
    <div className="text-sm font-serif font-bold text-[#111111]">{message}</div>
    <div className="text-xs font-mono text-[#777777] mt-1">Fetching verified backend research data...</div>
  </div>
);

export const ApiErrorState: React.FC<ErrorProps> = ({ message = 'ANVESHA API is currently unavailable.', onRetry }) => (
  <div className="p-8 editorial-card bg-[#FEF2F2] border-l-4 border-l-[#A61B1B] text-center font-sans">
    <WifiOff className="w-6 h-6 text-[#A61B1B] mx-auto mb-3" />
    <div className="text-sm font-serif font-bold text-[#A61B1B]">{message}</div>
    <div className="text-xs text-[#4B4B4B] mt-1 max-w-md mx-auto leading-relaxed font-sans">
      Unable to establish a connection with the ANVESHA backend server or process the response schema.
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-[#1A1A1A] hover:bg-[#A61B1B] text-white text-xs font-mono font-bold transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RETRY REQUEST</span>
      </button>
    )}
  </div>
);

export const ApiEmptyState: React.FC<{ title?: string; message?: string }> = ({
  title = 'No Data Available',
  message = 'No matching records were returned from the backend for the selected filters.',
}) => (
  <div className="p-8 editorial-card text-center font-sans">
    <Database className="w-6 h-6 text-[#777777] mx-auto mb-3" />
    <div className="text-sm font-serif font-bold text-[#111111] uppercase tracking-wide">{title}</div>
    <div className="text-xs font-sans text-[#4B4B4B] mt-1 max-w-md mx-auto leading-relaxed">{message}</div>
  </div>
);

export const InsufficientHistoryState: React.FC<{ district?: string }> = ({ district }) => (
  <div className="p-8 editorial-card bg-[#FFFBEB] border-l-4 border-l-[#B7791F] text-center font-sans">
    <Info className="w-6 h-6 text-[#B7791F] mx-auto mb-3" />
    <div className="text-xs font-mono font-bold text-[#B7791F] uppercase tracking-wider">
      FORECAST UNAVAILABLE: INSUFFICIENT HISTORICAL OBSERVATIONS
    </div>
    <div className="text-xs text-[#4B4B4B] mt-1.5 max-w-md mx-auto leading-relaxed font-sans">
      Not enough valid historical observations are available {district ? `for ${district}` : ''} to generate a reliable autoregressive forecast.
      ANVESHA requires at least 3 continuous pre-target years ($T-1, T-2, T-3$) without missing historical gaps.
    </div>
  </div>
);
