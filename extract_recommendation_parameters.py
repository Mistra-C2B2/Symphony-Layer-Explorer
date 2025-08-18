#!/usr/bin/env python3
"""
Extract title and ID_Parameters from df_recommendation_related_parameters.xlsx
and create a JSON mapping titles to their parameter IDs.
"""

import pandas as pd
import json
from pathlib import Path
import sys
from collections import defaultdict


def extract_recommendation_parameters_to_json(excel_file="df_recommendation_related_parameters.xlsx", output_file="recommendation_parameters.json"):
    """
    Extract title and ID_Parameters from Excel file and create a JSON mapping
    titles to their parameter IDs.

    Args:
        excel_file (str): Path to the Excel file
        output_file (str): Path for the output JSON file
    """
    try:
        # Check if the Excel file exists
        if not Path(excel_file).exists():
            print(f"Error: {excel_file} not found!")
            sys.exit(1)

        print(f"Reading '{excel_file}'...")

        # Read Sheet1
        print(f"Processing sheet: 'Sheet1'")
        df = pd.read_excel(excel_file, sheet_name='Sheet1')
        
        print(f"Found {len(df)} rows and {len(df.columns)} columns")
        print(f"All columns: {list(df.columns)}")
        
        # Find the required columns (case-insensitive search)
        title_col = None
        id_params_col = None
        
        for col in df.columns:
            col_lower = str(col).lower().strip()
            if 'title' in col_lower:
                title_col = col
                print(f"Found title column: '{col}'")
            elif 'id_parameter' in col_lower or 'id parameter' in col_lower:
                id_params_col = col
                print(f"Found ID_Parameters column: '{col}'")
        
        if not title_col:
            print("Error: Could not find 'title' column!")
            print(f"Available columns: {list(df.columns)}")
            sys.exit(1)
        
        if not id_params_col:
            print("Error: Could not find 'ID_Parameters' column!")
            print(f"Available columns: {list(df.columns)}")
            sys.exit(1)
        
        # Create mapping dictionary
        title_to_params = defaultdict(list)
        processed_rows = 0
        skipped_rows = 0
        
        print(f"\nProcessing data...")
        
        for idx, row in df.iterrows():
            title = row[title_col]
            param_id = row[id_params_col]
            
            # Skip rows where title or parameter ID is null/empty
            if pd.isna(title) or pd.isna(param_id):
                skipped_rows += 1
                continue
            
            # Convert title to lowercase and clean it
            title_clean = str(title).lower().strip()
            param_id_clean = str(param_id).strip()
            
            # Add parameter ID to the title's list (avoid duplicates)
            if param_id_clean not in title_to_params[title_clean]:
                title_to_params[title_clean].append(param_id_clean)
            
            processed_rows += 1
        
        # Convert defaultdict to regular dict for JSON serialization
        result_dict = dict(title_to_params)
        
        print(f"Processed {processed_rows} rows")
        print(f"Skipped {skipped_rows} rows with null/empty values")
        print(f"Created mappings for {len(result_dict)} unique titles")
        
        # Show sample of the data
        if result_dict:
            print(f"\nSample mappings:")
            for i, (title, params) in enumerate(list(result_dict.items())[:3]):
                print(f"  '{title}': {params}")
            
            # Show statistics
            param_counts = {title: len(params) for title, params in result_dict.items()}
            max_params = max(param_counts.values()) if param_counts else 0
            avg_params = sum(param_counts.values()) / len(param_counts) if param_counts else 0
            
            print(f"\nStatistics:")
            print(f"  Maximum parameters per title: {max_params}")
            print(f"  Average parameters per title: {avg_params:.1f}")
            
            # Show title with most parameters
            title_with_most = max(param_counts.items(), key=lambda x: x[1])
            print(f"  Title with most parameters: '{title_with_most[0]}' ({title_with_most[1]} parameters)")

        # Write to JSON file
        print(f"\nWriting to '{output_file}'...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result_dict, f, indent=2, ensure_ascii=False, sort_keys=True)

        total_params = sum(len(params) for params in result_dict.values())
        print(f"Successfully exported {len(result_dict)} titles with {total_params} total parameter mappings to '{output_file}'")

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Allow command line arguments for custom file paths
    excel_file = sys.argv[1] if len(sys.argv) > 1 else "df_recommendation_related_parameters.xlsx"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "recommendation_parameters.json"

    extract_recommendation_parameters_to_json(excel_file, output_file)