# Symphony Layers Interactive Explorer

A Streamlit web application for exploring and analyzing data layers used in the Symphony marine spatial planning tool developed by the Swedish Marine and Water Authority.

## 🔗 Access

**Live Application:** [mistra-c2b2-symphony-layers-interactive-explorer-interface.streamlit.app/](https://mistra-c2b2-symphony-layers-interactive-explorer-interface.streamlit.app/)

## 📋 Overview

The Symphony Layers Interactive Explorer provides a transparent overview of the data layers used within the **Symphony tool**, supporting marine spatial planning and environmental assessments. Symphony is used to assess human pressures and their impacts on marine ecosystems, enabling data-driven decision-making for marine environments.

## 🎯 Key Features

### 1. **Explore Symphony Layers**
Browse all layers used in Symphony, organized into three main categories:
- **Ecosystem Components** - Interactive wheel visualization
- **Pressures** - Interactive wheel visualization  
- **Source Data** - Direct selection interface

### 2. **Identify Data Improvement Opportunities**
Each layer includes:
- Detailed summaries based on the Symphony Metadata Report (March 2019)
- Specific recommendations for data quality enhancement
- Data availability indicators with visual smiley representations

### 3. **Support Dataset Discovery**
- Access to comprehensive dataset catalogues
- Parameter availability indices for data quality assessment
- Related parameter exploration for targeted improvements
- Direct links to dataset sources

## 📊 Data Quality Indicators

- **📚 High Data Availability** (≥67%): Books emoji
- **📄 Medium Data Availability** (31-66%): Page emoji  
- **📔 Low Data Availability** (≤30%): Notebook emoji

- **‼️ Highly Valuable**: Double exclamation
- **❗ Moderately Valuable**: Single exclamation
- **❕ Less Valuable**: Grey exclamation

## 🛠️ Technical Details

### Dependencies
- **Streamlit** - Web application framework
- **Plotly** - Interactive visualizations and donut charts
- **Pandas** - Data manipulation and analysis
- **OpenPyXL** - Excel file processing
- **streamlit-plotly-events** - Interactive chart events

### Data Sources
- `df_SYMPHONY_LAYERS.xlsx` - Main Symphony layer data
- `df_recommendation_related_parameters.xlsx` - Parameter recommendations
- `df_filtred_catalogue.xlsx` - Dataset catalogue
- `df_REFERENCE_PARAMETERS.xlsx` - Reference parameter definitions

### Color Scheme
The application uses a consistent color mapping for different themes:
- Birds: #5b9bd5
- Fish: #ed7d31  
- Fish function: #a5a5a5
- Habitat: #ffc000
- Marine Mammals: #4472c4
- Plants: #70ad47
- Human activities (various): Custom color palette

## 🔍 How to Use

1. **Select a Category**: Choose from Ecosystem, Pressure, or Source Data
2. **Explore Layers**: Click on wheel segments or select from dropdown
3. **Review Details**: Access summaries, recommendations, and data availability
4. **Discover Datasets**: Explore related parameters and find relevant datasets
5. **Access Sources**: Use provided links to download or access original data

## 📚 Additional Resources

- **Symphony Tool Repository**: [MSP-Symphony GitHub](https://github.com/Mistra-C2B2/MSP-Symphony)
- **Metadata Report**: [Symphony Metadata March 2019](https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/Symphony%20Metadata%20March%202019.pdf)
- **Reference Parameters**: [REFERENCE_PARAMETERS Documentation](https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/df_REFERENCE_PARAMETERS.md)
- **Dataset Catalogue**: [Catalogue_V22.xlsm](https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/Catalogue_V22.xlsm)

## ⚠️ Important Notes

- Related parameter lists are based on current recommendations and understanding
- Lists are not exhaustive - users should explore full parameter catalogues for comprehensive dataset discovery
- Tool is designed for stakeholders, researchers, and decision-makers in marine spatial planning

## 🏛️ About

Developed to support the Symphony tool by the Swedish Marine and Water Authority, this explorer facilitates understanding of data limitations, guides improvement efforts, and provides access to alternative data sources for marine spatial planning applications.
