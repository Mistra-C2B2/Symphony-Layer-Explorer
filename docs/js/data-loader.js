/**
 * Simplified Data Loading System for Symphony Layers Explorer
 * Loads only 3 essential files: symphony_layers.json, p02_analysis.json, catalogue.json
 */

class DataLoader {
    constructor() {
        this.data = {
            symphonyLayers: null,      // Complete layer data with all merged information
            p02Analysis: null,         // P02 parameter availability analysis
            catalogue: null            // Dataset catalogue with P02 parameter mappings
        };
        this.loaded = false;
        this.loading = false;
        
        // Indexes for fast lookups (created after loading)
        this.layersByName = new Map();
        this.p02ById = new Map();
        this.datasetsByParameter = new Map();
    }

    async loadAll() {
        if (this.loading) return;
        if (this.loaded) return this.data;
        
        this.loading = true;
        
        try {
            console.log('Loading Symphony data...');
            
            // Load the 3 essential files
            const [symphonyLayers, p02Analysis, catalogue] = await Promise.all([
                this.fetchJSON('data/symphony_layers.json'),
                this.fetchJSON('data/p02_analysis.json'),
                this.fetchJSON('data/catalogue.json')
            ]);

            this.data.symphonyLayers = symphonyLayers;
            this.data.p02Analysis = p02Analysis;
            this.data.catalogue = catalogue;

            // Create indexes for fast lookups
            this.createIndexes();
            
            this.loaded = true;
            console.log('All data loaded successfully');
            
            return this.data;
            
        } catch (error) {
            console.error('Failed to load data:', error);
            throw new Error(`Failed to load application data: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }

    async fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`✓ Loaded ${url}: ${Array.isArray(data) ? data.length : Object.keys(data).length} items`);
            return data;
        } catch (error) {
            console.error(`✗ Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    createIndexes() {
        console.log('Creating data indexes...');
        
        // Index symphony layers by name (case-insensitive)
        this.layersByName.clear();
        this.data.symphonyLayers.forEach(layer => {
            if (layer.Name) {
                this.layersByName.set(layer.Name.toLowerCase(), layer);
            }
        });

        // Index P02 parameters by ID
        this.p02ById.clear();
        Object.entries(this.data.p02Analysis).forEach(([id, paramData]) => {
            this.p02ById.set(id, { id, ...paramData });
        });

        // Index datasets by P02 parameters
        this.datasetsByParameter.clear();
        this.data.catalogue.forEach(dataset => {
            if (dataset.p02_parameters && Array.isArray(dataset.p02_parameters)) {
                dataset.p02_parameters.forEach(paramName => {
                    const paramNameLower = paramName.toLowerCase();
                    if (!this.datasetsByParameter.has(paramNameLower)) {
                        this.datasetsByParameter.set(paramNameLower, []);
                    }
                    this.datasetsByParameter.get(paramNameLower).push(dataset);
                });
            }
        });

        console.log('✓ Indexes created successfully');
        console.log(`  ${this.layersByName.size} layers indexed`);
        console.log(`  ${this.p02ById.size} P02 parameters indexed`);
        console.log(`  ${this.datasetsByParameter.size} parameter-dataset mappings created`);
    }

    // === LAYER ACCESS METHODS ===
    
    getSymphonyLayers() {
        return this.data.symphonyLayers || [];
    }

    getLayerByTitle(title) {
        return this.layersByName.get(title.toLowerCase());
    }

    getLayerMetadata(title) {
        // In the new structure, layer metadata is the complete layer object
        return this.getLayerByTitle(title);
    }

    // === P02 PARAMETER METHODS ===
    
    getP02ParametersForLayer(layerName) {
        const layer = this.getLayerByTitle(layerName);
        return layer ? layer.p02_parameters || [] : [];
    }

    getP02ParameterById(parameterId) {
        return this.p02ById.get(parameterId);
    }

    getAllP02Parameters() {
        return Array.from(this.p02ById.values());
    }

    // === DATASET ACCESS METHODS ===
    
    getCatalogue() {
        return this.data.catalogue || [];
    }

    getDatasetsByP02Parameter(parameterCode, parameterLabel) {
        // Search by both code and label
        const datasets = new Set();
        
        // Search by parameter code
        const codeResults = this.datasetsByParameter.get(parameterCode.toLowerCase()) || [];
        codeResults.forEach(dataset => datasets.add(dataset));
        
        // Search by parameter label
        const labelResults = this.datasetsByParameter.get(parameterLabel.toLowerCase()) || [];
        labelResults.forEach(dataset => datasets.add(dataset));
        
        // Also search for partial matches in dataset parameter lists
        this.data.catalogue.forEach(dataset => {
            if (dataset.p02_parameters && Array.isArray(dataset.p02_parameters)) {
                const hasMatch = dataset.p02_parameters.some(paramName => 
                    paramName.toLowerCase().includes(parameterLabel.toLowerCase()) ||
                    paramName.toLowerCase().includes(parameterCode.toLowerCase())
                );
                if (hasMatch) {
                    datasets.add(dataset);
                }
            }
        });
        
        return Array.from(datasets);
    }

    // === ENHANCED DATA ACCESS METHODS ===
    
    getLayerDataAvailabilityIndex(layerName) {
        const layer = this.getLayerByTitle(layerName);
        return layer && layer.data_availability_index !== undefined ? layer.data_availability_index : 0.0;
    }

    getLayerImprovementPotential(layerName) {
        const layer = this.getLayerByTitle(layerName);
        return layer && layer.improvement_potential ? layer.improvement_potential : 'medium';
    }

    getLayerImprovementDifficulty(layerName) {
        const layer = this.getLayerByTitle(layerName);
        return layer && layer.difficulty ? layer.difficulty : 'medium';
    }

    getLayerSatellitePotential(layerName) {
        const layer = this.getLayerByTitle(layerName);
        return layer && layer.satellite !== undefined ? layer.satellite : false;
    }

    getLayerEnhancedData(layerName) {
        const layer = this.getLayerByTitle(layerName);
        if (!layer) return null;

        return {
            name: layerName,
            data_availability_index: layer.data_availability_index || 0.0,
            improvement_potential: layer.improvement_potential || 'medium',
            improvement_difficulty: layer.difficulty || 'medium',
            satellite_potential: layer.satellite || false,
            parameter_count: layer.parameter_count || 0,
            metadata: layer
        };
    }

    // === SEARCH FUNCTIONALITY ===
    
    searchLayers(query) {
        if (!query) return this.getSymphonyLayers();
        
        const queryLower = query.toLowerCase();
        return this.getSymphonyLayers().filter(layer => 
            (layer.Name && layer.Name.toLowerCase().includes(queryLower)) ||
            (layer.Summary && layer.Summary.toLowerCase().includes(queryLower)) ||
            (layer.SymphonyTheme && layer.SymphonyTheme.toLowerCase().includes(queryLower))
        );
    }

    searchP02Parameters(query) {
        if (!query) return this.getAllP02Parameters();
        
        const queryLower = query.toLowerCase();
        return this.getAllP02Parameters().filter(param => 
            param.id.toLowerCase().includes(queryLower) ||
            (param.preferred_label && param.preferred_label.toLowerCase().includes(queryLower)) ||
            (param.definition && param.definition.toLowerCase().includes(queryLower))
        );
    }

    searchDatasets(query) {
        if (!query) return this.getCatalogue();
        
        const queryLower = query.toLowerCase();
        return this.getCatalogue().filter(dataset => 
            (dataset.name && dataset.name.toLowerCase().includes(queryLower)) ||
            (dataset.dataset_name && dataset.dataset_name.toLowerCase().includes(queryLower)) ||
            (dataset.source && dataset.source.toLowerCase().includes(queryLower)) ||
            (dataset.data_source && dataset.data_source.toLowerCase().includes(queryLower))
        );
    }

    // === STATISTICS METHODS ===
    
    getOverallStatistics() {
        const layers = this.getSymphonyLayers();
        const totalLayers = layers.length;
        
        // Calculate improvement potential distribution
        const improvementCounts = { small: 0, medium: 0, large: 0 };
        const difficultyCounts = { low: 0, medium: 0, high: 0 };
        let satelliteCount = 0;
        const availabilityIndexes = [];
        
        layers.forEach(layer => {
            // Count improvement potential
            const improvement = layer.improvement_potential || 'medium';
            if (improvementCounts.hasOwnProperty(improvement)) {
                improvementCounts[improvement]++;
            }
            
            // Count difficulty
            const difficulty = layer.difficulty || 'medium';
            if (difficultyCounts.hasOwnProperty(difficulty)) {
                difficultyCounts[difficulty]++;
            }
            
            // Count satellite potential
            if (layer.satellite) {
                satelliteCount++;
            }
            
            // Collect availability indexes
            if (layer.data_availability_index > 0) {
                availabilityIndexes.push(layer.data_availability_index);
            }
        });
        
        // Calculate availability statistics
        let availabilityStats = {};
        if (availabilityIndexes.length > 0) {
            availabilityStats = {
                mean: availabilityIndexes.reduce((a, b) => a + b, 0) / availabilityIndexes.length,
                min: Math.min(...availabilityIndexes),
                max: Math.max(...availabilityIndexes),
                count: availabilityIndexes.length
            };
        }
        
        return {
            total_layers: totalLayers,
            improvement_potential: improvementCounts,
            difficulty_distribution: difficultyCounts,
            satellite_potential: satelliteCount,
            data_availability: availabilityStats,
            total_p02_parameters: this.p02ById.size,
            total_datasets: this.data.catalogue.length
        };
    }

    // === DATA VALIDATION ===
    
    validate() {
        const required = ['symphonyLayers', 'p02Analysis', 'catalogue'];
        const missing = required.filter(key => !this.data[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required data: ${missing.join(', ')}`);
        }

        const layerCount = this.data.symphonyLayers.length;
        const p02Count = Object.keys(this.data.p02Analysis).length;
        const catalogueCount = this.data.catalogue.length;
        
        console.log(`Data validation: ${layerCount} layers, ${p02Count} P02 parameters, ${catalogueCount} datasets`);
        
        if (layerCount === 0 || p02Count === 0 || catalogueCount === 0) {
            throw new Error('Data files appear to be empty');
        }

        // Validate that layers have expected enhanced fields
        const sampleLayer = this.data.symphonyLayers[0];
        const expectedFields = ['Name', 'data_availability_index', 'improvement_potential', 'difficulty', 'satellite', 'p02_parameters'];
        const missingFields = expectedFields.filter(field => !(field in sampleLayer));
        
        if (missingFields.length > 0) {
            console.warn(`Some layers may be missing fields: ${missingFields.join(', ')}`);
        }

        console.log('✓ Data validation successful');
        return true;
    }
}

// Create global data loader instance
window.dataLoader = new DataLoader();