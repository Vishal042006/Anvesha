#!/usr/bin/env python3
"""
ANVESHA Script 01: Setup Training Architecture
Populates 00_raw/ and 01_extracted/ from current project files.
"""

import os
import glob
import shutil
import json

def setup_architecture():
    print("Executing ANVESHA Script 01: Populating 00_raw and 01_extracted directories...")
    
    # Copy CSVs to 00_raw/csv
    csv_files = glob.glob("*.csv")
    for f in csv_files:
        dest = os.path.join("anvesha_training_data", "00_raw", "csv", os.path.basename(f))
        shutil.copy2(f, dest)
        
    # Copy PDFs to 00_raw/pdf
    pdf_files = glob.glob("*.pdf")
    for f in pdf_files:
        dest = os.path.join("anvesha_training_data", "00_raw", "pdf", os.path.basename(f))
        shutil.copy2(f, dest)
        
    # Copy PDF extracted text to 01_extracted/pdf_text
    text_files = glob.glob("pdf_extracted_text/*.*")
    for f in text_files:
        dest = os.path.join("anvesha_training_data", "01_extracted", "pdf_text", os.path.basename(f))
        shutil.copy2(f, dest)
        
    # Copy PDF extracted tables to 01_extracted/pdf_tables
    table_files = glob.glob("pdf_extracted_tables/*.*")
    for f in table_files:
        dest = os.path.join("anvesha_training_data", "01_extracted", "pdf_tables", os.path.basename(f))
        shutil.copy2(f, dest)

    print(f"Setup complete. Copied {len(csv_files)} CSVs, {len(pdf_files)} PDFs, {len(text_files)} text files, and {len(table_files)} extracted tables.")

if __name__ == "__main__":
    setup_architecture()
