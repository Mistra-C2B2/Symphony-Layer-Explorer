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
The React application is in `symphony-react-app/` directory. It uses Vite as the build tool and is configured for GitHub Pages deployment.

**Development Server**: Run a single development server that is accessible outside the container:
- `cd symphony-react-app && npm run dev --host` - Start Vite dev server accessible on all interfaces
- Access the site at the provided local network URL (usually `http://localhost:5173`)
- **Important**: Only run ONE development server process to avoid port conflicts

**Build and Testing**:
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint for code quality

## Architecture Overview

This is a dual-purpose repository containing both data processing scripts and a React application for exploring Symphony oceanic layers.

### Data Pipeline
1. **Source Data**: Symphony layer metadata, P02 parameter vocabulary, and dataset catalogues in `data/`
2. **Processing Scripts**: Python scripts analyze and enhance the raw data using AI (OpenRouter API)
3. **Web-Ready Data**: Processed JSON files in `symphony-react-app/public/data/` optimized for the React application

### Core Components

**Data Processing Layer**:
- `DatasetMerger` class in `merge_datasets.py` - Combines metadata with availability indexes and improvement analysis
- `LayerImprovementAnalyzer` class - AI analysis of layer improvement potential
- `SymphonyP02MatcherV2` class - AI matching of Symphony layers to P02 parameters
- `DataAvailabilityCalculator` class - Computes data availability indexes

**React Web Application**:
- `App.tsx` - Main application component with routing
- React components in `symphony-react-app/src/components/` for UI elements
- Custom hooks in `symphony-react-app/src/hooks/` for data fetching and search functionality
- Data services in `symphony-react-app/src/services/` for API communication
- TypeScript for type safety and Tailwind CSS for styling
- Responsive design with mobile support

### Data Flow
```
Raw Excel/PDF → Python processing scripts → Enhanced JSON files → React app → GitHub Pages
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

The React application is configured for GitHub Pages deployment:
1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch" with `main` branch and `/symphony-react-app/dist` folder
3. Build the application: `cd symphony-react-app && npm run build`
4. The `dist/` folder contains the production build ready for deployment
5. Vite is configured with the correct base path for GitHub Pages

## File Structure Notes

- `symphony-react-app/public/data/` contains web-optimized JSON files (different from `data/` which has raw/intermediate files)
- `symphony-react-app/src/` contains React components, hooks, services, and types
- `old/` directory contains legacy Excel files and earlier processing attempts
- All Python scripts include comprehensive error handling and progress reporting
- The React application is entirely client-side with no server dependencies beyond the Vite dev server
- When use playwright through the command "npx playwright screenshot [url] [png filename]"
- Save screenshots in the "screenshot" directory to avoid cluttering the codebase