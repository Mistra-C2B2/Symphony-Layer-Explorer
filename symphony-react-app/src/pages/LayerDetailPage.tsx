import React from 'react';
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
            </div>
            <div className="text-lg text-gray-600">
              <strong>Data Availability Index:</strong> {Math.round(layer.data_availability_index)}
            </div>
          </div>

          {/* Layer Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <div data-testid="layer-summary">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
                <p className="text-gray-700 leading-relaxed">{layer.summary}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Lineage</h2>
                <p className="text-gray-700 leading-relaxed">{layer.lineage}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Recommendations</h2>
                <p className="text-gray-700 leading-relaxed">{layer.recommendations_for_data_improvement}</p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">AI Improvement Analysis</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Improvement Reasoning</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {layer.improvement_reasoning.improvement_justification}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Difficulty Assessment</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {layer.improvement_reasoning.difficulty_justification}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Satellite Sensing Capability</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {layer.improvement_reasoning.satellite_justification}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* P02 Parameters Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              P02 Parameters ({layer.p02_parameters.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg" data-testid="p02-parameters-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Parameter
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Availability Index
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Spatial Coverage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Time Coverage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Datasets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {layer.p02_parameters.map((param, index) => {
                    const analysis = p02Analysis?.[param.code];
                    return (
                      <tr 
                        key={param.code}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}
                        onClick={() => handleParameterClick(param.label)}
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
                          {analysis ? `${Math.round(analysis.spatial_coverage_pct)}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {analysis ? `${analysis.time_coverage_pct}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 border-b border-gray-200">
                          <button className="hover:text-blue-800 hover:underline">
                            View datasets →
                          </button>
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