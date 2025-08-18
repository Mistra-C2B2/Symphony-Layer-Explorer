#!/usr/bin/env python3
"""
Extract reference parameters from df_REFERENCE_PARAMETERS.xlsx and export to JSON
with lowercase column keys.
"""

import pandas as pd
import json
from pathlib import Path
import sys


def extract_reference_parameters_to_json(excel_file="df_REFERENCE_PARAMETERS.xlsx", output_file="reference_parameters.json"):
    """
    Extract reference parameters from an Excel file and save as JSON
    with lowercase column keys.

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

        # Read all sheets and get sheet names
        excel_sheets = pd.ExcelFile(excel_file)
        sheet_names = excel_sheets.sheet_names
        print(f"Found sheets: {sheet_names}")

        # Process only Sheet1
        print(f"\nProcessing sheet: 'Sheet1'")
        df = pd.read_excel(excel_file, sheet_name='Sheet1')
        
        print(f"Found {len(df)} rows and {len(df.columns)} columns")
        print(f"Original columns: {list(df.columns)}")
        
        # Remove preferred_label.1 column if it exists
        if 'preferred_label.1' in df.columns:
            df = df.drop('preferred_label.1', axis=1)
            print("Removed 'preferred_label.1' column")
        
        # Convert column names to lowercase and replace spaces with underscores
        df.columns = df.columns.str.lower().str.replace(' ', '_').str.replace('-', '_')
        print(f"Processed columns: {list(df.columns)}")
        
        # Convert DataFrame to dictionary with records orientation
        data = df.to_dict('records')
        
        # Handle NaN values and process records
        processed_data = []
        for record in data:
            # Convert NaN values to None
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
            
            # Convert preferred_label content to lowercase
            if 'preferred_label' in record and record['preferred_label']:
                record['preferred_label'] = record['preferred_label'].lower()
            
            processed_data.append(record)
        
        print(f"Processed {len(processed_data)} records")

        # Write to JSON file (directly as array, not nested in sheet object)
        print(f"\nWriting to '{output_file}'...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, indent=2, ensure_ascii=False)

        print(f"Successfully exported {len(processed_data)} records to '{output_file}'")

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Allow command line arguments for custom file paths
    excel_file = sys.argv[1] if len(sys.argv) > 1 else "df_REFERENCE_PARAMETERS.xlsx"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "reference_parameters.json"

    extract_reference_parameters_to_json(excel_file, output_file)