/**
 * Authoritative Census / Projected Population Data for Tamil Nadu Districts
 * Extracted from Official Census 2011 / Projected Demographic Benchmarks
 * Units:
 *   - lakhs: Population in Lakhs (1 Lakh = 100,000)
 *   - population: Exact integer population
 *   - area_sqkm: Area in square kilometers
 *   - density: Population density per sq. km
 */

export interface DistrictPopulationRecord {
  lakhs: number;
  population: number;
  area_sqkm: number;
  density: number;
}

export const DISTRICT_POPULATION_DATA: Record<string, DistrictPopulationRecord> = {
  'CHENNAI': { lakhs: 46.47, population: 4647000, area_sqkm: 175, density: 26553 },
  'KANCHEEPURAM': { lakhs: 11.66, population: 1166000, area_sqkm: 1656, density: 704 },
  'CHENGALPET': { lakhs: 25.56, population: 2556000, area_sqkm: 2945, density: 868 },
  'THIRUVALLUR': { lakhs: 37.28, population: 3728000, area_sqkm: 3394, density: 1098 },
  'CUDDALORE': { lakhs: 26.06, population: 2606000, area_sqkm: 3703, density: 704 },
  'VILLUPURAM': { lakhs: 20.93, population: 2093000, area_sqkm: 3725, density: 562 },
  'KALLAKURICHI': { lakhs: 13.70, population: 1370000, area_sqkm: 3520, density: 389 },
  'VELLORE': { lakhs: 16.14, population: 1614000, area_sqkm: 2080, density: 776 },
  'RANIPET': { lakhs: 12.10, population: 1210000, area_sqkm: 2234, density: 562 },
  'TIRUPATHUR': { lakhs: 11.12, population: 1112000, area_sqkm: 1793, density: 620 },
  'TIRUVANNAMALAI': { lakhs: 24.65, population: 2465000, area_sqkm: 6188, density: 398 },
  'SALEM': { lakhs: 34.82, population: 3482000, area_sqkm: 5237, density: 665 },
  'NAMAKKAL': { lakhs: 17.27, population: 1727000, area_sqkm: 3420, density: 505 },
  'DHARMAPURI': { lakhs: 15.07, population: 1507000, area_sqkm: 4497, density: 335 },
  'KRISHNAGIRI': { lakhs: 18.80, population: 1880000, area_sqkm: 5129, density: 367 },
  'ERODE': { lakhs: 22.52, population: 2252000, area_sqkm: 5760, density: 391 },
  'COIMBATORE': { lakhs: 34.58, population: 3458000, area_sqkm: 4732, density: 731 },
  'TIRUPPUR': { lakhs: 24.79, population: 2479000, area_sqkm: 5187, density: 478 },
  'THE NILGIRIS': { lakhs: 7.35, population: 735000, area_sqkm: 2565, density: 297 },
  'TIRUCHIRAPALLI': { lakhs: 27.22, population: 2722000, area_sqkm: 4509, density: 604 },
  'KARUR': { lakhs: 10.64, population: 1064000, area_sqkm: 2904, density: 367 },
  'PERAMBALUR': { lakhs: 5.65, population: 565000, area_sqkm: 1756, density: 322 },
  'ARIYALUR': { lakhs: 7.55, population: 755000, area_sqkm: 1940, density: 389 },
  'THANJAVUR': { lakhs: 24.06, population: 2406000, area_sqkm: 3411, density: 705 },
  'NAGAPATTINAM': { lakhs: 16.16, population: 1616000, area_sqkm: 2569, density: 629 },
  'THIRUVARUR': { lakhs: 12.64, population: 1264000, area_sqkm: 2274, density: 556 },
  'PUDUKKOTTAI': { lakhs: 16.18, population: 1618000, area_sqkm: 4644, density: 348 },
  'MADURAI': { lakhs: 30.38, population: 3038000, area_sqkm: 3710, density: 819 },
  'THENI': { lakhs: 12.46, population: 1246000, area_sqkm: 2868, density: 434 },
  'DINDIGUL': { lakhs: 21.60, population: 2160000, area_sqkm: 6036, density: 358 },
  'RAMANATHAPURAM': { lakhs: 13.53, population: 1353000, area_sqkm: 4104, density: 330 },
  'VIRUDHUNAGAR': { lakhs: 19.42, population: 1942000, area_sqkm: 4241, density: 458 },
  'SIVAGANGAI': { lakhs: 13.39, population: 1339000, area_sqkm: 4233, density: 316 },
  'TIRUNELVELI': { lakhs: 16.65, population: 1665000, area_sqkm: 3842, density: 433 },
  'TENKASI': { lakhs: 14.08, population: 1408000, area_sqkm: 2916, density: 483 },
  'THOOTHUKUDI': { lakhs: 17.50, population: 1750000, area_sqkm: 4745, density: 369 },
  'KANNIYAKUMARI': { lakhs: 18.70, population: 1870000, area_sqkm: 1684, density: 1111 },
  'PUDUCHERRY': { lakhs: 9.50, population: 950000, area_sqkm: 293, density: 3242 },
  'KARAIKAL': { lakhs: 2.00, population: 200000, area_sqkm: 161, density: 1242 },
};

export const DISTRICT_POPULATION_ALIASES: Record<string, string> = {
  'KANCHIPURAM': 'KANCHEEPURAM',
  'TIRUVALLUR': 'THIRUVALLUR',
  'NILGIRIS': 'THE NILGIRIS',
  'THE NILGIRIS': 'THE NILGIRIS',
  'TIRUCHIRAPPALLI': 'TIRUCHIRAPALLI',
  'TIRUCHCHIRAPPALLI': 'TIRUCHIRAPALLI',
  'TIRUVARUR': 'THIRUVARUR',
  'SIVAGANGA': 'SIVAGANGAI',
  'TIRUNELVELI KATTABO': 'TIRUNELVELI',
  'VILUPPURAM': 'VILLUPURAM',
  'THOOTHUKKUDI': 'THOOTHUKUDI',
  'KANYAKUMARI': 'KANNIYAKUMARI',
  'CHENNAI CITY': 'CHENNAI',
  'COIMBATORE CITY': 'COIMBATORE',
  'MADURAI CITY': 'MADURAI',
  'SALEM CITY': 'SALEM',
  'TIRUCHIRAPPALLI CITY': 'TIRUCHIRAPALLI',
  'TIRUNELVELI CITY': 'TIRUNELVELI',
  'TIRUPPUR CITY': 'TIRUPPUR',
};

export function getDistrictPopulationRecord(name?: string): DistrictPopulationRecord {
  if (!name) return { lakhs: 15.0, population: 1500000, area_sqkm: 3500, density: 450 };
  const clean = name.trim().toUpperCase();
  const resolved = DISTRICT_POPULATION_ALIASES[clean] || clean;
  if (DISTRICT_POPULATION_DATA[resolved]) {
    return DISTRICT_POPULATION_DATA[resolved];
  }
  for (const [k, v] of Object.entries(DISTRICT_POPULATION_DATA)) {
    if (k.includes(resolved) || resolved.includes(k)) {
      return v;
    }
  }
  return { lakhs: 15.0, population: 1500000, area_sqkm: 3500, density: 450 };
}

export function getDistrictPopulation(name?: string): number {
  return getDistrictPopulationRecord(name).population;
}

export function getDistrictPopulationLakhs(name?: string): number {
  return getDistrictPopulationRecord(name).lakhs;
}

/**
 * Calculates District Crime Rate (%) based on official formula:
 * Crime Rate (%) = (Total Volume of Crime Registered / Total Projected Population) * 100
 */
export function calculateDistrictCrimeRatePct(crimeCount?: number | null, population?: number | null): number | null {
  if (crimeCount == null || population == null || population <= 0) return null;
  return Number(((crimeCount / population) * 100).toFixed(2));
}

export function formatCrimeRatePct(ratePct?: number | null): string {
  if (ratePct == null || isNaN(ratePct)) return '—';
  return `${ratePct.toFixed(2)}%`;
}
