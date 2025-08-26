# Symphony Layer Explorer

Interactive web application for exploring Symphony oceanic layers with AI-powered analysis and P02 parameter mapping for marine spatial planning.

## About Symphony

[Symphony](https://www.havochvatten.se/en/eu-and-international/marine-spatial-planning/swedish-marine-spatial-planning/the-marine-spatial-planning-process/development-of-plan-proposals/symphony---a-tool-for-ecosystem-based-marine-spatial-planning.html) is a quantitative marine spatial planning tool developed by the Swedish Agency for Marine and Water Management (HaV) to assess cumulative environmental impacts in marine ecosystems. It provides a scientifically transparent method for ecosystem-based marine spatial planning.

### Purpose of this Tool

his tool is meant to help students, researchers, planners, enthusiasts, and stakeholders improve the data layers used by Symphony.

**References:**
- [Symphony methodology and applications](https://link.springer.com/article/10.1007/s11625-022-01286-w) (Springer)
- [Symphony planning tool overview](https://www.havochvatten.se/planering-forvaltning-och-samverkan/havsplanering/svensk-havsplanering/havsplaneringsprocessen/att-ta-fram-planforslag/symphony---ett-planeringsverktyg-for-havsplanering.html) (Swedish Agency for Marine and Water Management)

## Quick Start

### Data Processing Pipeline

Generate the enhanced data files for the web application using AI-powered analysis:

**Prerequisites:**
```bash
# Install Python dependencies
cd data-pipeline
pip install -r requirements.txt

# Set OpenRouter API key for AI analysis
export OPEN_ROUTER_API_KEY="your_key_here"
```

**Run the Full Pipeline:**
```bash
cd data-pipeline/scripts

# Step 1: AI analysis of improvement potential and satellite capabilities
python analyze_layer_improvements.py

# Step 2: AI matching of Symphony layers to P02 oceanographic parameters
python match_symphony_to_p02.py

# Step 3: Calculate data availability indexes from P02 parameter availability
python calculate_data_availability_index.py

# Step 4: Merge all data and output to React app's public/data directory
python merge_datasets.py
```

**Pipeline Output:**
- Creates enhanced JSON files in `data-pipeline/output/`
- Copies web-ready data to `react-web-app/public/data/`
- Ready for React application development and deployment

### React Web Application Development

**Development Server:**
```bash
cd react-web-app
npm install
npm run dev --host
```
- Access at `http://localhost:5173/Symphony-Layer-Explorer/` (local)
- **Container Access**: Use `--host` flag to make dev server accessible outside the container
- **Important**: Only run ONE development server to avoid port conflicts

**Production Build:**
```bash
cd react-web-app
npm run build
npm run preview
```
- Build output in `react-web-app/dist/`
- For GitHub Pages: Enable Pages, deploy from `main` branch `/react-web-app/dist` folder

**Testing:**
```bash
cd react-web-app
npm run test          # Unit tests with Vitest
npm run test:e2e      # End-to-end tests with Playwright
npm run lint          # Code quality checks
```

## Data Files

### 📁 Source Data (manually created/curated)
Located in `data-pipeline/source-data/`:
- **`symphony_layer_metadata.json`** - Core Symphony layer metadata (March 2019 report)
- **`p02.jsonld`** - SeaDataNet parameter vocabulary (468 parameters)
- **`catalogue.json`** - Dataset catalogue with P02 mappings
- **`p02_analysis.json`** - P02 parameter availability analysis

### 🤖 Generated Data (created by Python scripts)
- **`data-pipeline/output/symphony_improvement_analysis.json`** - ← `analyze_layer_improvements.py`
- **`data-pipeline/output/symphony_p02_matches.json`** - ← `match_symphony_to_p02.py`  
- **`data-pipeline/output/symphony_data_availability_index.json`** - ← `calculate_data_availability_index.py`
- **`react-web-app/public/data/symphony_layers.json`** - ← `merge_datasets.py` (enhanced)
- **`react-web-app/public/data/p02_analysis.json`** - ← `merge_datasets.py`
- **`react-web-app/public/data/catalogue.json`** - ← `merge_datasets.py`

## Processing Scripts

Located in `data-pipeline/scripts/`:

| Script | Purpose | AI Model | Input | Output |
|--------|---------|----------|--------|--------|
| `analyze_layer_improvements.py` | Assess improvement potential & difficulty | `gemini-2.5-flash` | source metadata | improvement analysis |
| `match_symphony_to_p02.py` | Match layers to P02 parameters | `gemini-2.5-pro` | metadata + p02 vocab | parameter matches |
| `calculate_data_availability_index.py` | Calculate availability metrics | - | matches + analysis | availability index |
| `merge_datasets.py` | Combine data for React app | - | all processed data | web-ready JSON files |

## Architecture

**Data Flow:** Raw Data → Data Pipeline Scripts → Enhanced JSON → React App → GitHub Pages

**Core Components:**

**Data Pipeline** (in `data-pipeline/`):
- Python scripts with AI-powered analysis using OpenRouter API
- Enhanced data processing with improvement analysis and P02 matching
- Automated output to React app's public directory

**React Application** (in `react-web-app/`):
- Built with TypeScript, Vite, and Tailwind CSS
- `src/App.tsx` - Main application with HashRouter routing
- Responsive UI components (LayerCard, SearchFilters, Header, Footer)
- Custom hooks for data fetching and search functionality
- Comprehensive testing with Vitest (unit) and Playwright (e2e)
