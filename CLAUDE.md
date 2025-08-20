# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Data Processing
- `python merge_datasets.py` - Merge and enhance Symphony layer metadata with availability indexes and improvement analysis. Outputs processed JSON files to `docs/data/` for web app consumption.
- `python optimize_site.py` - Optimize static website files by minifying JSON, creating gzipped versions, and generating site statistics for GitHub Pages deployment.

### Analysis Scripts
- `python analyze_layer_improvements.py` - AI-powered analysis to determine improvement potential, difficulty, and satellite sensing capabilities for Symphony layers. Requires `OPEN_ROUTER_API_KEY` environment variable.
- `python match_symphony_to_p02.py` - AI-powered matching of Symphony layers to P02 oceanographic parameters. Requires `OPEN_ROUTER_API_KEY` environment variable.
- `python calculate_data_availability_index.py` - Calculate data availability indexes by matching Symphony-P02 parameters with P02 parameter availability data.

### Python Environment
- `pip install -r requirements.txt` - Install Python dependencies (plotly, streamlit, pandas, streamlit-plotly-events, openpyxl)

### Website Development
The static website files are in `docs/` and ready for GitHub Pages deployment. No build process required - the site uses vanilla JavaScript and loads JSON data directly.

## Architecture Overview

This is a dual-purpose repository containing both data processing scripts and a static website for exploring Symphony oceanic layers.

### Data Pipeline
1. **Source Data**: Symphony layer metadata, P02 parameter vocabulary, and dataset catalogues in `data/`
2. **Processing Scripts**: Python scripts analyze and enhance the raw data using AI (OpenRouter API)
3. **Web-Ready Data**: Processed JSON files in `docs/data/` optimized for the web application

### Core Components

**Data Processing Layer**:
- `DatasetMerger` class in `merge_datasets.py` - Combines metadata with availability indexes and improvement analysis
- `LayerImprovementAnalyzer` class - AI analysis of layer improvement potential
- `SymphonyP02MatcherV2` class - AI matching of Symphony layers to P02 parameters
- `DataAvailabilityCalculator` class - Computes data availability indexes

**Static Web Application**:
- `SymphonyApp` class in `docs/js/app.js` - Main application controller
- Chart.js integration for interactive donut charts
- Client-side JSON data loading via `data-loader.js`
- Responsive design with mobile support

### Data Flow
```
Raw Excel/PDF → Python processing scripts → Enhanced JSON files → Static web app → GitHub Pages
```

### Key Data Files
- `symphony_layer_metadata.json` - Core layer information enhanced with availability and improvement data
- `p02.jsonld` - SeaDataNet parameter vocabulary (468 oceanographic parameters)
- `catalogue.json` - Dataset catalogue with P02 parameter mappings
- `symphony_p02_matches.json` - AI-generated matches between Symphony layers and P02 parameters

## API Dependencies

Scripts using AI analysis require OpenRouter API access:
- Set `OPEN_ROUTER_API_KEY` or `OPEN_ROUTER_KEY` environment variable
- Used models: `google/gemini-2.5-flash` (analysis), `google/gemini-2.5-pro` (matching)
- Rate limited to 1 second between requests

## Deployment

The `docs/` directory is configured for GitHub Pages deployment:
1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch" with `main` branch and `/docs` folder
3. Run `python optimize_site.py` to optimize files before deployment
4. Site structure includes gzipped versions for better performance

## File Structure Notes

- `docs/data/` contains web-optimized JSON files (different from `data/` which has raw/intermediate files)
- `old/` directory contains legacy Excel files and earlier processing attempts
- All Python scripts include comprehensive error handling and progress reporting
- The web application is entirely client-side with no server dependencies