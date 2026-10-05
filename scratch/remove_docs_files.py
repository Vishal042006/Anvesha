#!/usr/bin/env python3
"""
ANVESHA Docs Directory Removal Script
Archives all remaining markdown files in docs/ to data/raw_archive/obsolete_docs/,
logs all action metadata in reports/data_cleanup_actions.md, and removes the empty docs/ directory.
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

def remove_docs_directory():
    print("Archiving and removing docs/ directory...")

    ACTION_LOG = "reports/data_cleanup_actions.md"
    ARCHIVE_DIR = "data/raw_archive/obsolete_docs"
    DOCS_DIR = "docs"

    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    if not os.path.exists(DOCS_DIR):
        print("docs/ directory does not exist or is already removed.")
        return

    doc_files = [os.path.join(DOCS_DIR, f) for f in os.listdir(DOCS_DIR) if f.endswith('.md')]

    action_records = []

    for fpath in doc_files:
        if os.path.isfile(fpath):
            file_hash = compute_sha256(fpath)
            file_size = os.path.getsize(fpath)
            dest_filename = fpath.replace("/", "_")
            archive_path = os.path.join(ARCHIVE_DIR, dest_filename)

            # Move to archive directory
            shutil.move(fpath, archive_path)
            print(f"Archived {fpath} -> {archive_path}")

            action_records.append({
                "original_path": fpath,
                "reason": "Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md",
                "archive_path": archive_path,
                "sha256": file_hash,
                "size_bytes": file_size
            })

    # Remove docs directory if empty
    if os.path.exists(DOCS_DIR) and not os.listdir(DOCS_DIR):
        os.rmdir(DOCS_DIR)
        print(f"Removed empty directory: {DOCS_DIR}")

    # Append to reports/data_cleanup_actions.md
    with open(ACTION_LOG, "a") as f:
        f.write(f"\n\n## Docs Directory Removal Actions — {datetime.now().strftime('%B %d, %Y %H:%M:%S')}\n\n")
        f.write("| Original Path | Reason | Archive Path | SHA-256 Hash | Size |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")
        for rec in action_records:
            f.write(f"| `{rec['original_path']}` | {rec['reason']} | `{rec['archive_path']}` | `{rec['sha256'][:12]}...` | {rec['size_bytes']} B |\n")

    print(f"Archived {len(action_records)} files from docs/. Logged to {ACTION_LOG}.")

if __name__ == "__main__":
    remove_docs_directory()
