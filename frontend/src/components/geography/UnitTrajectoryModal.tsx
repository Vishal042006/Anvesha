import React from 'react';
import { X, ShieldAlert, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useAnalyticalContext } from '../../context/AnalyticalContext';

interface UnitTrajectoryModalProps {
  unitName: string;
  geographyId?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenProvenance?: () => void;
  recordedCrime?: number | null;
  breakYear?: number | null;
  currentRegime?: string | null;
  persistenceLabel?: string | null;
  lowerBound?: number | null;
  upperBound?: number | null;
}

export const UnitTrajectoryModal: React.FC<UnitTrajectoryModalProps> = ({
  unitName,
  geographyId = 'TN_PRECINCT',
  isOpen,
  onClose,
  onOpenProvenance,
  recordedCrime,
  breakYear,
  currentRegime,
  persistenceLabel,
  lowerBound,
  upperBound,
}) => {
  const { analysisData } = useAnalyticalContext();

  if (!isOpen) return null;

  const effectiveBreak = breakYear ?? (analysisData?.change_points?.[0]?.year ?? null);
  const effectiveRegime = currentRegime || (analysisData?.current_pattern?.status ? `${analysisData.current_pattern.status} Regime` : 'Active Regime');
  const effectivePersistence = persistenceLabel || (analysisData?.transition?.likelihood_continuation_pct ? `${analysisData.transition.likelihood_continuation_pct}% Continuation` : (analysisData?.transition?.evaluated_baseline_pct ? `${analysisData.transition.evaluated_baseline_pct}% Persistence` : 'Empirical Persistence'));
  const effectiveRecorded = recordedCrime ?? (analysisData?.current_pattern?.latest_cases ?? null);
  const effectiveLower = lowerBound ?? (analysisData?.forecast?.horizons?.[0]?.lower ?? null);
  const effectiveUpper = upperBound ?? (analysisData?.forecast?.horizons?.[0]?.upper ?? null);

  // Dynamic trajectory dataset derived from real historical series and forecast horizons
  const histPoints = analysisData?.historical_series || [];
  const forecastHorizons = analysisData?.forecast?.horizons || [];

  const timelineData = histPoints.length > 0
    ? [
        ...histPoints.map((pt: any) => ({
          year: pt.year,
          observed: pt.observed,
          forecast: null,
          lower: null,
          upper: null
        })),
        ...forecastHorizons.map((h: any) => ({
          year: h.year,
          observed: null,
          forecast: h.point,
          lower: h.lower,
          upper: h.upper
        }))
      ]
    : [
        ...(effectiveRecorded != null ? [{ year: 2023, observed: effectiveRecorded, forecast: effectiveRecorded, lower: effectiveRecorded, upper: effectiveRecorded }] : []),
        ...(effectiveLower != null && effectiveUpper != null ? [{ year: 2026, observed: null, forecast: Math.round((effectiveLower + effectiveUpper) / 2), lower: effectiveLower, upper: effectiveUpper }] : [])
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17202A]/50 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div className="bg-[#FFFFFF] border border-[#DCDDD8] rounded-xs shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#DCDDD8] bg-[#F8F8F5] flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#0B7F78] mb-1">
              <span className="bg-[#E7E8E4] px-2 py-0.5 rounded-xs font-bold text-[#17202A]">{geographyId}</span>
              <span>• POLICE UNIT TRAJECTORY CURVE</span>
            </div>
            <h2 className="text-2xl font-bold text-[#17202A] tracking-tight">{unitName}</h2>
            <p className="text-xs text-[#68727A] mt-1 font-sans">
              Observed Series • PELT Structural Discontinuity Analysis • Finite-Sample Conformal Bounds
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#68727A] hover:text-[#17202A] hover:bg-[#E7E8E4] rounded-xs transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#F8F8F5] p-3 border border-[#DCDDD8] rounded-xs">
              <div className="text-[10px] text-[#68727A] uppercase font-semibold">CURRENT REGIME</div>
              <div className="text-sm font-bold text-[#0B7F78] mt-0.5">{effectiveRegime}</div>
              <div className="text-[10px] text-[#9AA1A5] mt-0.5">{effectivePersistence}</div>
            </div>

            <div className="bg-[#F8F8F5] p-3 border border-[#DCDDD8] rounded-xs">
              <div className="text-[10px] text-[#68727A] uppercase font-semibold">RECORDED CRIME</div>
              <div className="text-sm font-bold text-[#17202A] mt-0.5">
                {effectiveRecorded != null ? Number(effectiveRecorded).toLocaleString() : '—'}
              </div>
              <div className="text-[10px] text-[#9AA1A5] mt-0.5">Verified Observation</div>
            </div>

            <div className="bg-[#F8ECEA] p-3 border border-[#8E3B3B]/30 rounded-xs">
              <div className="text-[10px] text-[#8E3B3B] uppercase font-bold">STRUCTURAL BREAK</div>
              <div className="text-sm font-bold text-[#8E3B3B] mt-0.5">
                {effectiveBreak != null ? `${effectiveBreak} Discontinuity` : 'No Break'}
              </div>
              <div className="text-[10px] text-[#8E3B3B]/80 mt-0.5">PELT / BOCPD Evaluated</div>
            </div>

            <div className="bg-[#F8F8F5] p-3 border border-[#DCDDD8] rounded-xs">
              <div className="text-[10px] text-[#68727A] uppercase font-semibold">CONFORMAL BOUNDS</div>
              <div className="text-sm font-bold text-[#0B7F78] mt-0.5">
                {effectiveLower != null && effectiveUpper != null ? `${Number(effectiveLower).toLocaleString()} – ${Number(effectiveUpper).toLocaleString()}` : '—'}
              </div>
              <div className="text-[10px] text-[#68727A] mt-0.5">95% Nominal Target</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white border border-[#DCDDD8] rounded-xs p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-[#DCDDD8] pb-2">
              <span className="font-bold text-[#17202A] flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-[#0B7F78]" />
                <span>OBSERVED VS FORECAST TRAJECTORY CURVE (2001–2030)</span>
              </span>
              <span className="text-[#68727A]">
                {effectiveBreak ? `PELT Structural Break: ${effectiveBreak}` : 'Continuous Trajectory'}
              </span>
            </div>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCDDD8" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#68727A' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#68727A' }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD8', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  {effectiveBreak && (
                    <ReferenceLine x={effectiveBreak} stroke="#8E3B3B" strokeWidth={2} strokeDasharray="4 4" label={{ value: `${effectiveBreak} Structural Break`, fill: '#8E3B3B', fontSize: 11, position: 'top' }} />
                  )}
                  <Line type="monotone" dataKey="observed" name="Observed Series" stroke="#17202A" strokeWidth={2.5} dot={{ r: 4 }} connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" name="Forecast Trajectory" stroke="#0B7F78" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls={false} />
                  <Line type="monotone" dataKey="lower" name="95% Lower Bound" stroke="#9AA1A5" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="upper" name="95% Upper Bound" stroke="#9AA1A5" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#68727A] pt-2 border-t border-[#DCDDD8]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-[#17202A]" />
                  <span>Observed</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-[#0B7F78] border-b border-dashed" />
                  <span>Forecast</span>
                </span>
                {effectiveBreak && (
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-[#8E3B3B] border-b border-dashed" />
                    <span>Structural Break</span>
                  </span>
                )}
              </div>
              <span>Conformal Target: 95% Coverage</span>
            </div>
          </div>

          {/* Provenance & Metadata */}
          <div className="bg-[#F8F8F5] border border-[#DCDDD8] rounded-xs p-4 space-y-3 font-mono text-xs">
            <div className="font-bold text-[#17202A] border-b border-[#DCDDD8] pb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-[#0B7F78]" />
                <span>DATA PROVENANCE & AUDIT TRAIL</span>
              </span>
              <button
                onClick={onOpenProvenance}
                className="text-[10px] text-[#0B7F78] hover:underline cursor-pointer"
              >
                Inspect Lineage Drawer →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#68727A]">Observed Series Source:</span>
                <span className="font-semibold text-[#17202A] ml-2">Official SCRB/NCRB Dataset</span>
              </div>
              <div>
                <span className="text-[#68727A]">Change-Point Method:</span>
                <span className="font-semibold text-[#17202A] ml-2">PELT + BOCPD (p &lt; 0.001)</span>
              </div>
              <div>
                <span className="text-[#68727A]">Regime Classifier:</span>
                <span className="font-semibold text-[#17202A] ml-2">Gaussian HMM (k=3 states)</span>
              </div>
              <div>
                <span className="text-[#68727A]">Forecast Model:</span>
                <span className="font-semibold text-[#0B7F78] ml-2">Naïve Lag-1 Persistence Baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCDDD8] bg-[#F8F8F5] flex justify-between items-center text-xs font-mono">
          <span className="text-[#68727A]">ANVESHA 2.0 • CRIME-SHIFT ENGINE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#17202A] text-white hover:bg-[#0B7F78] font-bold rounded-xs transition-all cursor-pointer"
          >
            Close Trajectory View
          </button>
        </div>
      </div>
    </div>
  );
};
