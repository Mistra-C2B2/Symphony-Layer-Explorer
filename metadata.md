# Dataset Catalogue Metadata Schema

This document describes the metadata schema for the Symphony Layers dataset catalogue containing **513 datasets** from various marine data sources.

## Field Descriptions

### Identification
- **`id_dataset`** – A unique numeric identifier assigned to each dataset in the catalogue. Mandatory field (1-513).
- **`language`** – The language of the dataset's metadata or documentation (e.g., EN, SE). Optional.

### Dataset Information
- **`source`** – The data provider or platform from which the dataset originates. Major sources include:
  - Copernicus Marine Service
  - HELCOM 
  - ICES
  - EMODnet
  - National research institutions
  - Academic databases
- **`name`** – The dataset's title or name. Optional (a few entries missing).

### Data Acquisition
- **`aquisition_source`** – The primary mode of data acquisition:
  - `satellite` – Data derived from remote sensing satellites
  - `model` – Data produced by numerical models  
  - `in situ system` – Measurements taken directly in the field
- **`aquisition_detail`** – Additional detail about the platform or system used (e.g., specific satellite, vessel, buoy type). Optional and often empty.

### Parameters & Content
- **`detailed_parameters`** – Comma-separated list of variables/parameters included in the dataset (e.g., chlorophyll-a, nutrients, suspended particulate material). Linked to the SeaDataNet Parameter Discovery Vocabulary. Optional but crucial for parameter matching.

### Spatial Information
- **`spatial_representation`** – Indicates how spatial data are represented:
  - `grid` – Gridded/raster data
  - `vector` – Vector/point data
- **`horizontal_resolution`** – The horizontal spatial resolution (e.g., "2 x 2 km", "1 x 1 nm", "0.1°"). Optional; format varies.
- **`vertical_resolution`** – The vertical resolution as numeric value (e.g., depth intervals, number of levels). Optional; often missing.
- **`geographical_coverage_name`** – Named area or region covered by the dataset (e.g., "Baltic Sea", "Skagerrak", "Sea of Bothnia"). Optional.

### Geographic Bounds
- **`bounding_box_s`** – Southern latitude boundary (decimal degrees)
- **`bounding_box_n`** – Northern latitude boundary (decimal degrees)  
- **`bounding_box_w`** – Western longitude boundary (decimal degrees)
- **`bounding_box_e`** – Eastern longitude boundary (decimal degrees)

*Note: Bounding box coordinates are optional; often missing for irregular or point-based datasets.*

### Temporal Information
- **`temporal_resolution`** – Time interval of data collection or aggregation:
  - `D` – Daily
  - `M` – Monthly  
  - `W` – Weekly
  - `SEAS` – Seasonal
  - `Y` – Yearly
  - `IRR` – Irregular
- **`update_frequency`** – How often the dataset is updated:
  - `D` – Daily
  - `M` – Monthly
  - `BA` – Biannual  
  - `A` – Annual
  - `C` – Continuous
  - `IRR` – Irregular

### Temporal Coverage
- **`start_day`**, **`start_month`**, **`start_year`** – Start date of the dataset. Optional; year is more commonly present than day/month.
- **`end_day`**, **`end_month`**, **`end_year`** – End date of the dataset. Optional; often "ongoing" or blank for continuing datasets.

### Technical Information  
- **`format`** – File format(s) of the dataset, from SeaDataNet L24 code list:
  - `CF_NetCDF` – Climate and Forecast NetCDF
  - `ODV` – Ocean Data View format
  - `Shapefile` – ESRI Shapefile
  - `GEOTIFF` – Geographic Tagged Image File Format
  - `PNG`, `TIFF` – Image formats
- **`code_accessibility`** – License or access restrictions, from SeaDataNet L08 code list:
  - `unrestricted` – Open access
  - `CC BY 4.0` – Creative Commons Attribution
  - `CC0 1.0` – Creative Commons Zero
  - `SDN licence` – SeaDataNet license
  - `restricted` – Access limitations apply

### References
- **`doi`** – Digital Object Identifier or equivalent persistent link to the dataset. Optional but recommended for data citation.

## Data Quality Notes

- **Total Records**: 513 datasets
- **Mandatory Fields**: Only `id_dataset` is consistently populated
- **Optional Fields**: Most metadata fields are optional, leading to variable completeness
- **Geographic Focus**: Primarily covers Baltic Sea and North Atlantic marine areas
- **Parameter Standardization**: Uses SeaDataNet vocabulary for parameter naming consistency
