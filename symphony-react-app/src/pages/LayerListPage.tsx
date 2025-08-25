import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SymphonyLayer } from '../types';
import { useData } from '../hooks/useData';
import { useSearch } from '../hooks/useSearch';
import { dataService } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchFiltersComponent from '../components/SearchFilters';
import LayerCard from '../components/LayerCard';
import Container from '../components/Container';

const LayerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useData();
  
  const {
    searchFilters,
    sortOption,
    filteredLayers,
    updateSearchText,
    updateThemes,
    updateImprovementPotential,
    updateDifficulty,
    updateSatelliteOnly,
    updateDigitalEarthSwedenOnly,
    updateSortOption,
    clearFilters
  } = useSearch(data?.symphonyLayers || null);

  const handleLayerClick = (layer: SymphonyLayer) => {
    navigate(`/layer/${encodeURIComponent(layer.name)}`);
  };

  if (loading) {
    return (
      <Container className="py-12">
        <LoadingSpinner text="Loading Symphony layers..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <ErrorMessage 
          error={error} 
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  const availableThemes = dataService.getUniqueThemes();

  return (
    <div className="bg-white/80 backdrop-blur-sm">
      <Container className="py-16 lg:py-24 space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-neutral-900 mb-6">
            Explore Symphony Layers
          </h1>
          <p className="text-xl lg:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Discover <span className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{data.symphonyLayers.length}</span> oceanic Symphony layers with detailed oceanographic parameters and datasets.
            {filteredLayers.length < data.symphonyLayers.length && (
              <span className="block mt-4 text-lg text-neutral-500">
                Showing <span className="font-semibold text-primary-600">{filteredLayers.length}</span> filtered results
              </span>
            )}
          </p>
        </div>

      {/* Search and Filters */}
      <SearchFiltersComponent
        filters={searchFilters}
        sortOption={sortOption}
        availableThemes={availableThemes}
        onSearchTextChange={updateSearchText}
        onThemesChange={updateThemes}
        onImprovementPotentialChange={updateImprovementPotential}
        onDifficultyChange={updateDifficulty}
        onSatelliteOnlyChange={updateSatelliteOnly}
        onDigitalEarthSwedenOnlyChange={updateDigitalEarthSwedenOnly}
        onSortOptionChange={updateSortOption}
        onClearFilters={clearFilters}
      />

      {/* Results */}
      {filteredLayers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-neutral-400 mb-6">
            <svg 
              className="mx-auto h-16 w-16" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No layers found</h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            Try adjusting your search criteria or clearing filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredLayers.map((layer, index) => (
            <div
              key={layer.name}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="animate-slide-up"
            >
              <LayerCard
                layer={layer}
                onClick={handleLayerClick}
              />
            </div>
          ))}
        </div>
      )}
      </Container>
    </div>
  );
};

export default LayerListPage;