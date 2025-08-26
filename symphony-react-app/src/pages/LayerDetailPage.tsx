import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { dataService } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Breadcrumb from '../components/Breadcrumb';

const LayerDetailPage: React.FC = () => {
  const { layerName } = useParams<{ layerName: string }>();
  const navigate = useNavigate();
  const { loading, error } = useData();
  const [isParameterInfoOpen, setIsParameterInfoOpen] = useState(false);

  const layer = layerName ? dataService.getLayerByName(decodeURIComponent(layerName)) : null;
  const p02Analysis = dataService.getP02Analysis();

  const handleParameterClick = (parameterLabel: string) => {
    navigate(`/layer/${encodeURIComponent(layerName!)}/parameter/${encodeURIComponent(parameterLabel)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading layer details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          error={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!layer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error="Layer not found" />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Layers', path: '/' },
    { label: layer.name }
  ];

  const getImprovementColor = (potential: string) => {
    switch (potential) {
      case 'large': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'small': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* Layer Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {layer.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {layer.symphony_theme}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getImprovementColor(layer.improvement_potential)}`}>
                {layer.improvement_potential} improvement potential
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(layer.difficulty)}`}>
                {layer.difficulty} difficulty
              </span>
              {layer.satellite && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full border border-purple-200">
                  satellite sensing capable
                </span>
              )}
              {layer.digital_earth_sweden && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                  DigitalEarthSweden compatible
                </span>
              )}
            </div>
          </div>

          {/* Symphony Metadata Report Section */}
          <div className="mb-8">
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h2 className="text-2xl font-bold text-gray-900">Layer Description from Symphony Metadata Report</h2>
                  <p className="text-sm text-blue-700 mt-1">
                    Source:{' '}
                    <a 
                      href="https://www.havochvatten.se/download/18.67e0eb431695d86393371d86/1708680041655/bilaga-1-symphony-metadata.zip"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-800 underline"
                    >
                      Symphony Metadata Report
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div data-testid="layer-summary">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{layer.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lineage</h3>
                  <p className="text-gray-700 leading-relaxed">{layer.lineage}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <p className="text-gray-700 leading-relaxed">{layer.recommendations_for_data_improvement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analyses Section */}
          <div className="mb-8">
            <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h2 className="text-2xl font-bold text-gray-900">AI Analyses</h2>
                  <p className="text-sm text-purple-700 mt-1">
                    AI-generated assessments for improvement potential and feasibility
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-2">Improvement Reasoning</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {layer.improvement_reasoning.improvement_justification}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-2">Difficulty Assessment</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {layer.improvement_reasoning.difficulty_justification}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-2">Satellite Sensing Capability</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {layer.improvement_reasoning.satellite_justification}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-2">DigitalEarthSweden Data Applicability</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {layer.improvement_reasoning.digital_earth_sweden_justification}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Oceanographic Parameters Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Related Oceanographic Parameters ({layer.p02_parameters.length})
            </h2>
            
            <div className="mb-6">
              <button
                onClick={() => setIsParameterInfoOpen(!isParameterInfoOpen)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <svg 
                  className={`w-4 h-4 transform transition-transform ${isParameterInfoOpen ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Learn more about these parameters
              </button>
              
              {isParameterInfoOpen && (
                <div className="mt-4 pl-6 border-l-2 border-blue-200">
                  <h3 className="font-medium text-gray-900 mb-2">What are these parameters?</h3>
                  <p className="text-gray-700 mb-3">
                    These are standardized <strong>oceanographic measurement types</strong> from the SeaDataNet vocabulary that help 
                    scientists categorize and discover environmental data. They represent specific types of measurements that could 
                    be used to improve or recreate this Symphony layer.
                  </p>
                  <h3 className="font-medium text-gray-900 mb-2">How were they matched?</h3>
                  <p className="text-gray-700 mb-3">
                    Using AI analysis, we examined each Symphony layer's data improvement recommendations and identified 
                    relevant oceanographic parameters that could help address data limitations or serve as proxies for 
                    missing measurements. The matching focused on parameters that would directly help improve the data quality 
                    as described in the layer's recommendations.
                  </p>
                  <div className="mt-3">
                    <a 
                      href="https://vocab.nerc.ac.uk/collection/P02/current/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Learn more about P02 parameters →
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg" data-testid="p02-parameters-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Measurement Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        Availability Index
                        <div className="group relative">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="invisible group-hover:visible absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg top-6 -right-40">
                            <div className="font-medium mb-1">Parameter Availability Index</div>
                            <div>Mean of 4 sub-indexes: Horizontal resolution, Spatial coverage, Time coverage, and Up-To-Date index. Higher values indicate better data availability and quality for this parameter.</div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        Horizontal Resolution Index
                        <div className="group relative">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="invisible group-hover:visible absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg top-6 -right-40">
                            <div className="font-medium mb-1">Horizontal Resolution Index</div>
                            <div>Best horizontal resolution available for this parameter. 100% corresponds to 1x1 meter resolution, while 0% indicates unspecified resolution (common in time-series datasets).</div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        Spatial Coverage Index
                        <div className="group relative">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="invisible group-hover:visible absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg top-6 -right-40">
                            <div className="font-medium mb-1">Spatial Coverage Index</div>
                            <div>Measures coverage of Swedish marine areas across 11 basins (Skagerrak, Kattegat, The Sound, Arkona Basin, etc.). 100% means the parameter is covered in all basins.</div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        Time Coverage Index
                        <div className="group relative">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="invisible group-hover:visible absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg top-6 -right-40">
                            <div className="font-medium mb-1">Time Coverage Index</div>
                            <div>Measures temporal span of available datasets. 100% means datasets span at least 10 years. For shorter periods, calculated as (years covered ÷ 10) × 100%.</div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        Up-To-Date Index
                        <div className="group relative">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="invisible group-hover:visible absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg top-6 -right-40">
                            <div className="font-medium mb-1">Up-To-Date Index</div>
                            <div>Measures data recency. 100% for ongoing datasets, 0% for 2015 data. For data between 2015-2025, calculated as ((most recent year - 2015) ÷ 10) × 100%.</div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Datasets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {layer.p02_parameters.map((param, index) => {
                    const analysis = p02Analysis?.[param.code];
                    const relatedDatasets = dataService.getDatasetsByP02Parameter(param.label);
                    const hasDatasets = relatedDatasets.length > 0;
                    
                    return (
                      <tr 
                        key={param.code}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${hasDatasets ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
                        onClick={hasDatasets ? () => handleParameterClick(param.label) : undefined}
                      >
                        <td className="px-4 py-3 text-sm font-mono text-gray-900 border-b border-gray-200">
                          {param.code}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          <div className="font-medium">{param.label}</div>
                          {analysis?.preferred_label && analysis.preferred_label !== param.label && (
                            <div className="text-xs text-gray-500 mt-1">{analysis.preferred_label}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? Math.round(analysis.parameter_availability_index) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? `${Math.round(analysis.horizontal_resolution_pct)}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? `${Math.round(analysis.spatial_coverage_pct)}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? `${analysis.time_coverage_pct}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? `${Math.round(analysis.up_to_date_pct)}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-gray-200">
                          {hasDatasets ? (
                            <button className="text-blue-600 hover:text-blue-800 hover:underline">
                              View datasets →
                            </button>
                          ) : (
                            <span className="text-gray-500">No datasets</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerDetailPage;