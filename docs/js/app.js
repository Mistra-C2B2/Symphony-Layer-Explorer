/**
 * Simplified Symphony Layers Explorer
 */

class SymphonyApp {
    constructor() {
        this.currentLayer = null;
        this.currentParameter = null;
        this.sortField = 'Name';
        this.sortOrder = 'asc';
        this.filteredLayers = [];
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('Initializing Symphony Layers Explorer...');
        
        // Get UI elements
        this.initElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load data
        try {
            await this.loadData();
            this.hideLoading();
            this.showApp();
            this.showLayers();
        } catch (error) {
            this.showError(error.message);
        }
    }

    initElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            app: document.getElementById('app'),
            
            // Layer elements
            layersSection: document.getElementById('layers-section'),
            layerSearch: document.getElementById('layer-search'),
            sortSelect: document.getElementById('sort-select'),
            sortOrderBtn: document.getElementById('sort-order'),
            layersContainer: document.getElementById('layers-container'),
            
            // Parameter elements
            parametersSection: document.getElementById('parameters-section'),
            currentLayer: document.getElementById('current-layer'),
            layerMetadata: document.getElementById('layer-metadata'),
            parametersDescription: document.getElementById('parameters-description'),
            parameterSearch: document.getElementById('parameter-search'),
            parametersContainer: document.getElementById('parameters-container'),
            
            // Dataset elements
            datasetsSection: document.getElementById('datasets-section'),
            breadcrumbLayer: document.getElementById('breadcrumb-layer'),
            currentParameter: document.getElementById('current-parameter'),
            datasetsDescription: document.getElementById('datasets-description'),
            datasetSearch: document.getElementById('dataset-search'),
            columnToggles: document.getElementById('column-toggles'),
            datasetsContainer: document.getElementById('datasets-container')
        };
    }

    setupEventListeners() {
        // Layer search
        this.elements.layerSearch.addEventListener('input', (e) => {
            this.filterLayers(e.target.value);
        });

        // Sorting
        this.elements.sortSelect.addEventListener('change', (e) => {
            this.sortField = e.target.value;
            this.sortAndDisplayLayers();
        });

        this.elements.sortOrderBtn.addEventListener('click', () => {
            this.toggleSortOrder();
        });

        // Parameter search
        this.elements.parameterSearch.addEventListener('input', (e) => {
            this.filterParameters(e.target.value);
        });

        // Dataset search
        this.elements.datasetSearch.addEventListener('input', (e) => {
            this.filterDatasets(e.target.value);
        });
    }

    async loadData() {
        try {
            await window.dataLoader.loadAll();
            window.dataLoader.validate();
            this.filteredLayers = window.dataLoader.getSymphonyLayers();
            console.log('Application loaded successfully');
        } catch (error) {
            console.error('Failed to load data:', error);
            throw error;
        }
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
    }

    showApp() {
        this.elements.app.style.display = 'block';
    }

    showError(message) {
        this.hideLoading();
        this.elements.app.innerHTML = `
            <div class="section" style="text-align: center; color: #dc3545;">
                <h2>⚠️ Error Loading Application</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    Reload Page
                </button>
            </div>
        `;
        this.elements.app.style.display = 'block';
    }

    // Navigation methods
    showLayers() {
        this.elements.layersSection.style.display = 'block';
        this.elements.parametersSection.style.display = 'none';
        this.elements.datasetsSection.style.display = 'none';
        
        this.sortAndDisplayLayers();
    }

    showParameters() {
        if (!this.currentLayer) return;
        
        this.elements.layersSection.style.display = 'none';
        this.elements.parametersSection.style.display = 'block';
        this.elements.datasetsSection.style.display = 'none';
        
        this.displayParameters();
    }

    showDatasets(parameter) {
        this.currentParameter = parameter;
        
        this.elements.layersSection.style.display = 'none';
        this.elements.parametersSection.style.display = 'none';
        this.elements.datasetsSection.style.display = 'block';
        
        this.displayDatasets();
    }

    // Layer display methods
    sortAndDisplayLayers() {
        this.filteredLayers.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            
            // Handle null values
            if (aVal === null || aVal === undefined) aVal = this.sortOrder === 'asc' ? '' : 'zzz';
            if (bVal === null || bVal === undefined) bVal = this.sortOrder === 'asc' ? '' : 'zzz';
            
            // Handle numeric values
            if (this.sortField === 'data_availability_index') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }
            
            // Handle improvement potential (special ordering)
            if (this.sortField === 'improvement_potential') {
                const improvementOrder = { 'small': 1, 'medium': 2, 'large': 3 };
                aVal = improvementOrder[aVal] || 2;
                bVal = improvementOrder[bVal] || 2;
            }
            
            // Handle difficulty (special ordering)
            if (this.sortField === 'difficulty') {
                const difficultyOrder = { 'low': 1, 'medium': 2, 'high': 3 };
                aVal = difficultyOrder[aVal] || 2;
                bVal = difficultyOrder[bVal] || 2;
            }
            
            if (this.sortOrder === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });
        
        this.displayLayers();
    }

    displayLayers() {
        const html = this.filteredLayers.map(layer => this.createLayerCard(layer)).join('');
        this.elements.layersContainer.innerHTML = html;
    }

    createLayerCard(layer) {
        // Data is now directly in the layer object
        const availabilityIndex = layer.data_availability_index || 0.0;
        const improvementPotential = layer.improvement_potential || 'medium';
        const improvementDifficulty = layer.difficulty || 'medium';
        const satellitePotential = layer.satellite || false;
        
        // Format availability index as percentage
        const availabilityPercent = availabilityIndex > 0 ? Math.round(availabilityIndex * 100) : 0;
        
        return `
            <div class="layer-card" data-layer-name="${layer.Name}" onclick="symphonyApp.selectLayerFromCard(this)">
                <div class="layer-header">
                    <div class="layer-title">${this.formatTitle(layer.Name)}</div>
                    <div class="layer-tags">
                        ${satellitePotential ? '<span class="tag satellite-tag">📡 Satellite</span>' : ''}
                        <span class="tag improvement-tag improvement-${improvementPotential}">${improvementPotential.charAt(0).toUpperCase() + improvementPotential.slice(1)} Improvement</span>
                        <span class="tag difficulty-tag difficulty-${improvementDifficulty}">${improvementDifficulty.charAt(0).toUpperCase() + improvementDifficulty.slice(1)} Difficulty</span>
                    </div>
                </div>
                <div class="layer-metrics">
                    <div class="metric availability-metric">
                        <span class="metric-icon">📊</span>
                        <span class="metric-label">Data Availability:</span>
                        <span class="metric-value availability-${this.getAvailabilityClass(availabilityPercent)}">${availabilityPercent}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    filterLayers(query) {
        if (!query.trim()) {
            this.filteredLayers = window.dataLoader.getSymphonyLayers();
        } else {
            const queryLower = query.toLowerCase();
            this.filteredLayers = window.dataLoader.getSymphonyLayers().filter(layer =>
                (layer.Name && layer.Name.toLowerCase().includes(queryLower)) ||
                (layer.Summary && layer.Summary.toLowerCase().includes(queryLower)) ||
                (layer.SymphonyTheme && layer.SymphonyTheme.toLowerCase().includes(queryLower))
            );
        }
        this.sortAndDisplayLayers();
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.elements.sortOrderBtn.textContent = this.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending';
        this.elements.sortOrderBtn.setAttribute('data-order', this.sortOrder);
        this.sortAndDisplayLayers();
    }

    selectLayer(layerName) {
        this.currentLayer = window.dataLoader.getLayerByTitle(layerName);
        if (this.currentLayer) {
            this.elements.currentLayer.textContent = this.formatTitle(this.currentLayer.Name);
            this.elements.breadcrumbLayer.textContent = this.formatTitle(this.currentLayer.Name);
            
            // Display layer metadata
            this.displayLayerMetadata();
            
            this.showParameters();
        }
    }

    selectLayerFromCard(cardElement) {
        const layerName = cardElement.getAttribute('data-layer-name');
        this.selectLayer(layerName);
    }

    // Parameter display methods
    displayParameters() {
        if (!this.currentLayer) return;
        
        // Get P02 parameters directly from the layer
        const p02Parameters = this.currentLayer.p02_parameters || [];
        
        this.elements.parametersDescription.textContent = 
            `P02 Parameters related to ${this.formatTitle(this.currentLayer.Name)} (${p02Parameters.length} parameters found)`;
        
        if (p02Parameters.length === 0) {
            this.elements.parametersContainer.innerHTML = `
                <div class="text-center text-muted">
                    <p>No P02 parameters found for this layer.</p>
                </div>
            `;
            return;
        }

        // Display P02 parameters as cards
        const html = `
            <div class="parameters-grid">
                ${p02Parameters.map(param => this.createP02ParameterCard(param)).join('')}
            </div>
        `;
        
        this.elements.parametersContainer.innerHTML = html;
    }

    createP02ParameterCard(p02Parameter) {
        // Get additional data about this P02 parameter if available
        const p02Data = window.dataLoader.getP02ParameterById(p02Parameter.code);
        const availabilityIndex = p02Data ? p02Data.parameter_availability_index : null;
        
        return `
            <div class="parameter-card" onclick="symphonyApp.selectP02Parameter('${p02Parameter.code}', '${p02Parameter.label.replace(/'/g, "\\'")}')">
                <div class="parameter-title">${p02Parameter.label}</div>
                <div class="parameter-id">${p02Parameter.code}</div>
                <div class="parameter-metrics">
                    <div class="parameter-metric">
                        <span><strong>Availability:</strong></span>
                        <span>${availabilityIndex !== null ? availabilityIndex + '%' : 'N/A'}</span>
                    </div>
                    <div class="parameter-metric">
                        <span><strong>Code:</strong></span>
                        <span>${p02Parameter.code}</span>
                    </div>
                </div>
            </div>
        `;
    }

    filterParameters(query) {
        const cards = this.elements.parametersContainer.querySelectorAll('.parameter-card');
        const queryLower = query.toLowerCase();
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(queryLower) ? '' : 'none';
        });
    }

    selectP02Parameter(parameterCode, parameterLabel) {
        this.currentParameter = {
            code: parameterCode,
            label: parameterLabel,
            id: parameterCode  // For compatibility
        };
        this.elements.currentParameter.textContent = parameterLabel;
        this.showDatasets(this.currentParameter);
    }

    // Dataset display methods
    displayDatasets() {
        if (!this.currentParameter) return;
        
        // Get datasets using the P02 parameter code and label
        const datasets = window.dataLoader.getDatasetsByP02Parameter(this.currentParameter.code, this.currentParameter.label);
        
        this.elements.datasetsDescription.textContent = 
            `Datasets related to ${this.currentParameter.label} (${datasets.length} datasets found)`;
        
        if (datasets.length === 0) {
            this.elements.datasetsContainer.innerHTML = `
                <div class="text-center text-muted">
                    <p>No datasets found for this parameter.</p>
                    <p><small>Parameter Code: ${this.currentParameter.code}</small></p>
                </div>
            `;
            this.elements.columnToggles.innerHTML = '';
            return;
        }

        // Create column toggles
        this.createColumnToggles(datasets[0]);
        
        // Display datasets table
        this.displayDatasetsTable(datasets);
    }

    createColumnToggles(sampleDataset) {
        const columns = [
            { key: 'id_dataset', label: 'ID', default: true },
            { key: 'name', label: 'Name', default: true },
            { key: 'source', label: 'Source', default: true },
            { key: 'start_year', label: 'Start Year', default: false },
            { key: 'end_year', label: 'End Year', default: false },
            { key: 'spatial_representation', label: 'Spatial Rep.', default: false },
            { key: 'horizontal_resolution', label: 'Resolution', default: false },
            { key: 'temporal_resolution', label: 'Temporal', default: false },
            { key: 'regions', label: 'Regions', default: true },
            { key: 'url', label: 'Link', default: true }
        ];

        const togglesHTML = columns.map(col => `
            <div class="column-toggle">
                <input type="checkbox" id="col-${col.key}" ${col.default ? 'checked' : ''} 
                       onchange="symphonyApp.toggleColumn('${col.key}')">
                <label for="col-${col.key}">${col.label}</label>
            </div>
        `).join('');

        this.elements.columnToggles.innerHTML = togglesHTML;
    }

    displayDatasetsTable(datasets) {
        const visibleColumns = this.getVisibleColumns();
        
        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        ${visibleColumns.map(col => `<th class="col-${col.key}">${col.label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${datasets.map(dataset => `
                        <tr>
                            ${visibleColumns.map(col => `
                                <td class="col-${col.key}">
                                    ${this.formatCellValue(dataset[col.key], col.key)}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.elements.datasetsContainer.innerHTML = tableHTML;
    }

    getVisibleColumns() {
        const allColumns = [
            { key: 'id_dataset', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'source', label: 'Source' },
            { key: 'start_year', label: 'Start Year' },
            { key: 'end_year', label: 'End Year' },
            { key: 'spatial_representation', label: 'Spatial Rep.' },
            { key: 'horizontal_resolution', label: 'Resolution' },
            { key: 'temporal_resolution', label: 'Temporal' },
            { key: 'regions', label: 'Regions' },
            { key: 'url', label: 'Link' }
        ];

        return allColumns.filter(col => {
            const checkbox = document.getElementById(`col-${col.key}`);
            return checkbox && checkbox.checked;
        });
    }

    toggleColumn(columnKey) {
        const columns = document.querySelectorAll(`.col-${columnKey}`);
        const checkbox = document.getElementById(`col-${columnKey}`);
        
        columns.forEach(col => {
            col.style.display = checkbox.checked ? '' : 'none';
        });
    }

    formatCellValue(value, columnKey) {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        
        if (columnKey === 'url' && value) {
            return `<a href="${value}" target="_blank" class="btn btn-primary" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Visit</a>`;
        }
        
        if (columnKey === 'regions' && Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'N/A';
        }
        
        return String(value);
    }

    filterDatasets(query) {
        const rows = this.elements.datasetsContainer.querySelectorAll('.data-table tbody tr');
        const queryLower = query.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(queryLower) ? '' : 'none';
        });
    }

    displayLayerMetadata() {
        if (!this.currentLayer) return;
        
        const metadata = window.dataLoader.getLayerMetadata(this.currentLayer.Name);
        
        if (!metadata) {
            this.elements.layerMetadata.innerHTML = `
                <div class="text-center text-muted">
                    <p>No metadata available for this layer.</p>
                </div>
            `;
            return;
        }
        
        // Create metadata display with title as heading
        let metadataHTML = `
            <h3 class="layer-title-heading">${this.formatTitle(metadata['Name'] || this.currentLayer.Name)}</h3>
        `;
        
        // Display summary if available
        if (metadata['Summary'] && metadata['Summary'] !== 'N/A') {
            metadataHTML += `
                <div class="metadata-summary">
                    <h4>Summary</h4>
                    <div class="summary-text">${metadata['Summary']}</div>
                </div>
            `;
        }
        
        // Display lineage if available
        if (metadata['Lineage'] && metadata['Lineage'] !== 'N/A') {
            metadataHTML += `
                <div class="metadata-lineage">
                    <h4>Lineage</h4>
                    <div class="lineage-text">${metadata['Lineage']}</div>
                </div>
            `;
        }
        
        // Display recommendations if available
        if (metadata['Recommendationsfordataimprovement'] && metadata['Recommendationsfordataimprovement'] !== 'N/A') {
            metadataHTML += `
                <div class="metadata-recommendations">
                    <h4>Recommendations for Data Improvement</h4>
                    <div class="recommendations-text">${metadata['Recommendationsfordataimprovement']}</div>
                </div>
            `;
        }
        
        // Show metadata button and hidden detailed metadata table
        metadataHTML += `
            <div class="metadata-toggle-section">
                <button onclick="symphonyApp.toggleDetailedMetadata()" id="detailed-metadata-toggle" class="btn btn-secondary">
                    Show Detailed Metadata
                </button>
            </div>
            
            <div class="detailed-metadata" id="detailed-metadata" style="display: none;">
                <h4>Detailed Metadata</h4>
                <table class="metadata-table">
                    <tbody>
        `;
        
        // Define all metadata fields for the table
        const metadataFields = [
            { key: 'SymphonyTheme', label: 'Theme', description: 'The thematic group used to classify this data type.' },
            { key: 'SymphonyCategory', label: 'Category', description: 'The data type category - i.e. \'Pressure\' or \'Ecosystem\' for Symphony input data or \'Source\' for reference data.' },
            { key: 'SymphonyDataType', label: 'Data Type', description: 'The type of data. This could be \'Normalised\', \'Non-normalised\' or \'Source\' Data.' },
            { key: 'DateCreated', label: 'Date Created', description: 'Reference date detailing the date of creation.' },
            { key: 'Status', label: 'Status', description: 'Current status of the data.' },
            { key: 'DataFormat', label: 'Data Format', description: 'Free text used to define the format and version of the data.' },
            { key: 'TemporalPeriod', label: 'Temporal Period', description: 'Temporal period covered by the geodata.' },
            { key: 'ResourceType', label: 'Resource Type', description: 'Type of resource: "dataset", "data series" or "service".' },
            { key: 'CoordinateReferenceSystem', label: 'Coordinate System', description: 'European Terrestrial Reference System 1989 - Lambert Azimuthal Equal Area.' },
            { key: 'Dataauthoringorganisation', label: 'Authoring Organisation', description: 'Contact organisation for the data author.' },
            { key: 'Contactorganisation', label: 'Contact Organisation', description: 'Contact organisation for the data owner.' },
            { key: 'DataAuthorContact', label: 'Author Contact', description: 'Email address for the data author.' },
            { key: 'DataOwner', label: 'Data Owner', description: 'Organisation that owns the data.' },
            { key: 'DataOwnerContact', label: 'Owner Contact', description: 'Contact for the data owner.' },
            { key: 'INSPIREtopiccategory', label: 'INSPIRE Topic', description: 'Main INSPIRE topic categories related to the data resource.' },
            { key: 'INSPIREtheme', label: 'INSPIRE Theme', description: 'INSPIRE theme keywords.' },
            { key: 'GEMETkeywords', label: 'GEMET Keywords', description: 'GEMET Concept keywords.' },
            { key: 'AccessUseRestrictions', label: 'Access Restrictions', description: 'Restrictions on access and use of the data.' },
            { key: 'UseLimitations', label: 'Use Limitations', description: 'Specific limitations on the usability of the data.' },
            { key: 'SecurityClassification', label: 'Security Classification', description: 'Level of protection required for the data.' },
            { key: 'Maintenance', label: 'Maintenance', description: 'How often the updated resource becomes available.' },
            { key: 'MetadataDate', label: 'Metadata Date', description: 'Last date the metadata was updated.' },
            { key: 'MetadataOrganisation', label: 'Metadata Organisation', description: 'Organisation responsible for maintaining the metadata.' },
            { key: 'MetadataContact', label: 'Metadata Contact', description: 'Email contact for metadata maintenance.' }
        ];
        
        // Add rows for available metadata fields
        metadataFields.forEach(field => {
            if (metadata[field.key] && metadata[field.key] !== 'N/A' && metadata[field.key] !== '') {
                metadataHTML += `
                    <tr>
                        <td class="metadata-field-label">
                            ${field.label}
                            <span class="info-icon" title="${field.description}">i</span>
                        </td>
                        <td class="metadata-field-value">${metadata[field.key]}</td>
                    </tr>
                `;
            }
        });
        
        metadataHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        // Add P02 Parameters section
        const p02Parameters = window.dataLoader.getP02ParametersForLayer(this.currentLayer.Name);
        if (p02Parameters && p02Parameters.length > 0) {
            metadataHTML += `
                <div class="parameters-section">
                    <h4>Relevant P02 Parameters</h4>
                    <p class="parameters-description">These oceanographic parameters are relevant to this layer. Click on a parameter to see related datasets.</p>
                    <table class="parameters-table">
                        <thead>
                            <tr>
                                <th>Parameter Code</th>
                                <th>Parameter Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            p02Parameters.forEach(param => {
                metadataHTML += `
                    <tr>
                        <td class="parameter-code">${param.code}</td>
                        <td class="parameter-label">${param.label}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary parameter-btn" 
                                    onclick="symphonyApp.showParameterDatasets('${param.code}', '${param.label.replace(/'/g, "\\'")}')">
                                View Datasets
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            metadataHTML += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Add dataset results section (initially hidden)
        metadataHTML += `
            <div class="parameter-datasets" id="parameter-datasets" style="display: none;">
                <h4>Related Datasets</h4>
                <div id="parameter-datasets-content"></div>
            </div>
        `;
        
        this.elements.layerMetadata.innerHTML = metadataHTML;
    }
    
    toggleDetailedMetadata() {
        const content = document.getElementById('detailed-metadata');
        const button = document.getElementById('detailed-metadata-toggle');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.textContent = 'Hide Detailed Metadata';
        } else {
            content.style.display = 'none';
            button.textContent = 'Show Detailed Metadata';
        }
    }
    
    showParameterDatasets(parameterCode, parameterLabel) {
        console.log(`Showing datasets for parameter: ${parameterCode} - ${parameterLabel}`);
        
        // Get related datasets
        const datasets = window.dataLoader.getDatasetsByP02Parameter(parameterCode, parameterLabel);
        
        const datasetsSection = document.getElementById('parameter-datasets');
        const datasetsContent = document.getElementById('parameter-datasets-content');
        
        if (datasets.length === 0) {
            datasetsContent.innerHTML = `
                <div class="alert alert-info">
                    <strong>No datasets found</strong> for parameter "${parameterCode}: ${parameterLabel}".
                    <br><small>This may indicate that no datasets in the catalogue explicitly reference this parameter.</small>
                </div>
            `;
        } else {
            let datasetsHTML = `
                <div class="parameter-info">
                    <strong>Parameter:</strong> ${parameterCode} - ${parameterLabel}<br>
                    <strong>Related datasets:</strong> ${datasets.length} found
                </div>
                <table class="datasets-table">
                    <thead>
                        <tr>
                            <th>Dataset Name</th>
                            <th>Parameters</th>
                            <th>Data Source</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            datasets.forEach(dataset => {
                const parameters = dataset.p02_parameters ? dataset.p02_parameters.slice(0, 3).join(', ') + 
                                   (dataset.p02_parameters.length > 3 ? '...' : '') : 'N/A';
                datasetsHTML += `
                    <tr>
                        <td class="dataset-name">${dataset.dataset_name || dataset.name || 'Unknown'}</td>
                        <td class="dataset-parameters">${parameters}</td>
                        <td class="dataset-source">${dataset.data_source || dataset.source || 'N/A'}</td>
                    </tr>
                `;
            });
            
            datasetsHTML += `
                    </tbody>
                </table>
            `;
            
            datasetsContent.innerHTML = datasetsHTML;
        }
        
        // Show the datasets section and scroll to it
        datasetsSection.style.display = 'block';
        datasetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Utility methods
    formatTitle(title) {
        return title.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatValuability(valuability) {
        if (!valuability) return 'Unknown';
        return valuability.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    getAvailabilityClass(percent) {
        if (percent >= 80) return 'high';
        if (percent >= 50) return 'medium';
        if (percent >= 20) return 'low';
        return 'none';
    }
}

// Create global app instance
window.symphonyApp = new SymphonyApp();