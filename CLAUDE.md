# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Data Processing
- `python merge_datasets.py` - Merge and enhance Symphony layer metadata with availability indexes and improvement analysis. Outputs processed JSON files to `symphony-react-app/public/data/` for web app consumption.
- `python test_improved_analysis.py` - Test script for improved analysis functionality.

### Analysis Scripts
- `python analyze_layer_improvements.py` - AI-powered analysis to determine improvement potential, difficulty, and satellite sensing capabilities for Symphony layers. Requires `OPEN_ROUTER_API_KEY` environment variable.
- `python match_symphony_to_p02.py` - AI-powered matching of Symphony layers to P02 oceanographic parameters. Requires `OPEN_ROUTER_API_KEY` environment variable.
- `python calculate_data_availability_index.py` - Calculate data availability indexes by matching Symphony-P02 parameters with P02 parameter availability data.

### Python Environment
- `pip install -r requirements.txt` - Install Python dependencies (plotly, streamlit, pandas, streamlit-plotly-events, openpyxl)
- Requires `python-dotenv` for environment variable management (may need to be installed separately)

### Website Development
The React application is in `symphony-react-app/` directory. It uses Vite as the build tool and is configured for GitHub Pages deployment.

**Development Server**: 
- `cd symphony-react-app && npm run dev` - Start Vite dev server (defaults to localhost:5173)
- `cd symphony-react-app && npm run dev --host` - Start Vite dev server accessible on all interfaces
- **Important**: Only run ONE development server process to avoid port conflicts

**Build and Testing**:
- `cd symphony-react-app && npm run build` - Build the production version (requires TypeScript compilation)
- `cd symphony-react-app && npm run preview` - Preview the production build
- `cd symphony-react-app && npm run test` - Run unit tests with Vitest
- `cd symphony-react-app && npm run test:ui` - Run unit tests with Vitest UI
- `cd symphony-react-app && npm run test:e2e` - Run end-to-end tests with Playwright
- `cd symphony-react-app && npm run test:e2e:ui` - Run e2e tests with Playwright UI
- `cd symphony-react-app && npm run lint` - Run ESLint for code quality

## Architecture Overview

This is a dual-purpose repository containing both data processing scripts and a React application for exploring Symphony oceanic layers.

### Data Pipeline
1. **Source Data**: Symphony layer metadata, P02 parameter vocabulary, and dataset catalogues in `data/`
2. **Processing Scripts**: Python scripts analyze and enhance the raw data using AI (OpenRouter API)
3. **Web-Ready Data**: Processed JSON files in `symphony-react-app/public/data/` optimized for the React application

### Core Components

**Data Processing Layer**:
- `SimplifiedDatasetMerger` class in `merge_datasets.py` - Combines metadata with availability indexes and improvement analysis
- `LayerImprovementAnalyzer` class in `analyze_layer_improvements.py` - AI analysis of layer improvement potential
- `SymphonyP02MatcherV2` class in `match_symphony_to_p02.py` - AI matching of Symphony layers to P02 parameters
- `DataAvailabilityCalculator` class in `calculate_data_availability_index.py` - Computes data availability indexes

**React Web Application**:
- `App.tsx` - Main application component with HashRouter routing
- React components in `symphony-react-app/src/components/` for UI elements (Header, Footer, LayerCard, SearchFilters, etc.)
- Custom hooks in `symphony-react-app/src/hooks/` for data fetching (`useData.ts`) and search functionality (`useSearch.ts`)
- Data services in `symphony-react-app/src/services/` for API communication (`dataService.ts`)
- Pages in `symphony-react-app/src/pages/` (LayerListPage, LayerDetailPage, DatasetTablePage)
- TypeScript for type safety and Tailwind CSS for styling
- Responsive design with mobile support
- Vitest for unit testing and Playwright for e2e testing

### Data Flow
```
Raw Excel/PDF → Python processing scripts → Enhanced JSON files → React app → GitHub Pages
```

### Key Data Files
**Source Data** (in `data/`):
- `symphony_layer_metadata.json` - Core layer information from Symphony
- `p02.jsonld` - SeaDataNet parameter vocabulary (468 oceanographic parameters)
- `catalogue.json` - Dataset catalogue with P02 parameter mappings
- `symphony_p02_matches.json` - AI-generated matches between Symphony layers and P02 parameters
- `symphony_improvement_analysis.json` - AI-generated improvement analysis for each layer
- `symphony_data_availability_index.json` - Calculated availability indexes for layers

**Web-Ready Data** (in `symphony-react-app/public/data/`):
- `symphony_layers.json` - Complete enhanced layer data for React app
- `p02_analysis.json` - P02 parameter availability analysis
- `catalogue.json` - Dataset catalogue (copy of source)

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
5. Vite is configured with the correct base path (`/Symphony-Layers-Interactive-Explorer/`) for GitHub Pages
6. Uses HashRouter for client-side routing compatibility with GitHub Pages

## File Structure Notes

- `symphony-react-app/public/data/` contains web-optimized JSON files (different from `data/` which has raw/intermediate files)
- `symphony-react-app/src/` contains React application source code organized into:
  - `components/` - Reusable UI components (Header, Footer, LayerCard, SearchFilters, etc.)
  - `hooks/` - Custom React hooks with tests in `__tests__/` subdirectory
  - `pages/` - Main page components (LayerListPage, LayerDetailPage, DatasetTablePage)
  - `services/` - Data fetching and API services with tests in `__tests__/` subdirectory
  - `types/` - TypeScript type definitions
- `old/` directory contains legacy Excel files and earlier processing attempts
- All Python scripts include comprehensive error handling and progress reporting
- The React application is entirely client-side with no server dependencies beyond the Vite dev server
- `screenshots/` directory contains project screenshots and testing artifacts
- When using playwright use: `npx playwright screenshot [url] [png filename]`
- Save screenshots in the appropriate `screenshots/` directory to avoid cluttering the codebase