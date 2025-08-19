# Data Processing Requirements for Symphony Layers Explorer

## Current Data Directory Files

The `data/` directory contains these files:
- `catalogue.json` - Dataset catalogue with P02 parameter mappings
- `p02.jsonld` - P02 oceanographic parameter vocabulary (468 parameters)
- `p02_analysis.json` - P02 parameter availability analysis (dictionary format)
- `symphony_data_availability_index.json` - Calculated availability indexes per layer
- `symphony_improvement_analysis.json` - AI-generated improvement potential analysis
- `symphony_layer_metadata.json` - Core Symphony layer metadata
- `symphony_p02_matches.json` - AI-matched P02 parameters per Symphony layer

## Web Application Expected Files

The `data-loader.js` expects these files:
- `symphony_layers.json` ❌ **Missing**
- `reference_parameters.json` ❌ **Missing**  
- `recommendation_parameters.json` ❌ **Missing**
- `catalogue.json` ✅ **Available**
- `symphony_layer_metadata.json` ✅ **Available** (needs enhancement)
- `symphony_p02_matches.json` ✅ **Available**
- `summary_statistics.json` ❌ **Missing**

## Required Data Processing

### 1. Extract Basic Layer Information
**Create: `symphony_layers.json`**
- **Source:** `symphony_layer_metadata.json`
- **Purpose:** Simplified layer list for initial display
- **Content:** Extract `Name` field as `title` from each metadata entry
- **Why:** Web app needs lightweight layer list for browsing before loading full metadata

### 2. Process P02 Parameter Vocabulary
**Create: `reference_parameters.json`**  
- **Source:** `p02.jsonld`
- **Purpose:** Searchable P02 parameter definitions
- **Content:** Transform JSON-LD format to simple array of parameter objects
- **Why:** Web app needs parameter lookup by ID for displaying parameter details

### 3. Create Layer-Parameter Mapping
**Create: `recommendation_parameters.json`**
- **Source:** `symphony_p02_matches.json`
- **Purpose:** Map layer names to array of parameter IDs  
- **Content:** Transform matches into simplified lookup structure
- **Why:** Web app needs fast lookup of which parameters relate to each layer

### 4. Enhance Layer Metadata
**Update: `symphony_layer_metadata.json`**
- **Sources:** Current metadata + `symphony_data_availability_index.json` + `symphony_improvement_analysis.json`
- **Purpose:** Combine all layer information into single enhanced metadata file
- **Content:** Merge availability indexes and improvement analysis into each layer's metadata
- **Why:** Reduces API calls and provides complete layer information in one place

### 5. Generate Summary Statistics
**Create: `summary_statistics.json`**
- **Sources:** Enhanced metadata + availability data + improvement analysis
- **Purpose:** Application-wide statistics and metrics
- **Content:** Overall counts, averages, distributions of improvement potential, difficulty, etc.
- **Why:** Web app needs summary data for dashboard and filtering capabilities

## Processing Strategy

The `merge_datasets.py` script should be updated to:

1. **Extract layer basics** from `symphony_layer_metadata.json` 
2. **Parse P02 vocabulary** from `p02.jsonld`
3. **Simplify parameter mappings** from `symphony_p02_matches.json`
4. **Merge enhancement data** into metadata
5. **Calculate summary statistics** across all data
6. **Output all required files** to support the web application

## Benefits of This Approach

1. **Performance:** Web app loads only needed data at each step
2. **Separation of Concerns:** Different data aspects in dedicated files
3. **Caching:** Individual files can be cached independently
4. **Maintainability:** Clear data pipeline from sources to web application
5. **Flexibility:** Additional analysis can be merged without restructuring

## Implementation Priority

1. **High Priority:** Create missing core files (symphony_layers.json, reference_parameters.json)
2. **Medium Priority:** Enhance metadata with availability/improvement data  
3. **Low Priority:** Generate summary statistics for dashboard features

This processing approach ensures the web application has access to all necessary data in the expected format while maintaining good performance and separation of concerns.