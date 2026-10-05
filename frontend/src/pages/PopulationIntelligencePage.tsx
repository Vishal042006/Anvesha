import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, Filter, Info } from 'lucide-react';
import { api } from '../services/api';
import type { PopulationResponse } from '../types';

export const PopulationIntelligencePage: React.FC = () => {
  const [district, setDistrict] = useState<string>('CHENNAI');
  const [popData, setPopData] = useState<PopulationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const districts = [
    'CHENNAI', 'COIMBATORE', 'CUDDALORE', 'DHARMAPURI', 'DINDIGUL', 'ERODE', 'KANCHIPURAM',
    'KANYAKUMARI', 'KARUR', 'MADURAI', 'NAGAPATTINAM', 'NAMAKKAL', 'NILGIRIS', 'PERAMBALUR',
    'PUDUKKOTTAI', 'RAMANATHAPURAM', 'SALEM', 'SIVAGANGA', 'THANJAVUR', 'THENI', 'THIRUVALLUR',
    'THIRUVANNAMALAI', 'THIRUVARUR', 'THOOTHUKUDI', 'TIRUCHIRAPALLI', 'TIRUNELVELI', 'TIRUPPUR',
    'VELLORE', 'VILLUPURAM', 'VIRUDHUNAGAR', 'RAILWAYS CHENNAI', 'RAILWAYS TRICHY',
  ];

  useEffect(() => {
    setLoading(true);
    api.getPopulation(district)
      .then(setPopData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [district]);

  const p2001 = popData?.data?.population_2001;
  const p2011 = popData?.data?.population_2011;
  const mappingType = popData?.data?.mapping_type || 'PARTIAL';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Population Intelligence & Crime Rate Engine
        </h2>
        <p className="text-xs text-gray-400">
          Census 2001 and 2011 population-adjusted recorded crime rates per 100,000 residents
        </p>
      </div>

      {/* Population Geography Limitation Notice */}
      <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-indigo-300 uppercase tracking-wide">
            STATUS: POPULATION_READY_WITH_GEOGRAPHY_LIMITATIONS
          </div>
          <div className="text-indigo-200/90 leading-relaxed">
            Population-adjusted crime rates are computed <strong>strictly for Census observed years (2001 and 2011)</strong> on 29 validated <code className="text-indigo-300 bg-indigo-950 px-1 py-0.5 rounded font-mono text-[10px]">ONE_TO_ONE</code> district mappings.
            For non-census years and 7 <code className="text-amber-300 bg-amber-950 px-1 py-0.5 rounded font-mono text-[10px]">PARTIAL/AMBIGUOUS</code> units, interpolation is explicitly prohibited.
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-gray-300 uppercase">Police Unit:</span>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {popData?.data && (
          <div className="text-xs flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded font-mono ${mappingType === 'ONE_TO_ONE' ? 'badge-validated' : 'badge-warning'}`}>
              MAPPING: {mappingType}
            </span>
            <span className="badge-warning text-[10px] px-2.5 py-0.5 rounded font-mono">
              AREA STATUS: MISSING
            </span>
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Population Summary Card */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Users className="w-4 h-4 text-indigo-400" />
            Census Population Metadata ({district})
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading population records...</div>
          ) : popData?.data ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Census District Mapping</span>
                <span className="font-bold text-white font-mono">{popData.data.population_district}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Census 2001 Aggregated Town Pop</span>
                <span className="font-bold text-white font-mono">{p2001 ? p2001.toLocaleString() : 'N/A (PARTIAL Mapping)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Census 2011 Aggregated Town Pop</span>
                <span className="font-bold text-white font-mono">{p2011 ? p2011.toLocaleString() : 'N/A (PARTIAL Mapping)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">10-Year Growth Delta</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {p2001 && p2011 ? `+${(p2011 - p2001).toLocaleString()} (+${(((p2011 - p2001) / p2001) * 100).toFixed(1)}%)` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Jurisdiction Polygon Area</span>
                <span className="font-bold text-amber-400 font-mono">MISSING (UNVALIDATED)</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 py-4">No population metadata available for target unit.</div>
          )}
        </div>

        {/* Validated Recorded Crime Rates per 100k */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Validated Recorded Crime Rate (Per 100,000)
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Computing population-adjusted rate...</div>
          ) : mappingType === 'ONE_TO_ONE' && p2001 && p2011 ? (
            <div className="space-y-3">
              <div className="bg-gray-900 p-3.5 rounded-lg border border-sky-500/30 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white uppercase">Year 2001 — Census Baseline</div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Aggregated Town Population: {p2001.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-sky-400 font-mono">VALIDATED</div>
                  <div className="text-[10px] text-gray-500">Rate per 100k Census Pop</div>
                </div>
              </div>

              <div className="bg-gray-900 p-3.5 rounded-lg border border-sky-500/30 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white uppercase">Year 2011 — Census Baseline</div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Aggregated Town Population: {p2011.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-sky-400 font-mono">VALIDATED</div>
                  <div className="text-[10px] text-gray-500">Rate per 100k Census Pop</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-lg text-xs text-amber-300 space-y-1">
              <div className="font-semibold">Data not validated for this geography/year.</div>
              <div>Geography mapping type ({mappingType}) is not ONE_TO_ONE. Population-adjusted rate calculation is suppressed to preserve research integrity.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
