import os
import pandas as pd
from backend.app.config import settings

class SpatialService:
    def get_spatial_crime(self):
        nodes_path = os.path.join(settings.DATA_DIR, "06_graph", "15_graph_nodes.csv")
        edges_path = os.path.join(settings.DATA_DIR, "06_graph", "16_graph_edges.csv")
        if not os.path.exists(nodes_path):
            nodes_path = os.path.join(settings.DATA_DIR, "tamil_nadu", "15_graph_nodes.csv")

        nodes = []
        if os.path.exists(nodes_path):
            df_nodes = pd.read_csv(nodes_path, low_memory=False)
            for _, r in df_nodes.head(50).iterrows():
                node_id = str(r.get('node_id', r.get('district', 'DIST')))
                node_type = str(r.get('node_type', 'District'))
                name = str(r.get('name', r.get('district', 'District Name')))
                nodes.append({
                    "id": node_id,
                    "type": node_type,
                    "name": name,
                    "district": name,
                    "latitude": float(r.get('lat', 11.0 + (len(nodes) % 5) * 0.5)),
                    "longitude": float(r.get('lon', 78.0 + (len(nodes) % 5) * 0.5)),
                    "crime_count_2023": float(r.get('crime_count', 1200.0)),
                    "spatial_lag_crime": float(r.get('spatial_lag', 1100.0))
                })

        if not nodes:
            sample_districts = [
                ("CHENNAI", 13.0827, 80.2707, 4500.0),
                ("COIMBATORE", 11.0168, 76.9558, 2800.0),
                ("MADURAI", 9.9252, 78.1198, 2400.0),
                ("TIRUCHIRAPPALLI", 10.7905, 78.7047, 1900.0),
                ("SALEM", 11.6643, 78.1460, 1750.0),
                ("TIRUNELVELI", 8.7139, 77.7567, 1400.0),
                ("VELLORE", 12.9165, 79.1325, 1300.0),
                ("THANJAVUR", 10.7870, 79.1378, 1100.0),
                ("DINDIGUL", 10.3673, 77.9803, 950.0),
                ("CUDDALORE", 11.7480, 79.7714, 1050.0)
            ]
            for i, (name, lat, lon, count) in enumerate(sample_districts):
                nodes.append({
                    "id": f"GEO_{i+1:04d}",
                    "type": "District",
                    "name": name,
                    "district": name,
                    "latitude": lat,
                    "longitude": lon,
                    "crime_count_2023": count,
                    "spatial_lag_crime": round(count * 0.88, 1)
                })

        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [n["longitude"], n["latitude"]]
                    },
                    "properties": n
                } for n in nodes
            ]
        }

        return geojson

spatial_service = SpatialService()
