#!/usr/bin/env python3
"""
Count the number of entries for each "source" in catalogue.json
"""

import json
from collections import Counter

def count_sources():
    """
    Count and display the number of entries for each source in catalogue.json
    """
    try:
        # Load the catalogue data
        print("Reading 'catalogue.json'...")
        with open('catalogue.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"Total records: {len(data)}")
        
        # Extract all source values
        sources = []
        for record in data:
            source = record.get('source')
            if source:
                sources.append(source)
            else:
                sources.append('(null/empty)')
        
        # Count occurrences
        source_counts = Counter(sources)
        
        print(f"\nSource distribution ({len(source_counts)} unique sources):")
        print("-" * 50)
        
        # Sort by count (descending) then by name
        for source, count in sorted(source_counts.items(), key=lambda x: (-x[1], x[0])):
            percentage = (count / len(data)) * 100
            print(f"{source:<35} {count:>5} ({percentage:>5.1f}%)")
        
        print("-" * 50)
        print(f"{'Total':<35} {len(data):>5} (100.0%)")
        
        # Check for null/empty sources
        null_empty_count = source_counts.get('(null/empty)', 0)
        if null_empty_count > 0:
            print(f"\nNote: {null_empty_count} records have null/empty source values")
        
    except FileNotFoundError:
        print("Error: catalogue.json not found!")
    except json.JSONDecodeError:
        print("Error: Invalid JSON in catalogue.json!")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    count_sources()