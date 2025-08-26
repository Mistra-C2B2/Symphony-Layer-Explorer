# Symphony Data Pipeline

This directory contains the Python scripts and data files used to process and enhance Symphony layer metadata for the web application.

## Overview

The data pipeline performs the following main functions:

1. **AI Analysis** - Analyzes Symphony layers to determine improvement potential, difficulty, and satellite sensing capabilities
2. **Parameter Matching** - Matches Symphony layers to P02 oceanographic parameters using AI
3. **Index Calculation** - Calculates data availability indexes for layers based on parameter availability
4. **Data Merging** - Combines all metadata, analysis, and indexes into web-ready JSON files

## Directory Structure

```
data-pipeline/
├── scripts/                    # Processing scripts
│   ├── analyze_layer_improvements.py
│   ├── calculate_data_availability_index.py
│   ├── match_symphony_to_p02.py
│   └── merge_datasets.py
├── source-data/               # Raw input data
│   ├── analysis_context.txt
│   ├── catalogue.json
│   ├── p02.jsonld
│   ├── symphony_layer_metadata.json
│   └── symphony_p02_matches.json
├── output/                    # Processed data (intermediate)
│   ├── p02_analysis.json
│   ├── symphony_data_availability_index.json
│   ├── symphony_improvement_analysis.json
│   └── symphony_layers.json
├── requirements.txt           # Python dependencies
├── README.md                 # This file
└── .gitignore               # Git ignore rules
```

## Prerequisites

1. **Python Environment**
   ```bash
   cd data-pipeline
   pip install -r requirements.txt
   ```

2. **Environment Variables** (for AI-powered scripts)
   ```bash
   export OPEN_ROUTER_API_KEY="your-api-key-here"
   # or
   export OPEN_ROUTER_KEY="your-api-key-here"
   ```

## Processing Scripts

### 1. analyze_layer_improvements.py
**Purpose**: Uses AI to analyze Symphony layer metadata and determine improvement characteristics.

**Input**: `source-data/symphony_layer_metadata.json`  
**Output**: `output/symphony_improvement_analysis.json`

**Usage**:
```bash
cd scripts
python analyze_layer_improvements.py
```

**What it does**:
- Analyzes each layer's limitations and recommendations
- Determines improvement potential (small/medium/large)
- Assesses implementation difficulty (low/medium/high)
- Evaluates satellite sensing capabilities
- Checks DigitalEarthSweden data applicability

### 2. match_symphony_to_p02.py
**Purpose**: Matches Symphony layers to relevant P02 oceanographic parameters using AI.

**Input**: `source-data/symphony_layer_metadata.json`, `source-data/p02.jsonld`  
**Output**: `source-data/symphony_p02_matches.json`

**Usage**:
```bash
cd scripts
python match_symphony_to_p02.py
```

**What it does**:
- Analyzes Symphony layer descriptions and recommendations
- Identifies relevant P02 parameters that could improve each layer
- Creates structured mappings between layers and parameters

### 3. calculate_data_availability_index.py
**Purpose**: Calculates data availability indexes for Symphony layers based on P02 parameter availability.

**Input**: `source-data/symphony_p02_matches.json`, `output/p02_analysis.json`  
**Output**: `output/symphony_data_availability_index.json`

**Usage**:
```bash
cd scripts
python calculate_data_availability_index.py
```

**What it does**:
- Matches Symphony layers to P02 parameters
- Calculates average parameter availability index for each layer
- Generates layer-level data availability scores

### 4. merge_datasets.py
**Purpose**: Combines all processed data into web-ready JSON files for the React application.

**Input**: All files from `source-data/` and `output/`  
**Output**: Files copied to `../symphony-react-app/public/data/`
- `symphony_layers.json` - Complete enhanced layer data
- `p02_analysis.json` - P02 parameter analysis
- `catalogue.json` - Dataset catalogue

**Usage**:
```bash
cd scripts
python merge_datasets.py
```

**What it does**:
- Combines Symphony metadata with improvement analysis, P02 matches, and availability indexes
- Transforms data into web-friendly format with snake_case keys
- Copies necessary files to the React application's public data directory

## Processing Workflow

The complete data processing workflow should be run in this order:

```bash
cd data-pipeline/scripts

# 1. Analyze layer improvement characteristics (requires API key)
python analyze_layer_improvements.py

# 2. Match layers to P02 parameters (requires API key)
python match_symphony_to_p02.py

# 3. Calculate data availability indexes
python calculate_data_availability_index.py

# 4. Merge all data for web application
python merge_datasets.py
```

## Data Flow

```
Raw Data → AI Analysis → Parameter Matching → Index Calculation → Web-Ready Data
    ↓           ↓             ↓                 ↓                 ↓
source-data → output → source-data → output → symphony-react-app/public/data
```

## Notes

- **API Rate Limiting**: AI-powered scripts include 1-second delays between requests to respect API rate limits
- **Error Handling**: All scripts include comprehensive error handling and progress reporting
- **Data Validation**: The merge script validates output files for consistency
- **Environment**: Scripts are designed to be run from the `scripts/` directory

## Troubleshooting

**Missing API Key**: Ensure `OPEN_ROUTER_API_KEY` or `OPEN_ROUTER_KEY` is set for AI-powered scripts

**File Not Found**: Check that input files exist in the expected directories

**Permission Errors**: Ensure write permissions for output directories

**Network Issues**: AI-powered scripts may fail with network connectivity issues - they can be safely re-run