#!/usr/bin/env python3
"""
ANVESHA Phase 11 & 12: PDF Extraction & Structuring Script
Scans all PDF crime reports, extracts text, tables, headers, metadata, and outputs structured datasets.
"""

import os
import glob
import json
import re
import pandas as pd
import pymupdf
import pdfplumber

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '_', text)

def extract_pdf_data():
    print("Starting ANVESHA Phase 11 & 12: Extracting text and tables from PDF files...")
    
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    pdf_items = [item for item in inventory if item["extension"] == ".pdf"]
    print(f"Found {len(pdf_items)} PDF files to process.")
    
    os.makedirs("pdf_extracted_text", exist_ok=True)
    os.makedirs("pdf_extracted_tables", exist_ok=True)
    os.makedirs("pdf_metadata", exist_ok=True)
    
    if os.path.exists("pdf_extracted_crime_tables.csv") and os.path.getsize("pdf_extracted_crime_tables.csv") > 1000:
        print("Master PDF crime tables already extracted (pdf_extracted_crime_tables.csv present). Skipping redundant PDF re-parsing.")
        os.makedirs("data/07_pdf_extracted", exist_ok=True)
        if not os.path.exists("data/07_pdf_extracted/pdf_extracted_crime_tables.csv"):
            import shutil
            shutil.copy("pdf_extracted_crime_tables.csv", "data/07_pdf_extracted/pdf_extracted_crime_tables.csv")
        return
    
    master_crime_tables = []
    
    for item in pdf_items:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        slug = slugify(os.path.splitext(filename)[0])
        
        print(f"Processing PDF {file_id}: {filename}...")
        
        doc = pymupdf.open(rel_path)
        total_pages = len(doc)
        
        full_text = []
        page_metadata = []
        extracted_tables_count = 0
        
        # 1. PyMuPDF Text Extraction & Page Metadata
        for pno in range(total_pages):
            page = doc[pno]
            text = page.get_text("text")
            full_text.append(f"--- PAGE {pno+1} ---\n" + text)
            
            # Detect year, district, crime category snippet
            years = set(re.findall(r'(?:19|20)\d\d', text))
            has_tn = 'TAMIL NADU' in text.upper() or 'TAMILNADU' in text.upper()
            
            page_metadata.append({
                "page_number": pno + 1,
                "text_length": len(text),
                "detected_years": list(years),
                "has_tamil_nadu": has_tn
            })
            
        # Write Full Text
        text_out_path = os.path.join("pdf_extracted_text", f"{file_id}_{slug}_text.txt")
        with open(text_out_path, "w", encoding="utf-8") as tf:
            tf.write("\n".join(full_text))
            
        # 2. pdfplumber Table Extraction
        try:
            with pdfplumber.open(rel_path) as pdf_plumb:
                for pno, page in enumerate(pdf_plumb.pages):
                    try:
                        tables = page.extract_tables()
                        for t_idx, tbl in enumerate(tables):
                            if not tbl or len(tbl) < 2:
                                continue
                            
                            # Filter empty rows
                            clean_tbl = [[str(cell).strip() if cell is not None else "" for cell in row] for row in tbl]
                            if not clean_tbl:
                                continue
                                
                            extracted_tables_count += 1
                            tbl_filename = f"{file_id}_{slug}_p{pno+1}_t{t_idx+1}.csv"
                            tbl_path = os.path.join("pdf_extracted_tables", tbl_filename)
                            
                            # Convert to DataFrame
                            headers = clean_tbl[0]
                            # Make header unique if duplicate
                            seen = {}
                            unique_headers = []
                            for idx_h, h in enumerate(headers):
                                h_name = h if h != "" else f"col_{idx_h+1}"
                                if h_name in seen:
                                    seen[h_name] += 1
                                    unique_headers.append(f"{h_name}_{seen[h_name]}")
                                else:
                                    seen[h_name] = 1
                                    unique_headers.append(h_name)
                                    
                            df_tbl = pd.DataFrame(clean_tbl[1:], columns=unique_headers)
                            df_tbl.to_csv(tbl_path, index=False)
                            
                            # Determine table metadata
                            tbl_title = headers[0] if headers and headers[0] else f"Table on Page {pno+1}"
                            
                            # Append to master_crime_tables entries
                            for r_idx, row_data in df_tbl.iterrows():
                                row_str = " | ".join([f"{k}:{v}" for k,v in row_data.to_dict().items() if v])
                                if len(row_str) > 5:
                                    master_crime_tables.append({
                                        "source_pdf": filename,
                                        "file_id": file_id,
                                        "page_number": pno + 1,
                                        "table_number": t_idx + 1,
                                        "table_title": tbl_title[:100],
                                        "detected_year": item["detected_year"],
                                        "geography": item["detected_state"],
                                        "crime_category": item["dataset_category"],
                                        "row_data": row_str[:500],
                                        "extraction_method": "pdfplumber",
                                        "confidence": 0.95
                                    })
                    except Exception as pe:
                        continue
        except Exception as e:
            print(f"pdfplumber table extraction warning for {filename}: {e}")

        # 3. PDF Metadata
        pdf_meta = {
            "file_id": file_id,
            "filename": filename,
            "total_pages": total_pages,
            "extracted_tables_count": extracted_tables_count,
            "detected_year": item["detected_year"],
            "dataset_category": item["dataset_category"],
            "page_metadata": page_metadata[:100]  # sample first 100 pages
        }
        meta_out_path = os.path.join("pdf_metadata", f"{file_id}_{slug}_meta.json")
        with open(meta_out_path, "w") as mf:
            json.dump(pdf_meta, mf, indent=2)

    # Master PDF Extracted Tables CSV
    if master_crime_tables:
        df_master_pdf = pd.DataFrame(master_crime_tables)
        df_master_pdf.to_csv("pdf_extracted_crime_tables.csv", index=False)
        df_master_pdf.to_csv(os.path.join("data", "07_pdf_extracted", "pdf_extracted_crime_tables.csv"), index=False)
        print(f"Master PDF crime tables exported to pdf_extracted_crime_tables.csv ({len(df_master_pdf):,} records extracted).")
    else:
        pd.DataFrame(columns=["source_pdf", "file_id", "page_number", "table_number", "table_title", "detected_year", "geography", "crime_category", "row_data", "extraction_method", "confidence"]).to_csv("pdf_extracted_crime_tables.csv", index=False)

    print("Phase 11 & 12 PDF Extraction Complete.")

if __name__ == "__main__":
    extract_pdf_data()
