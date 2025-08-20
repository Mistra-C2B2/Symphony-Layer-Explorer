# Symphony Layers Interactive Explorer

Interactive web application for exploring Symphony oceanic layers with AI-powered analysis and P02 parameter mapping for marine spatial planning.

## Quick Start

### Web Application
- Open `docs/index.html` in browser, or serve the `docs/` directory
- For GitHub Pages: Enable Pages, deploy from `/docs` folder

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
- **`docs/data/symphony_layer_metadata.json`** - ← `merge_datasets.py` (enhanced)
- **`docs/data/summary_statistics.json`** - ← `merge_datasets.py`

## Processing Scripts

| Script | Purpose | AI Model | Input | Output |
|--------|---------|----------|--------|--------|
| `analyze_layer_improvements.py` | Assess improvement potential & difficulty | `gemini-2.5-flash` | metadata | improvement analysis |
| `match_symphony_to_p02.py` | Match layers to P02 parameters | `gemini-2.5-pro` | metadata + p02 | parameter matches |
| `calculate_data_availability_index.py` | Calculate availability metrics | - | matches + analysis | availability index |
| `merge_datasets.py` | Combine data for web app | - | all processed data | web-ready files |

## Architecture

**Data Flow:** Raw Excel/PDF → Python Scripts → Enhanced JSON → Static Web App → GitHub Pages

**Core Components:**
- `docs/js/app.js` - Main SymphonyApp class
- `docs/js/data-loader.js` - JSON data loading
- Chart.js integration for interactive visualizations
- Responsive design with mobile support

## API Requirements

**OpenRouter API** (for AI analysis only):
- Environment: `OPEN_ROUTER_API_KEY` or `OPEN_ROUTER_KEY`
- Models: `gemini-2.5-flash`, `gemini-2.5-pro`
- Rate limit: 1 second between requests
- Cost: ~30-60 API calls for full analysis

**Note:** Web app requires no API key, only the data processing scripts do.

## File Structure

```
Symphony-Layers-Interactive-Explorer/
├── data/                     # Source data + generated files
├── docs/                     # Web application (GitHub Pages ready)
│   ├── index.html
│   ├── js/app.js
│   └── data/                 # Web-optimized data
├── analyze_layer_improvements.py
├── match_symphony_to_p02.py
├── calculate_data_availability_index.py
├── merge_datasets.py
└── requirements.txt
```
