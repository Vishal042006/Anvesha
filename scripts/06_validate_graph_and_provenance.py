#!/usr/bin/env python3
"""
ANVESHA Script 06: Graph Quality Validation & Provenance Copy
Validates graph nodes and edges for uniqueness, orphan edges, self-loops, and duplicate relationships.
Generates GRAPH_QUALITY_REPORT.csv and populates 10_provenance/.
"""

import os
import json
import shutil
import pandas as pd

def validate_graph_and_provenance():
    print("Executing ANVESHA Script 06: Graph Quality Audit & Provenance Verification...")
    
    nodes_path = "15_graph_nodes.csv"
    edges_path = "16_graph_edges.csv"
    
    graph_checks = []
    
    if os.path.exists(nodes_path) and os.path.exists(edges_path):
        df_nodes = pd.read_csv(nodes_path)
        df_edges = pd.read_csv(edges_path)
        
        # 1. Node ID Uniqueness
        dup_nodes = df_nodes['node_id'].duplicated().sum()
        graph_checks.append({
            "check_name": "NODE_ID_UNIQUENESS",
            "status": "PASS" if dup_nodes == 0 else "FAIL",
            "issue_count": int(dup_nodes),
            "details": f"Duplicate node_ids found: {dup_nodes}",
            "recommendation": "Deduplicate node IDs before graph ingestion" if dup_nodes > 0 else "None"
        })
        
        # 2. Edge Source Existence
        valid_nodes = set(df_nodes['node_id'])
        orphan_sources = (~df_edges['source_node'].isin(valid_nodes)).sum()
        graph_checks.append({
            "check_name": "EDGE_SOURCE_EXISTENCE",
            "status": "PASS" if orphan_sources == 0 else "FAIL",
            "issue_count": int(orphan_sources),
            "details": f"Orphan edge sources: {orphan_sources}",
            "recommendation": "Remove orphan edges" if orphan_sources > 0 else "None"
        })
        
        # 3. Edge Target Existence
        orphan_targets = (~df_edges['target_node'].isin(valid_nodes)).sum()
        graph_checks.append({
            "check_name": "EDGE_TARGET_EXISTENCE",
            "status": "PASS" if orphan_targets == 0 else "FAIL",
            "issue_count": int(orphan_targets),
            "details": f"Orphan edge targets: {orphan_targets}",
            "recommendation": "Remove orphan targets" if orphan_targets > 0 else "None"
        })
        
        # 4. Self-Loop Check
        self_loops = (df_edges['source_node'] == df_edges['target_node']).sum()
        graph_checks.append({
            "check_name": "SELF_LOOP_CHECK",
            "status": "PASS" if self_loops == 0 else "WARNING",
            "issue_count": int(self_loops),
            "details": f"Self-loop count: {self_loops}",
            "recommendation": "Verify self-referential relations" if self_loops > 0 else "None"
        })
        
        # 5. Duplicate Edge Check
        dup_edges = df_edges.duplicated(subset=['source_node', 'relationship', 'target_node']).sum()
        graph_checks.append({
            "check_name": "DUPLICATE_EDGE_CHECK",
            "status": "PASS" if dup_edges == 0 else "WARNING",
            "issue_count": int(dup_edges),
            "details": f"Duplicate edges: {dup_edges}",
            "recommendation": "Deduplicate matching edges" if dup_edges > 0 else "None"
        })
        
    df_graph_quality = pd.DataFrame(graph_checks)
    df_graph_quality.to_csv("GRAPH_QUALITY_REPORT.csv", index=False)
    df_graph_quality.to_csv("anvesha_training_data/11_reports/GRAPH_QUALITY_REPORT.csv", index=False)

    # Copy Provenance to 10_provenance/
    if os.path.exists("source_provenance.csv"):
        shutil.copy2("source_provenance.csv", "anvesha_training_data/10_provenance/source_provenance.csv")
    if os.path.exists("data_lineage.json"):
        shutil.copy2("data_lineage.json", "anvesha_training_data/10_provenance/data_lineage.json")

    print(f"Script 06 Complete. GRAPH_QUALITY_REPORT.csv generated ({len(df_graph_quality)} checks performed). Provenance artifacts copied to 10_provenance/.")

if __name__ == "__main__":
    validate_graph_and_provenance()
