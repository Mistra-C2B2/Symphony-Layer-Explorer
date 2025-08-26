# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Data Processing Pipeline
All data processing scripts are located in `data-pipeline/scripts/`. Run from the scripts directory:

```bash
cd data-pipeline/scripts
```

**Full Pipeline Workflow:**
1. `python analyze_layer_improvements.py` - AI analysis of improvement potential, difficulty, and satellite sensing capabilities
2. `python match_symphony_to_p02.py` - AI matching of Symphony layers to P02 oceanographic parameters  
3. `python calculate_data_availability_index.py` - Calculate data availability indexes from P02 parameter availability
4. `python merge_datasets.py` - Combine all data and output to React app's public/data directory

**Requirements:**
- `cd data-pipeline && pip install -r requirements.txt` - Install Python dependencies
- Set `OPEN_ROUTER_API_KEY` environment variable for AI-powered scripts (steps 1-2)

### Website Development
The React application is in `react-web-app/` directory. It uses Vite as the build tool and is configured for GitHub Pages deployment.

**Development Server**: 
- `cd react-web-app && npm run dev` - Start Vite dev server (defaults to localhost:5173)
- `cd react-web-app && npm run dev --host` - Start Vite dev server accessible on all interfaces
- **Important**: Only run ONE development server process to avoid port conflicts

**Build and Testing**:
- `cd react-web-app && npm run build` - Build the production version (requires TypeScript compilation)
- `cd react-web-app && npm run preview` - Preview the production build
- `cd react-web-app && npm run test` - Run unit tests with Vitest
- `cd react-web-app && npm run test:ui` - Run unit tests with Vitest UI
- `cd react-web-app && npm run test:e2e` - Run end-to-end tests with Playwright
- `cd react-web-app && npm run test:e2e:ui` - Run e2e tests with Playwright UI
- `cd react-web-app && npm run lint` - Run ESLint for code quality

## Architecture Overview

This is a dual-purpose repository containing both data processing scripts and a React application called "Symphony Layer Explorer" for exploring Symphony oceanic layers.

### Data Pipeline
1. **Source Data**: Symphony layer metadata, P02 parameter vocabulary, and dataset catalogues in `data/`
2. **Processing Scripts**: Python scripts analyze and enhance the raw data using AI (OpenRouter API)
3. **Web-Ready Data**: Processed JSON files in `react-web-app/public/data/` optimized for the React application

### Core Components

**Data Processing Pipeline** (in `data-pipeline/`):
- `SimplifiedDatasetMerger` class in `scripts/merge_datasets.py` - Combines metadata with availability indexes and improvement analysis
- `LayerImprovementAnalyzer` class in `scripts/analyze_layer_improvements.py` - AI analysis of layer improvement potential
- `SymphonyP02MatcherV2` class in `scripts/match_symphony_to_p02.py` - AI matching of Symphony layers to P02 parameters
- `DataAvailabilityCalculator` class in `scripts/calculate_data_availability_index.py` - Computes data availability indexes

**React Web Application**:
- `App.tsx` - Main application component with HashRouter routing
- React components in `react-web-app/src/components/` for UI elements (Header, Footer, LayerCard, SearchFilters, etc.)
- Custom hooks in `react-web-app/src/hooks/` for data fetching (`useData.ts`) and search functionality (`useSearch.ts`)
- Data services in `react-web-app/src/services/` for API communication (`dataService.ts`)
- Pages in `react-web-app/src/pages/` (LayerListPage, LayerDetailPage, DatasetTablePage)
- TypeScript for type safety and Tailwind CSS for styling
- Responsive design with mobile support
- Vitest for unit testing and Playwright for e2e testing

### Data Flow
```
Raw Data → Python Processing Pipeline → Enhanced JSON Files → React App → GitHub Pages
   ↓              ↓                         ↓                 ↓
source-data → data-pipeline/scripts → output → react-web-app/public/data
```

### Key Data Files
**Source Data** (in `data-pipeline/source-data/`):
- `symphony_layer_metadata.json` - Core layer information from Symphony
- `p02.jsonld` - SeaDataNet parameter vocabulary (468 oceanographic parameters)  
- `catalogue.json` - Dataset catalogue with P02 parameter mappings
- `symphony_p02_matches.json` - AI-generated matches between Symphony layers and P02 parameters
- `analysis_context.txt` - Context file for AI analysis

**Processed Data** (in `data-pipeline/output/`):
- `symphony_improvement_analysis.json` - AI-generated improvement analysis for each layer
- `symphony_data_availability_index.json` - Calculated availability indexes for layers
- `p02_analysis.json` - P02 parameter availability analysis  
- `symphony_layers.json` - Intermediate combined data

**Web-Ready Data** (in `react-web-app/public/data/`):
- `symphony_layers.json` - Complete enhanced layer data for React app
- `p02_analysis.json` - P02 parameter availability analysis (copy)
- `catalogue.json` - Dataset catalogue (copy)

## API Dependencies

Scripts using AI analysis require OpenRouter API access:
- Set `OPEN_ROUTER_API_KEY` or `OPEN_ROUTER_KEY` environment variable
- Used models: `google/gemini-2.5-flash` (analysis), `google/gemini-2.5-pro` (matching)
- Rate limited to 1 second between requests

## Deployment

The React application is configured for GitHub Pages deployment:
1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch" with `main` branch and `/react-web-app/dist` folder
3. Build the application: `cd react-web-app && npm run build`
4. The `dist/` folder contains the production build ready for deployment
5. Vite is configured with the correct base path (`/Symphony-Layer-Explorer/`) for GitHub Pages
6. Uses HashRouter for client-side routing compatibility with GitHub Pages

## File Structure Notes

**Data Pipeline** (`data-pipeline/`):
- `source-data/` - Raw input data files (Symphony metadata, P02 vocabulary, catalogue)
- `output/` - Processed intermediate files generated by scripts
- `scripts/` - Python processing scripts with comprehensive error handling and progress reporting
- `requirements.txt` - Python dependencies for the data pipeline
- `README.md` - Detailed data pipeline documentation
- `.gitignore` - Python-specific ignore patterns

**React Application** (`react-web-app/`):
- `public/data/` - Web-optimized JSON files for the React app (copied from data pipeline output)
- `src/` - React application source code organized into:
  - `components/` - Reusable UI components (Header, Footer, LayerCard, SearchFilters, etc.)
  - `hooks/` - Custom React hooks with tests in `__tests__/` subdirectory
  - `pages/` - Main page components (LayerListPage, LayerDetailPage, DatasetTablePage)
  - `services/` - Data fetching and API services with tests in `__tests__/` subdirectory
  - `types/` - TypeScript type definitions
- `screenshots/` - App-specific screenshots and testing artifacts
- The React application is entirely client-side with no server dependencies beyond the Vite dev server

**Root Level**:
- `.github/workflows/` - Single GitHub Actions configuration for deployment
- `old/` directory contains legacy Excel files and earlier processing attempts
- When using playwright: `cd react-web-app && npx playwright screenshot [url] [png filename]`