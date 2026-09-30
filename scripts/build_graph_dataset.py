#!/usr/bin/env python3
"""
ANVESHA Phase 18 & 19: Knowledge Graph Dataset Builder Script
Generates evidence-grounded graph nodes and edges without fabricating individual person records.
Generates 15_graph_nodes.csv and 16_graph_edges.csv.
"""

import os
import json
import pandas as pd
import hashlib

def build_graph_dataset():
    print("Starting ANVESHA Phase 18 & 19: Building Knowledge Graph Dataset...")
    
    nodes = []
    edges = []
    seen_nodes = set()
    seen_edges = set()
    
    def add_node(node_id, node_type, name, norm_name, source, source_file, source_page="N/A", conf=1.0):
        if node_id not in seen_nodes:
            seen_nodes.add(node_id)
            nodes.append({
                "node_id": node_id,
                "node_type": node_type,
                "name": name,
                "normalized_name": norm_name,
                "source": source,
                "source_file": source_file,
                "source_page": source_page,
                "confidence": conf
            })
            
    def add_edge(edge_id, src_node, rel, tgt_node, src_file, src_page="N/A", src_tbl="N/A", evidence="", conf=1.0, rel_type="HIERARCHICAL"):
        if edge_id not in seen_edges:
            seen_edges.add(edge_id)
            edges.append({
                "edge_id": edge_id,
                "source_node": src_node,
                "relationship": rel,
                "target_node": tgt_node,
                "source_file": src_file,
                "source_page": src_page,
                "source_table": src_tbl,
                "evidence": evidence,
                "confidence": conf,
                "relationship_type": rel_type
            })

    # Add State Node
    add_node("NODE_STATE_TN", "STATE", "Tamil Nadu", "Tamil Nadu", "SCRB / Government of Tamil Nadu", "SYSTEM", "N/A", 1.0)
    add_node("NODE_STATE_IN", "STATE", "India", "India", "NCRB / Ministry of Home Affairs", "SYSTEM", "N/A", 1.0)

    # Build Graph Nodes & Edges from Geography Mapping
    if os.path.exists("geography_mapping.csv"):
        df_geo = pd.read_csv("geography_mapping.csv")
        for _, r in df_geo.iterrows():
            norm_dist = str(r["normalized_name"])
            dist_node_id = f"NODE_DIST_{hashlib.md5(norm_dist.encode()).hexdigest()[:8]}"
            add_node(dist_node_id, "DISTRICT", norm_dist, norm_dist, "Tamil Nadu SCRB / Revenue Dept", "geography_mapping.csv", "N/A", r["confidence"])
            
            # Edge: District LOCATED_IN State
            edge_id = f"EDGE_{dist_node_id}_LOCATED_IN_NODE_STATE_TN"
            add_edge(edge_id, dist_node_id, "LOCATED_IN", "NODE_STATE_TN", "geography_mapping.csv", "N/A", "N/A", f"District {norm_dist} is located in Tamil Nadu", 1.0, "SPATIAL")

    # Build Graph Nodes & Edges from Crime & Legal Taxonomies
    if os.path.exists("crime_taxonomy_mapping.csv"):
        df_crime = pd.read_csv("crime_taxonomy_mapping.csv")
        for _, r in df_crime.iterrows():
            can_crime = str(r["canonical_crime_name"])
            crime_node_id = f"NODE_CRIME_{hashlib.md5(can_crime.encode()).hexdigest()[:8]}"
            add_node(crime_node_id, "CRIME_CATEGORY", can_crime, can_crime, "NCRB / SCRB Crime Taxonomy", r["source_file"], "N/A", r["confidence"])
            
            # Legal Section Node
            sec_name = str(r["legal_section"])
            if sec_name != "NULL / UNKNOWN":
                law_node_id = f"NODE_LAW_{hashlib.md5(sec_name.encode()).hexdigest()[:8]}"
                add_node(law_node_id, "LAW", sec_name, sec_name, "Indian Penal Code / Special Laws", r["source_file"], "N/A", 0.95)
                
                # Edge: Crime GOVERNED_BY_LAW Law Section
                edge_id = f"EDGE_{crime_node_id}_GOVERNED_BY_{law_node_id}"
                add_edge(edge_id, crime_node_id, "GOVERNED_BY_LAW", law_node_id, r["source_file"], "N/A", "N/A", f"Offence {can_crime} governed under {sec_name}", 0.95, "LEGAL")

    # Build Document Nodes from Inventory
    if os.path.exists("data_inventory.json"):
        with open("data_inventory.json", "r") as f:
            inventory = json.load(f)
            for item in inventory:
                doc_node_id = f"NODE_DOC_{item['file_id']}"
                add_node(doc_node_id, "DOCUMENT", item["filename"], item["filename"], item["source_organization"], item["relative_path"], "N/A", 1.0)

    df_nodes = pd.DataFrame(nodes)
    df_edges = pd.DataFrame(edges)

    df_nodes.to_csv("15_graph_nodes.csv", index=False)
    df_edges.to_csv("16_graph_edges.csv", index=False)
    
    df_nodes.to_csv("data/06_graph/15_graph_nodes.csv", index=False)
    df_nodes.to_parquet("data/06_graph/nodes.parquet", index=False)
    df_edges.to_csv("data/06_graph/16_graph_edges.csv", index=False)
    df_edges.to_parquet("data/06_graph/edges.parquet", index=False)
    
    df_nodes.to_csv("data/tamil_nadu/15_graph_nodes.csv", index=False)
    df_nodes.to_parquet("data/tamil_nadu/nodes.parquet", index=False)
    df_edges.to_csv("data/tamil_nadu/16_graph_edges.csv", index=False)
    df_edges.to_parquet("data/tamil_nadu/edges.parquet", index=False)

    print(f"Phase 18 & 19 Graph Datasets Built. Exported to 15_graph_nodes.csv ({len(df_nodes):,} nodes) and 16_graph_edges.csv ({len(df_edges):,} edges). Grounded in verified entity architecture.")

if __name__ == "__main__":
    build_graph_dataset()
