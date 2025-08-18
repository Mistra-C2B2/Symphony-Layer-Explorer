#!/usr/bin/env python3
import json

# Load the catalogue data
with open('catalogue.json', 'r') as f:
    data = json.load(f)

# Check for missing or empty names
missing_names = []
for d in data:
    name = d.get('name')
    if not name or name == '' or name is None:
        missing_names.append(d)

print(f'Total records: {len(data)}')
print(f'Records with missing/empty names: {len(missing_names)}')
print(f'Percentage with names: {((len(data) - len(missing_names)) / len(data)) * 100:.1f}%')

if missing_names:
    print(f'\nExamples of missing names (first 10):')
    for d in missing_names[:10]:
        print(f'  ID {d["id_dataset"]}: name = {repr(d.get("name"))}')
else:
    print('\nAll records have names!')

# Check for records with very short names (potential quality issues)
short_names = [d for d in data if d.get('name') and len(d.get('name', '').strip()) < 10]
if short_names:
    print(f'\nRecords with very short names (< 10 characters, first 5):')
    for d in short_names[:5]:
        print(f'  ID {d["id_dataset"]}: name = {repr(d.get("name"))}')