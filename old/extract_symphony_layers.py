#!/usr/bin/env python3
"""
Extract specific fields from df_SYMPHONY_LAYERS.xlsx Sheet1 and export to JSON
with snake_case keys and values.
"""

import pandas as pd
import json
from pathlib import Path
import sys
import re


def to_snake_case(text):
    """
    Convert text to snake_case format.

    Args:
        text (str): Input text to convert

    Returns:
        str: Text in snake_case format
    """
    if not isinstance(text, str):
        return text

    # Replace spaces and hyphens with underscores, then convert to lowercase
    # Handle multiple spaces/special characters
    text = re.sub(r'[^\w\s]', ' ', text)  # Replace special chars with spaces
    text = re.sub(r'\s+', '_', text.strip())  # Replace spaces with underscores
    return text.lower()


def extract_symphony_layers_to_json(excel_file="df_SYMPHONY_LAYERS.xlsx", output_file="symphony_layers.json"):
    """
    Extract specific fields from Symphony Layers Excel file and save as JSON
    with snake_case formatting.

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
        required_fields = ['Title', 'Valuability', 'Data availability index']
        column_mapping = {}

        for required_field in required_fields:
            found = False
            for col in df.columns:
                if str(col).strip().lower() == required_field.lower():
                    column_mapping[required_field] = col
                    found = True
                    break

            if not found:
                print(f"Warning: Column '{required_field}' not found!")
                # Try partial matching
                for col in df.columns:
                    if required_field.lower().replace(' ', '') in str(col).lower().replace(' ', ''):
                        column_mapping[required_field] = col
                        print(f"  Using '{col}' for '{required_field}'")
                        found = True
                        break

                if not found:
                    print(
                        f"Error: Could not find column for '{required_field}'")
                    print(f"Available columns: {list(df.columns)}")
                    sys.exit(1)

        print(f"Column mapping: {column_mapping}")

        # Extract only the required columns
        selected_columns = list(column_mapping.values())
        df_selected = df[selected_columns].copy()

        # Convert DataFrame to dictionary with records orientation
        data = df_selected.to_dict('records')

        # Process records with snake_case conversion
        processed_data = []
        for record in data:
            processed_record = {}

            for original_field, column_name in column_mapping.items():
                value = record[column_name]

                # Convert NaN values to None
                if pd.isna(value):
                    value = None
                elif isinstance(value, str):
                    # Convert string values to snake_case
                    if column_name.lower() == 'title':
                        value = value.lower()
                    else:
                        value = to_snake_case(value)

                # Convert field name to snake_case for the key
                snake_case_key = to_snake_case(original_field)
                processed_record[snake_case_key] = value

            processed_data.append(processed_record)

        print(f"Processed {len(processed_data)} records")

        # Show sample of the data
        if processed_data:
            print("\nSample record:")
            print(json.dumps(processed_data[0], indent=2))

        # Write to JSON file
        print(f"\nWriting to '{output_file}'...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, indent=2, ensure_ascii=False)

        print(
            f"Successfully exported {len(processed_data)} records to '{output_file}'")

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Allow command line arguments for custom file paths
    excel_file = sys.argv[1] if len(
        sys.argv) > 1 else "df_SYMPHONY_LAYERS.xlsx"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "symphony_layers.json"

    extract_symphony_layers_to_json(excel_file, output_file)
