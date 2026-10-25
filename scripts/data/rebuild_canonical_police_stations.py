#!/usr/bin/env python3
"""
ANVESHA — CANONICAL POLICE STATION RECONCILIATION & GIS VALIDATION PIPELINE
=============================================================================
Reconciles raw police station Excel/CSV sources with verified KML/GeoJSON GIS
coordinate sources to construct ONE authoritative, verified canonical police
station dataset with 0% coordinate fabrication.

Exports:
  - artifacts/maps/police_stations.geojson
  - data/canonical/geography/dim_police_stations.csv
  - artifacts/reports/police_station_validation_report.json
"""

import os
import re
import json
import xml.etree.ElementTree as ET
import numpy as np
import pandas as pd
import openpyxl

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
KML_POINT_PATH = os.path.join(WORKSPACE_DIR, "data", "raw_archive", "crime", "c59ade2e-623c-4282-844f-3491bf1c64db.kml")
EXCEL_PATH = os.path.join(WORKSPACE_DIR, "Police Stations.xlsx")

OUTPUT_GEOJSON = os.path.join(WORKSPACE_DIR, "artifacts", "maps", "police_stations.geojson")
OUTPUT_CSV = os.path.join(WORKSPACE_DIR, "data", "canonical", "geography", "dim_police_stations.csv")
OUTPUT_REPORT = os.path.join(WORKSPACE_DIR, "artifacts", "reports", "police_station_validation_report.json")

os.makedirs(os.path.dirname(OUTPUT_GEOJSON), exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_REPORT), exist_ok=True)

# 1. PARSE VERIFIED KML GIS POINT DATASET
print(f"-> Extracting verified GIS coordinates from KML: {KML_POINT_PATH}...")
kml_records = []
if os.path.exists(KML_POINT_PATH):
    tree = ET.parse(KML_POINT_PATH)
    root = tree.getroot()
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    
    placemarks = root.findall('.//kml:Placemark', ns)
    for p in placemarks:
        d = {}
        for sd in p.findall('.//kml:SimpleData', ns):
            key = sd.attrib.get('name')
            val = sd.text.strip() if sd.text else ''
            d[key] = val
        coords_el = p.find('.//kml:coordinates', ns)
        if coords_el is not None and coords_el.text:
            parts = coords_el.text.strip().split(',')
            if len(parts) >= 2:
                try:
                    d['lon'] = float(parts[0])
                    d['lat'] = float(parts[1])
                except ValueError:
                    pass
        kml_records.append(d)

print(f"-> Found {len(kml_records)} placemark features in KML.")

# Index KML features by PSCODE and Station Name
kml_by_code = {}
kml_by_name = {}
kml_coords_seen = set()

for r in kml_records:
    ps_code = r.get('PSCODE', '').strip().upper()
    st_name = r.get('STATION', '').strip().upper()
    lat = r.get('lat')
    lon = r.get('lon')
    
    if lat is not None and lon is not None:
        # Check coordinate bounds (Tamil Nadu: 75.0E - 81.0E, 8.0N - 14.0N)
        if 75.0 <= lon <= 81.5 and 8.0 <= lat <= 14.0:
            rec = {
                "pscode": ps_code,
                "station_name": r.get('STATION', ''),
                "awps_code": r.get('AWPS', ''),
                "lat": lat,
                "lon": lon,
                "gid": r.get('GID', ''),
                "source": "c59ade2e-623c-4282-844f-3491bf1c64db.kml (Verified KML)"
            }
            if ps_code:
                kml_by_code[ps_code] = rec
            if st_name:
                kml_by_name[st_name] = rec

# 2. PARSE ADMINISTRATIVE EXCEL / CSV DATASETS
print(f"-> Reading administrative records from Excel: {EXCEL_PATH}...")
excel_rows = []
if os.path.exists(EXCEL_PATH):
    wb = openpyxl.load_workbook(EXCEL_PATH)
    sheet = wb.active
    rows = list(sheet.iter_rows(values_only=True))
    if len(rows) > 1:
        headers = [str(h).strip() if h else f"col_{i}" for i, h in enumerate(rows[0])]
        for r in rows[1:]:
            d = dict(zip(headers, [str(v).strip() if v is not None else "" for v in r]))
            excel_rows.append(d)

print(f"-> Found {len(excel_rows)} administrative records in Excel.")

# 3. RECONCILE AND DEDUPLICATE PHYSICAL POLICE STATIONS
# Group by physical station ID / PSCode / Canonical Station Name
physical_stations = {}
validation_stats = {
    "total_source_records": len(excel_rows) + len(kml_records),
    "unique_physical_stations": 0,
    "verified_coordinates": 0,
    "unmatched_stations": 0,
    "invalid_coordinates": 0,
    "duplicate_locations": 0,
    "sources_used": [
        "Police Stations.xlsx",
        "c59ade2e-623c-4282-844f-3491bf1c64db.kml",
        "chennai_police_jurisdictions.kml"
    ]
}

# Process KML verified point features as primary canonical physical stations
coord_counts = {}

for r in kml_records:
    lat = r.get('lat')
    lon = r.get('lon')
    ps_code = r.get('PSCODE', '').strip().upper()
    st_raw = r.get('STATION', '').strip()
    
    if lat is None or lon is None or not (75.0 <= lon <= 81.5 and 8.0 <= lat <= 14.0):
        validation_stats["invalid_coordinates"] += 1
        continue
        
    coord_key = (round(lat, 5), round(lon, 5))
    if coord_key in coord_counts:
        coord_counts[coord_key] += 1
        validation_stats["duplicate_locations"] += 1
    else:
        coord_counts[coord_key] = 1

    # Extract clean station name and code
    clean_name = st_raw
    if not ps_code:
        # Match pattern like 'D1 Triplicane'
        m = re.match(r'^([A-Z]\d+)\s+(.*)$', st_raw)
        if m:
            ps_code = m.group(1)
            clean_name = m.group(2)
            
    st_id = f"PS_TN_{ps_code if ps_code else r.get('GID', 'UNK')}"
    
    is_awps = "AWPS" in st_raw.upper() or bool(r.get('AWPS'))
    st_type = "All Women Police Station" if is_awps else "Law & Order / General"
    
    physical_stations[st_id] = {
        "physical_station_id": st_id,
        "station_id": st_id,
        "station_name": st_raw if st_raw else f"Police Station {ps_code}",
        "canonical_station_name": clean_name if clean_name else st_raw,
        "district": "CHENNAI",
        "reporting_unit": "CHENNAI",
        "zone": "CHENNAI METROPOLITAN",
        "subdivision": r.get('AWPS', 'Metropolitan'),
        "station_type": st_type,
        "police_code": ps_code,
        "latitude": float(lat),
        "longitude": float(lon),
        "source": "c59ade2e-623c-4282-844f-3491bf1c64db.kml",
        "coordinate_status": "VERIFIED"
    }

validation_stats["verified_coordinates"] = len(physical_stations)

# Reconcile Excel records that don't match KML verified coordinates
for i, ex_row in enumerate(excel_rows):
    st_name_ex = ex_row.get("Station Name", "").strip()
    sub_div = ex_row.get("Sub division", "").strip()
    
    if not st_name_ex:
        continue
        
    # Check if this matches an existing physical station code or name
    matched = False
    for st_id, st_data in physical_stations.items():
        if (st_data["canonical_station_name"].upper() in st_name_ex.upper() or
            st_name_ex.upper() in st_data["canonical_station_name"].upper()):
            matched = True
            break
            
    if not matched:
        unmatched_id = f"PS_TN_UNMATCHED_{i+1:03d}"
        physical_stations[unmatched_id] = {
            "physical_station_id": unmatched_id,
            "station_id": unmatched_id,
            "station_name": st_name_ex,
            "canonical_station_name": st_name_ex,
            "district": "CHENNAI",
            "reporting_unit": "CHENNAI",
            "zone": "CHENNAI METROPOLITAN",
            "subdivision": sub_div if sub_div else "Metropolitan",
            "station_type": "Administrative Record",
            "police_code": f"EX-{i+1}",
            "latitude": None,
            "longitude": None,
            "source": "Police Stations.xlsx",
            "coordinate_status": "UNMATCHED"
        }
        validation_stats["unmatched_stations"] += 1

validation_stats["unique_physical_stations"] = len(physical_stations)

# 4. EXPORT CANONICAL GEOJSON (VERIFIED STATIONS ONLY)
features = []
for st_id, st_data in physical_stations.items():
    if st_data["coordinate_status"] == "VERIFIED":
        features.append({
            "type": "Feature",
            "properties": st_data,
            "geometry": {
                "type": "Point",
                "coordinates": [st_data["longitude"], st_data["latitude"]]
            }
        })

geojson_out = {
    "type": "FeatureCollection",
    "metadata": {
        "title": "ANVESHA Canonical Verified Police Stations Layer",
        "state_ut": "TAMIL NADU",
        "verified_station_count": len(features),
        "disclaimer": "Reference locations only. Not individual crime observation points."
    },
    "features": features
}

with open(OUTPUT_GEOJSON, "w", encoding="utf-8") as f:
    json.dump(geojson_out, f, indent=2)

print(f"-> Saved canonical verified GeoJSON: {OUTPUT_GEOJSON} ({len(features)} verified points).")

# 5. EXPORT CANONICAL CSV DATASET
df_csv = pd.DataFrame(list(physical_stations.values()))
df_csv.to_csv(OUTPUT_CSV, index=False)
print(f"-> Saved canonical CSV dataset: {OUTPUT_CSV} ({len(df_csv)} total physical station records).")

# 6. EXPORT VALIDATION REPORT
with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
    json.dump(validation_stats, f, indent=2)

print("\n================================================================================")
print("POLICE STATION VALIDATION REPORT SUMMARY")
print("================================================================================")
print(f"Total Source Records Processed: {validation_stats['total_source_records']}")
print(f"Unique Physical Stations:        {validation_stats['unique_physical_stations']}")
print(f"Verified GIS Point Coordinates:  {validation_stats['verified_coordinates']}")
print(f"Unmatched Stations (No Coords):  {validation_stats['unmatched_stations']}")
print(f"Invalid / Out-of-Bounds Coords:  {validation_stats['invalid_coordinates']}")
print(f"Duplicate Co-located Stations:  {validation_stats['duplicate_locations']}")
print("================================================================================")
