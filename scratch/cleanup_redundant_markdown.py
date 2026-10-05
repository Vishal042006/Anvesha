#!/usr/bin/env python3
"""
ANVESHA Redundant Markdown Cleanup Script
Archives/removes unreferenced, duplicate, and obsolete draft markdown files while preserving core documentation,
provenance, and test-required deliverables.
Logs all actions into reports/data_cleanup_actions.md.
"""

import os
import shutil
import hashlib
from datetime import datetime

def compute_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def cleanup_markdown_files():
    print("Executing Redundant Markdown Cleanup...")
    
    ACTION_LOG = "reports/data_cleanup_actions.md"
    ARCHIVE_DIR = "data/raw_archive/obsolete_docs"
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    # List of redundant / duplicate / obsolete markdown files to clean up
    files_to_clean = [
        # Loose duplicate/draft files in root
        "ANVESHA_FINAL_MODEL_EVALUATION.md",
        "TRAINING_READINESS_REPORT.md",
        "DATA_QUALITY_REPORT.md",
        "DATASET_ANALYSIS_REPORT.md",
        "MODEL_COMPARISON.md",
        "DATASET_SEGREGATION_REPORT.md",
        "FINAL_DATASET_README.md",
        "IMPLEMENTATION_SUMMARY.md",
        "ANVESHA_DATASET_CARD.md",
        "FRONTEND_IMPLEMENTATION.md",

        # Redundant duplicate report directories
        "anvesha_training_data/11_reports/TRAINING_READINESS_REPORT.md",
        "anvesha_training_data/11_reports/DATASET_SEGREGATION_REPORT.md",
        "data/reports/PIPELINE_AUDIT_REPORT.md",
        "data/reports/DATASET_ANALYSIS_REPORT.md",
        "data/reports/ANVESHA_IMPLEMENTATION_AUDIT.md",
        "data/reports/ML_RESEARCH_REPORT.md",
        "data/reports/ANVESHA_DATASET_CARD.md",
        "data/reports/FINAL_DATASET_README.md"
    ]

    action_records = []

    for rel_path in files_to_clean:
        if os.path.exists(rel_path):
            file_hash = compute_sha256(rel_path)
            file_size = os.path.getsize(rel_path)
            dest_filename = rel_path.replace("/", "_")
            archive_path = os.path.join(ARCHIVE_DIR, dest_filename)

            # Move to archive directory
            shutil.move(rel_path, archive_path)
            print(f"Archived {rel_path} -> {archive_path}")

            action_records.append({
                "original_path": rel_path,
                "reason": "Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md",
                "archive_path": archive_path,
                "sha256": file_hash,
                "size_bytes": file_size
            })

    # Clean empty directories if left behind
    for d in ["data/reports", "anvesha_training_data/11_reports"]:
        if os.path.exists(d) and not os.listdir(d):
            os.rmdir(d)
            print(f"Removed empty directory: {d}")

    # Append records to reports/data_cleanup_actions.md
    with open(ACTION_LOG, "a") as f:
        f.write(f"\n\n## Markdown Cleanup Actions — {datetime.now().strftime('%B %d, %Y %H:%M:%S')}\n\n")
        f.write("| Original Path | Reason | Archive Path | SHA-256 Hash | Size |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")
        for rec in action_records:
            f.write(f"| `{rec['original_path']}` | {rec['reason']} | `{rec['archive_path']}` | `{rec['sha256'][:12]}...` | {rec['size_bytes']} B |\n")

    print(f"Cleanup complete! Archived {len(action_records)} markdown files. Logged to {ACTION_LOG}.")

if __name__ == "__main__":
    cleanup_markdown_files()
