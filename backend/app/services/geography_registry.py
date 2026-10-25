"""
ANVESHA — CANONICAL GEOGRAPHY REGISTRY & CROSSWALK
===================================================
Provides authoritative reporting-unit canonicalization, deduplication,
and geographic crosswalk resolution for Tamil Nadu and India.
"""

from typing import Dict, List, Optional, Tuple, Any

# 1. Official Canonical Reporting Units for Tamil Nadu (38 District & City Police Units)
CANONICAL_TN_UNITS = [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kanchipuram",
    "Kanniyakumari",
    "Karaikal",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Perambalur",
    "Pudukkottai",
    "Puducherry",
    "Ramanathapuram",
    "Salem",
    "Sivagangai",
    "Thanjavur",
    "The Nilgiris",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Villupuram",
    "Virudhunagar"
]

CANONICAL_TN_RAILWAY_UNITS = [
    "Railway Chennai",
    "Railway Trichy"
]

# 2. Comprehensive Geography Crosswalk Table
# Maps any raw historical NCRB / dataset string to its canonical metadata
UNIT_CROSSWALK_MAP: Dict[str, Dict[str, str]] = {
    # Ariyalur
    "ARIYALUR": {"id": "GEO_TN_001", "display_name": "Ariyalur", "parent_district": "Ariyalur", "type": "District"},
    "ARIYALUR DISTRICT": {"id": "GEO_TN_001", "display_name": "Ariyalur", "parent_district": "Ariyalur", "type": "District"},
    
    # Chennai
    "CHENNAI": {"id": "GEO_TN_002", "display_name": "Chennai", "parent_district": "Chennai", "type": "Commissionerate"},
    "CHENNAI CITY": {"id": "GEO_TN_002", "display_name": "Chennai", "parent_district": "Chennai", "type": "Commissionerate"},
    
    # Coimbatore Rural & City
    "COIMBATORE": {"id": "GEO_TN_003", "display_name": "Coimbatore", "parent_district": "Coimbatore", "type": "District"},
    "COIMBATORE RURAL": {"id": "GEO_TN_003", "display_name": "Coimbatore", "parent_district": "Coimbatore", "type": "District"},
    "COIMBATORE URBAN": {"id": "GEO_TN_003", "display_name": "Coimbatore", "parent_district": "Coimbatore", "type": "District"},
    "COIMBATORE CITY": {"id": "GEO_TN_003", "display_name": "Coimbatore", "parent_district": "Coimbatore", "type": "District"},
    
    # Cuddalore
    "CUDDALORE": {"id": "GEO_TN_005", "display_name": "Cuddalore", "parent_district": "Cuddalore", "type": "District"},
    
    # Dharmapuri
    "DHARMAPURI": {"id": "GEO_TN_006", "display_name": "Dharmapuri", "parent_district": "Dharmapuri", "type": "District"},
    
    # Dindigul
    "DINDIGUL": {"id": "GEO_TN_007", "display_name": "Dindigul", "parent_district": "Dindigul", "type": "District"},
    
    # Erode
    "ERODE": {"id": "GEO_TN_008", "display_name": "Erode", "parent_district": "Erode", "type": "District"},
    
    # Kanchipuram
    "KANCHIPURAM": {"id": "GEO_TN_009", "display_name": "Kanchipuram", "parent_district": "Kancheepuram", "type": "District"},
    "KANCHEEPURAM": {"id": "GEO_TN_009", "display_name": "Kanchipuram", "parent_district": "Kancheepuram", "type": "District"},

    # Chengalpattu
    "CHENGALPATTU": {"id": "GEO_TN_004", "display_name": "Chengalpattu", "parent_district": "Chengalpattu", "type": "District"},
    "CHENGAI": {"id": "GEO_TN_004", "display_name": "Chengalpattu", "parent_district": "Chengalpattu", "type": "District"},
    "CHENNAISUBURBAN": {"id": "GEO_TN_004", "display_name": "Chengalpattu", "parent_district": "Chengalpattu", "type": "District"},
    
    # Kanniyakumari
    "KANNIYAKUMARI": {"id": "GEO_TN_010", "display_name": "Kanniyakumari", "parent_district": "Kanniyakumari", "type": "District"},
    "KANYAKUMARI": {"id": "GEO_TN_010", "display_name": "Kanniyakumari", "parent_district": "Kanniyakumari", "type": "District"},
    
    # Karaikal
    "KARAIKAL": {"id": "GEO_TN_039", "display_name": "Karaikal", "parent_district": "Karaikal", "type": "District"},
    "KARAIKAL DISTRICT": {"id": "GEO_TN_039", "display_name": "Karaikal", "parent_district": "Karaikal", "type": "District"},

    # Karur
    "KARUR": {"id": "GEO_TN_011", "display_name": "Karur", "parent_district": "Karur", "type": "District"},
    
    # Krishnagiri
    "KRISHNAGIRI": {"id": "GEO_TN_012", "display_name": "Krishnagiri", "parent_district": "Krishnagiri", "type": "District"},
    "KRISHNAGIRI DISTRICT": {"id": "GEO_TN_012", "display_name": "Krishnagiri", "parent_district": "Krishnagiri", "type": "District"},
    
    # Madurai Rural & City
    "MADURAI": {"id": "GEO_TN_013", "display_name": "Madurai", "parent_district": "Madurai", "type": "District"},
    "MADURAI RURAL": {"id": "GEO_TN_013", "display_name": "Madurai", "parent_district": "Madurai", "type": "District"},
    "MADURAI URBAN": {"id": "GEO_TN_013", "display_name": "Madurai", "parent_district": "Madurai", "type": "District"},
    "MADURAI CITY": {"id": "GEO_TN_013", "display_name": "Madurai", "parent_district": "Madurai", "type": "District"},
    
    # Nagapattinam & Mayiladuthurai
    "NAGAPATTINAM": {"id": "GEO_TN_015", "display_name": "Nagapattinam", "parent_district": "Nagapattinam", "type": "District"},
    "MAYILADUTHURAI": {"id": "GEO_TN_015", "display_name": "Nagapattinam", "parent_district": "Nagapattinam", "type": "District"},
    
    # Namakkal
    "NAMAKKAL": {"id": "GEO_TN_016", "display_name": "Namakkal", "parent_district": "Namakkal", "type": "District"},
    
    # Perambalur
    "PERAMBALUR": {"id": "GEO_TN_017", "display_name": "Perambalur", "parent_district": "Perambalur", "type": "District"},
    
    # Pudukkottai
    "PUDUKOTTAI": {"id": "GEO_TN_018", "display_name": "Pudukkottai", "parent_district": "Pudukkottai", "type": "District"},
    "PUDUKKOTTAI": {"id": "GEO_TN_018", "display_name": "Pudukkottai", "parent_district": "Pudukkottai", "type": "District"},
    
    # Puducherry / Pondicherry
    "PUDUCHERRY": {"id": "GEO_TN_040", "display_name": "Puducherry", "parent_district": "Puducherry", "type": "District"},
    "PUDUCHERRY DISTRICT": {"id": "GEO_TN_040", "display_name": "Puducherry", "parent_district": "Puducherry", "type": "District"},
    "PONDICHERRY": {"id": "GEO_TN_040", "display_name": "Puducherry", "parent_district": "Puducherry", "type": "District"},
    "PONDICHERRY DISTRICT": {"id": "GEO_TN_040", "display_name": "Puducherry", "parent_district": "Puducherry", "type": "District"},

    # Ramanathapuram
    "RAMNATHAPURAM": {"id": "GEO_TN_019", "display_name": "Ramanathapuram", "parent_district": "Ramanathapuram", "type": "District"},
    "RAMANATHAPURAM": {"id": "GEO_TN_019", "display_name": "Ramanathapuram", "parent_district": "Ramanathapuram", "type": "District"},
    
    # Salem Rural & City
    "SALEM": {"id": "GEO_TN_020", "display_name": "Salem", "parent_district": "Salem", "type": "District"},
    "SALEM RURAL": {"id": "GEO_TN_020", "display_name": "Salem", "parent_district": "Salem", "type": "District"},
    "SALEM URBAN": {"id": "GEO_TN_020", "display_name": "Salem", "parent_district": "Salem", "type": "District"},
    "SALEM CITY": {"id": "GEO_TN_020", "display_name": "Salem", "parent_district": "Salem", "type": "District"},
    
    # Sivagangai
    "SIVAGANGAI": {"id": "GEO_TN_022", "display_name": "Sivagangai", "parent_district": "Sivaganga", "type": "District"},
    "SIVAGANGA": {"id": "GEO_TN_022", "display_name": "Sivagangai", "parent_district": "Sivaganga", "type": "District"},
    
    # Thanjavur
    "THANJAVUR": {"id": "GEO_TN_023", "display_name": "Thanjavur", "parent_district": "Thanjavur", "type": "District"},
    
    # The Nilgiris
    "NILGIRIS": {"id": "GEO_TN_024", "display_name": "The Nilgiris", "parent_district": "Nilgiris", "type": "District"},
    "THE NILGIRIS": {"id": "GEO_TN_024", "display_name": "The Nilgiris", "parent_district": "Nilgiris", "type": "District"},
    
    # Theni
    "THENI": {"id": "GEO_TN_025", "display_name": "Theni", "parent_district": "Theni", "type": "District"},
    
    # Thoothukudi
    "THOOTHUGUDI": {"id": "GEO_TN_026", "display_name": "Thoothukudi", "parent_district": "Thoothukudi", "type": "District"},
    
    # Tiruchirappalli Rural & City
    "TRICHY": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TRICHY RURAL": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TIRUCHIRAPPALLI": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TIRUCHCHIRAPPALLI": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TRICHY URBAN": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TRICHY CITY": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    "TIRUCHIRAPPALLI CITY": {"id": "GEO_TN_027", "display_name": "Tiruchirappalli", "parent_district": "Tiruchchirappalli", "type": "District"},
    
    # Tirunelveli Rural & City
    "THIRUNELVELI": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "TIRUNELVELI": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "THIRUNELVELI RURAL": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "TENKASI": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "THIRUNELVELI URBAN": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "THIRUNELVELI CITY": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    "TIRUNELVELI CITY": {"id": "GEO_TN_029", "display_name": "Tirunelveli", "parent_district": "Tirunelveli Kattabo", "type": "District"},
    
    # Tiruppur District & City
    "TIRUPPUR": {"id": "GEO_TN_031", "display_name": "Tiruppur", "parent_district": "Tiruppur", "type": "District"},
    "TIRUPPUR CITY": {"id": "GEO_TN_031", "display_name": "Tiruppur", "parent_district": "Tiruppur", "type": "District"},
    "TIRUPPUR DISTRICT": {"id": "GEO_TN_031", "display_name": "Tiruppur", "parent_district": "Tiruppur", "type": "District"},
    
    # Tiruvallur
    "THIRUVALLUR": {"id": "GEO_TN_033", "display_name": "Tiruvallur", "parent_district": "Thiruvallur", "type": "District"},
    "TIRUVALLUR": {"id": "GEO_TN_033", "display_name": "Tiruvallur", "parent_district": "Thiruvallur", "type": "District"},
    
    # Tiruvannamalai
    "THIRUVANNAMALAI": {"id": "GEO_TN_034", "display_name": "Tiruvannamalai", "parent_district": "Tiruvannamalai", "type": "District"},
    "TIRUVANNAMALAI": {"id": "GEO_TN_034", "display_name": "Tiruvannamalai", "parent_district": "Tiruvannamalai", "type": "District"},
    
    # Tiruvarur
    "THIRUVARUR": {"id": "GEO_TN_035", "display_name": "Tiruvarur", "parent_district": "Thiruvarur", "type": "District"},
    "TIRUVARUR": {"id": "GEO_TN_035", "display_name": "Tiruvarur", "parent_district": "Thiruvarur", "type": "District"},
    
    # Vellore & Sub-units
    "VELLORE": {"id": "GEO_TN_036", "display_name": "Vellore", "parent_district": "Vellore", "type": "District"},
    "RANIPET": {"id": "GEO_TN_036", "display_name": "Vellore", "parent_district": "Vellore", "type": "District"},
    "TIRUPPATTUR": {"id": "GEO_TN_036", "display_name": "Vellore", "parent_district": "Vellore", "type": "District"},
    
    # Villupuram & Kallakurichi
    "VILLUPURAM": {"id": "GEO_TN_037", "display_name": "Villupuram", "parent_district": "Villupuram", "type": "District"},
    "VILUPPURAM": {"id": "GEO_TN_037", "display_name": "Villupuram", "parent_district": "Villupuram", "type": "District"},
    "KALLAKURICHI": {"id": "GEO_TN_037", "display_name": "Villupuram", "parent_district": "Villupuram", "type": "District"},
    
    # Virudhunagar
    "VIRUDHUNAGAR": {"id": "GEO_TN_038", "display_name": "Virudhunagar", "parent_district": "Virudhunagar", "type": "District"},
    
    # Railway Units
    "CHENNAI RLY.": {"id": "GEO_TN_RLY_01", "display_name": "Railway Chennai", "parent_district": "Chennai", "type": "Railway Police"},
    "RAILWAY CHENNAI": {"id": "GEO_TN_RLY_01", "display_name": "Railway Chennai", "parent_district": "Chennai", "type": "Railway Police"},
    "TRICHY RLY.": {"id": "GEO_TN_RLY_02", "display_name": "Railway Trichy", "parent_district": "Tiruchchirappalli", "type": "Railway Police"},
    "RAILWAY TRICHY": {"id": "GEO_TN_RLY_02", "display_name": "Railway Trichy", "parent_district": "Tiruchchirappalli", "type": "Railway Police"},
}

EXCLUDED_AGGREGATE_TOKENS = {
    "TOTAL", "ZZ TOTAL", "TOTAL DISTRICT(S)", "OTHER UNITS", "CYBER CELL",
    "ALL TAMIL NADU", "STATE TOTAL", "TOTAL CITIES"
}

def canonicalize_unit_name(raw_name: Optional[str]) -> Optional[Dict[str, str]]:
    """
    Canonicalize any raw reporting-unit string.
    Returns metadata dict or None if invalid/aggregate.
    """
    if not raw_name or not isinstance(raw_name, str):
        return None
        
    s = ' '.join(raw_name.upper().strip().split())
    if not s or s in EXCLUDED_AGGREGATE_TOKENS:
        return None
        
    if s in UNIT_CROSSWALK_MAP:
        return UNIT_CROSSWALK_MAP[s]
        
    # Title-case fallback if string is a valid non-aggregate name
    display = s.title()
    for canon in CANONICAL_TN_UNITS:
        if canon.upper() == s:
            display = canon
            break
            
    return {
        "id": f"GEO_TN_GEN_{s[:3]}",
        "display_name": display,
        "parent_district": display,
        "type": "District"
    }

def get_canonical_reporting_units(state_ut: Optional[str] = "TAMIL NADU", include_railways: bool = False) -> List[str]:
    """
    Returns the single clean list of canonical reporting units for dropdowns.
    Excludes TOTAL, ZZ TOTAL, and invalid aggregate rows.
    Guarantees no '... City' duplicate units are returned.
    """
    units = [u for u in CANONICAL_TN_UNITS if not u.lower().endswith(" city")]
    if include_railways:
        units.extend(CANONICAL_TN_RAILWAY_UNITS)
    return sorted(list(dict.fromkeys(units)))


# 3. Official Census / Projected District Population Data (from Official Benchmark Table)
# Source: Tamil Nadu District-wise Population (Lakhs), Area (Sq. Km), and Density
DISTRICT_POPULATION_DATA: Dict[str, Dict[str, Any]] = {
    "CHENNAI": {"pop_lakhs": 46.47, "population": 4647000, "area_sqkm": 175, "density": 26553},
    "KANCHEEPURAM": {"pop_lakhs": 11.66, "population": 1166000, "area_sqkm": 1656, "density": 704},
    "CHENGALPET": {"pop_lakhs": 25.56, "population": 2556000, "area_sqkm": 2945, "density": 868},
    "THIRUVALLUR": {"pop_lakhs": 37.28, "population": 3728000, "area_sqkm": 3394, "density": 1098},
    "CUDDALORE": {"pop_lakhs": 26.06, "population": 2606000, "area_sqkm": 3703, "density": 704},
    "VILLUPURAM": {"pop_lakhs": 20.93, "population": 2093000, "area_sqkm": 3725, "density": 562},
    "KALLAKURICHI": {"pop_lakhs": 13.70, "population": 1370000, "area_sqkm": 3520, "density": 389},
    "VELLORE": {"pop_lakhs": 16.14, "population": 1614000, "area_sqkm": 2080, "density": 776},
    "RANIPET": {"pop_lakhs": 12.10, "population": 1210000, "area_sqkm": 2234, "density": 562},
    "TIRUPATHUR": {"pop_lakhs": 11.12, "population": 1112000, "area_sqkm": 1793, "density": 620},
    "TIRUVANNAMALAI": {"pop_lakhs": 24.65, "population": 2465000, "area_sqkm": 6188, "density": 398},
    "SALEM": {"pop_lakhs": 34.82, "population": 3482000, "area_sqkm": 5237, "density": 665},
    "NAMAKKAL": {"pop_lakhs": 17.27, "population": 1727000, "area_sqkm": 3420, "density": 505},
    "DHARMAPURI": {"pop_lakhs": 15.07, "population": 1507000, "area_sqkm": 4497, "density": 335},
    "KRISHNAGIRI": {"pop_lakhs": 18.80, "population": 1880000, "area_sqkm": 5129, "density": 367},
    "ERODE": {"pop_lakhs": 22.52, "population": 2252000, "area_sqkm": 5760, "density": 391},
    "COIMBATORE": {"pop_lakhs": 34.58, "population": 3458000, "area_sqkm": 4732, "density": 731},
    "TIRUPPUR": {"pop_lakhs": 24.79, "population": 2479000, "area_sqkm": 5187, "density": 478},
    "THE NILGIRIS": {"pop_lakhs": 7.35, "population": 735000, "area_sqkm": 2565, "density": 297},
    "TIRUCHIRAPALLI": {"pop_lakhs": 27.22, "population": 2722000, "area_sqkm": 4509, "density": 604},
    "KARUR": {"pop_lakhs": 10.64, "population": 1064000, "area_sqkm": 2904, "density": 367},
    "PERAMBALUR": {"pop_lakhs": 5.65, "population": 565000, "area_sqkm": 1756, "density": 322},
    "ARIYALUR": {"pop_lakhs": 7.55, "population": 755000, "area_sqkm": 1940, "density": 389},
    "THANJAVUR": {"pop_lakhs": 24.06, "population": 2406000, "area_sqkm": 3411, "density": 705},
    "NAGAPATTINAM": {"pop_lakhs": 16.16, "population": 1616000, "area_sqkm": 2569, "density": 629},
    "THIRUVARUR": {"pop_lakhs": 12.64, "population": 1264000, "area_sqkm": 2274, "density": 556},
    "PUDUKKOTTAI": {"pop_lakhs": 16.18, "population": 1618000, "area_sqkm": 4644, "density": 348},
    "MADURAI": {"pop_lakhs": 30.38, "population": 3038000, "area_sqkm": 3710, "density": 819},
    "THENI": {"pop_lakhs": 12.46, "population": 1246000, "area_sqkm": 2868, "density": 434},
    "DINDIGUL": {"pop_lakhs": 21.60, "population": 2160000, "area_sqkm": 6036, "density": 358},
    "RAMANATHAPURAM": {"pop_lakhs": 13.53, "population": 1353000, "area_sqkm": 4104, "density": 330},
    "VIRUDHUNAGAR": {"pop_lakhs": 19.42, "population": 1942000, "area_sqkm": 4241, "density": 458},
    "SIVAGANGAI": {"pop_lakhs": 13.39, "population": 1339000, "area_sqkm": 4233, "density": 316},
    "TIRUNELVELI": {"pop_lakhs": 16.65, "population": 1665000, "area_sqkm": 3842, "density": 433},
    "TENKASI": {"pop_lakhs": 14.08, "population": 1408000, "area_sqkm": 2916, "density": 483},
    "THOOTHUKUDI": {"pop_lakhs": 17.50, "population": 1750000, "area_sqkm": 4745, "density": 369},
    "KANNIYAKUMARI": {"pop_lakhs": 18.70, "population": 1870000, "area_sqkm": 1684, "density": 1111},
    "PUDUCHERRY": {"pop_lakhs": 9.50, "population": 950000, "area_sqkm": 293, "density": 3242},
    "KARAIKAL": {"pop_lakhs": 2.00, "population": 200000, "area_sqkm": 161, "density": 1242},
}

# Population Alias Crosswalk
POPULATION_ALIASES: Dict[str, str] = {
    "KANCHIPURAM": "KANCHEEPURAM",
    "TIRUVALLUR": "THIRUVALLUR",
    "NILGIRIS": "THE NILGIRIS",
    "THE NILGIRIS": "THE NILGIRIS",
    "TIRUCHIRAPPALLI": "TIRUCHIRAPALLI",
    "TIRUCHCHIRAPPALLI": "TIRUCHIRAPALLI",
    "TIRUVARUR": "THIRUVARUR",
    "SIVAGANGA": "SIVAGANGAI",
    "TIRUNELVELI KATTABO": "TIRUNELVELI",
    "VILUPPURAM": "VILLUPURAM",
    "THOOTHUKKUDI": "THOOTHUKUDI",
    "KANYAKUMARI": "KANNIYAKUMARI",
    "CHENNAI CITY": "CHENNAI",
    "COIMBATORE CITY": "COIMBATORE",
    "MADURAI CITY": "MADURAI",
    "SALEM CITY": "SALEM",
    "TIRUCHIRAPPALLI CITY": "TIRUCHIRAPALLI",
    "TIRUNELVELI CITY": "TIRUNELVELI",
    "TIRUPPUR CITY": "TIRUPPUR",
}

def get_district_population_record(unit_name: Optional[str]) -> Dict[str, Any]:
    """Resolves full population metadata (pop_lakhs, population, area_sqkm, density) for any district."""
    if not unit_name:
        return {"pop_lakhs": 15.0, "population": 1500000, "area_sqkm": 3500, "density": 450}
    clean_key = unit_name.strip().upper()
    resolved_key = POPULATION_ALIASES.get(clean_key, clean_key)
    if resolved_key in DISTRICT_POPULATION_DATA:
        return DISTRICT_POPULATION_DATA[resolved_key]
    # Substring search fallback
    for k, v in DISTRICT_POPULATION_DATA.items():
        if k in resolved_key or resolved_key in k:
            return v
    return {"pop_lakhs": 15.0, "population": 1500000, "area_sqkm": 3500, "density": 450}

def get_district_population(unit_name: Optional[str]) -> int:
    """Returns integer total population for a district."""
    return get_district_population_record(unit_name)["population"]

def get_district_population_lakhs(unit_name: Optional[str]) -> float:
    """Returns population in Lakhs for a district."""
    return get_district_population_record(unit_name)["pop_lakhs"]

def calculate_crime_rate_pct(crime_count: Optional[float], population: Optional[int]) -> Optional[float]:
    """
    Official Crime Rate formula:
    District Crime Rate (%) = (Total Volume of Crime Registered / Total Projected Population) * 100
    """
    if crime_count is None or population is None or population <= 0:
        return None
    return round((float(crime_count) / float(population)) * 100.0, 3)
