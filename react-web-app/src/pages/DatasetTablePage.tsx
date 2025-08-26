import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { dataService } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Breadcrumb from '../components/Breadcrumb';

type SortField = 'name' | 'source' | 'start_year' | 'regions';
type SortDirection = 'asc' | 'desc';

const DatasetTablePage: React.FC = () => {
  const { layerName, parameterLabel } = useParams<{ layerName: string; parameterLabel: string }>();
  const { loading, error } = useData();
  
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const datasets = useMemo(() => {
    if (!parameterLabel) return [];
    return dataService.getDatasetsByP02Parameter(decodeURIComponent(parameterLabel));
  }, [parameterLabel]);

  const filteredAndSortedDatasets = useMemo(() => {
    let filtered = datasets;

    // Apply search filter
    if (searchText) {
      const searchTerm = searchText.toLowerCase();
      filtered = datasets.filter(dataset =>
        dataset.name.toLowerCase().includes(searchTerm) ||
        dataset.source.toLowerCase().includes(searchTerm) ||
        dataset.regions.some(region => region.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'source':
          aValue = a.source.toLowerCase();
          bValue = b.source.toLowerCase();
          break;
        case 'start_year':
          aValue = a.start_year;
          bValue = b.start_year;
          break;
        case 'regions':
          aValue = a.regions.join(', ').toLowerCase();
          bValue = b.regions.join(', ').toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [datasets, searchText, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return '↕️';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatEndYear = (endYear: string | number) => {
    return endYear === 'ongoing' ? 'Ongoing' : endYear.toString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading datasets..." />
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

  if (!layerName || !parameterLabel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error="Missing layer or parameter information" />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Layers', path: '/' },
    { label: decodeURIComponent(layerName), path: `/layer/${layerName}` },
    { label: decodeURIComponent(parameterLabel) }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Datasets for "{decodeURIComponent(parameterLabel)}"
            </h1>
            <p className="text-gray-600">
              Found {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} containing this parameter.
              {filteredAndSortedDatasets.length < datasets.length && (
                <span className="ml-1">
                  Showing {filteredAndSortedDatasets.length} filtered results.
                </span>
              )}
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label htmlFor="dataset-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search datasets
            </label>
            <input
              id="dataset-search"
              type="text"
              placeholder="Search by name, source, or region..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results */}
          {filteredAndSortedDatasets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg 
                  className="mx-auto h-12 w-12" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {datasets.length === 0 ? 'No datasets available' : 'No datasets match your search'}
              </h3>
              <p className="text-sm text-gray-500">
                {datasets.length === 0 
                  ? 'This parameter is not currently available in any catalogued datasets.'
                  : 'Try adjusting your search terms.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Dataset Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('source')}
                    >
                      <div className="flex items-center gap-1">
                        Source {getSortIcon('source')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Acquisition
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Resolution
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('start_year')}
                    >
                      <div className="flex items-center gap-1">
                        Time Period {getSortIcon('start_year')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('regions')}
                    >
                      <div className="flex items-center gap-1">
                        Regions {getSortIcon('regions')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedDatasets.map((dataset, index) => (
                    <tr 
                      key={dataset.id_dataset}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <div className="font-medium">{dataset.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dataset.aquisition_detail}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        {dataset.source}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <div>{dataset.aquisition_source}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dataset.code_accessibility}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <div>H: {dataset.horizontal_resolution?.trim() || 'N/A'}</div>
                        {dataset.vertical_resolution ? (
                          <div className="text-xs text-gray-500">V: {dataset.vertical_resolution} levels</div>
                        ) : (
                          <div className="text-xs text-gray-500">V: N/A</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <div>{dataset.start_year} - {formatEndYear(dataset.end_year)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dataset.temporal_resolution}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {dataset.regions.map((region, idx) => (
                            <span 
                              key={idx}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {region}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm border-b border-gray-200">
                        <a
                          href={dataset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Dataset →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetTablePage;