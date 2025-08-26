# Symphony Layers Interactive Explorer

Interactive web application for exploring Symphony oceanic layers with AI-powered analysis and P02 parameter mapping for marine spatial planning.

## About Symphony

**Symphony** is a quantitative marine spatial planning tool developed by the Swedish Agency for Marine and Water Management (HaV) to assess cumulative environmental impacts in marine ecosystems. It provides a scientifically transparent method for ecosystem-based marine spatial planning.

### What are Symphony Layers?

Symphony uses **ecosystem component layers** that represent different marine ecosystem distributions across Swedish waters. These layers include:
- Marine habitats and species distributions
- Benthic communities and seafloor characteristics  
- Water column properties and oceanographic features
- Protected areas and conservation values

Each layer is mapped on a 250×250 meter grid and represents a specific aspect of the marine environment that can be affected by human activities.

### Purpose of this Tool

This interactive explorer helps researchers, planners, and stakeholders:
- **Explore** the 73+ Symphony ecosystem layers with enhanced metadata
- **Analyze** improvement possibilities for data quality and coverage
- **Understand** connections between layers and oceanographic parameters (P02 vocabulary)
- **Support** evidence-based marine spatial planning decisions
- **Contribute** to sustainable use of marine resources and environmental protection

The tool combines Symphony's ecosystem data with AI-powered analysis to identify opportunities for enhancing marine spatial planning capabilities through improved data collection and satellite remote sensing.

**References:**
- [Symphony methodology and applications](https://link.springer.com/article/10.1007/s11625-022-01286-w) (Springer)
- [Symphony planning tool overview](https://www.havochvatten.se/planering-forvaltning-och-samverkan/havsplanering/svensk-havsplanering/havsplaneringsprocessen/att-ta-fram-planforslag/symphony---ett-planeringsverktyg-for-havsplanering.html) (Swedish Agency for Marine and Water Management)

## Quick Start

### React Web Application

**Development Server:**
```bash
cd symphony-react-app
npm install
npm run dev --host
```
- Access at `http://localhost:5173` (local) or the provided network URL (external access)
- **Container Access**: Use `--host` flag to make dev server accessible outside the container
- **Important**: Only run ONE development server to avoid port conflicts

**Production Build:**
```bash
cd symphony-react-app
npm run build
npm run preview
```
- Build output in `symphony-react-app/dist/`
- For GitHub Pages: Enable Pages, deploy from `main` branch `/symphony-react-app/dist` folder

**Testing:**
```bash
cd symphony-react-app
npm run test          # Unit tests with Vitest
npm run test:e2e      # End-to-end tests with Playwright
npm run lint          # Code quality checks
```

### Data Processing (requires OpenRouter API key)
```bash
pip install -r requirements.txt
export OPEN_ROUTER_API_KEY="your_key"

# Run processing pipeline
python analyze_layer_improvements.py      # AI improvement analysis
python match_symphony_to_p02.py          # AI P02 parameter matching  
python calculate_data_availability_index.py  # Availability calculations
python merge_datasets.py                 # Merge data for web app
```

## Data Files

### 📁 Source Data (manually created/curated)
- **`symphony_layer_metadata.json`** - Core Symphony layer metadata (March 2019 report)
- **`p02.jsonld`** - SeaDataNet parameter vocabulary (468 parameters)
- **`catalogue.json`** - Dataset catalogue with P02 mappings
- **`p02_analysis.json`** - P02 parameter availability analysis

### 🤖 Generated Data (created by Python scripts)
- **`symphony_improvement_analysis.json`** - ← `analyze_layer_improvements.py`
- **`symphony_p02_matches.json`** - ← `match_symphony_to_p02.py`  
- **`symphony_data_availability_index.json`** - ← `calculate_data_availability_index.py`
- **`symphony-react-app/public/data/symphony_layers.json`** - ← `merge_datasets.py` (enhanced)
- **`symphony-react-app/public/data/p02_analysis.json`** - ← `merge_datasets.py`
- **`symphony-react-app/public/data/catalogue.json`** - ← `merge_datasets.py`

## Processing Scripts

| Script | Purpose | AI Model | Input | Output |
|--------|---------|----------|--------|--------|
| `analyze_layer_improvements.py` | Assess improvement potential & difficulty | `gemini-2.5-flash` | metadata | improvement analysis |
| `match_symphony_to_p02.py` | Match layers to P02 parameters | `gemini-2.5-pro` | metadata + p02 | parameter matches |
| `calculate_data_availability_index.py` | Calculate availability metrics | - | matches + analysis | availability index |
| `merge_datasets.py` | Combine data for web app | - | all processed data | web-ready files |

## Architecture

**Data Flow:** Raw Excel/PDF → Python Scripts → Enhanced JSON → React App → GitHub Pages

**Core Components:**
- React application built with TypeScript and Vite
- `symphony-react-app/src/App.tsx` - Main application with HashRouter
- React components for UI (LayerCard, SearchFilters, Header, Footer)
- Custom hooks for data fetching and search functionality
- Tailwind CSS for styling with responsive design
- Vitest for unit testing, Playwright for e2e testing

## API Requirements

**OpenRouter API** (for AI analysis only):
- Environment: `OPEN_ROUTER_API_KEY` or `OPEN_ROUTER_KEY`
- Models: `gemini-2.5-flash`, `gemini-2.5-pro`
- Rate limit: 1 second between requests
- Cost: ~30-60 API calls for full analysis

**Note:** React web app requires no API key, only the data processing scripts do.

## File Structure

```
Symphony-Layers-Interactive-Explorer/
├── data/                     # Source data + generated files
├── symphony-react-app/       # React web application
│   ├── src/                  # React source code
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Main page components
│   │   ├── services/         # Data services
│   │   └── types/            # TypeScript types
│   ├── public/data/          # Web-optimized data
│   ├── dist/                 # Production build (GitHub Pages ready)
│   └── package.json
├── analyze_layer_improvements.py
├── match_symphony_to_p02.py
├── calculate_data_availability_index.py
├── merge_datasets.py
└── requirements.txt
```
