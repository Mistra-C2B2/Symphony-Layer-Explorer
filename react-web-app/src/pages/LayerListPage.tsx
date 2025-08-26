import React, { useState } from 'react';
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
  const [showAboutDetails, setShowAboutDetails] = useState(false);
  
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
            Symphony Layer Explorer
          </h1>
          <p className="text-xl lg:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Identify gaps. Build solutions. Accelerate progress.
          </p>
        </div>

        {/* About Symphony Section */}
        <div className="bg-gradient-to-r from-blue-50/80 to-green-50/80 rounded-2xl p-8 border border-blue-100/50">
          <div className="text-center">
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed mb-4">
               This tool is meant to help students, researchers, planners, enthusiasts, and stakeholders improve the data layers used by {' '}
              <a 
                href="https://www.havochvatten.se/en/eu-and-international/marine-spatial-planning/swedish-marine-spatial-planning/the-marine-spatial-planning-process/development-of-plan-proposals/symphony---a-tool-for-ecosystem-based-marine-spatial-planning.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary-600 hover:text-primary-700 no-underline decoration-2 underline-offset-2 transition-colors duration-200"
              >
                Symphony
              </a> the marine spatial planning tool developed by the Swedish Agency for Marine and Water Management.
            </p>
            
            {showAboutDetails && (
              <div className="mt-6 space-y-4 text-left max-w-4xl mx-auto">
                 <div className="bg-white/60 rounded-xl p-6 border border-white/40">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">What is Symphony?</h3>
                  <p className="text-neutral-700 mb-3">
                    Symphony is a decision-support tool designed to facilitate ecosystem-based marine spatial planning in Swedish waters. It integrates various data layers representing marine ecosystems and human pressures to help planners and stakeholders make informed decisions that balance ecological, economic, and social objectives.
                  </p>
                </div>
                <div className="bg-white/60 rounded-xl p-6 border border-white/40">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">What are Symphony Layers?</h3>
                  <p className="text-neutral-700 mb-3">
                    Symphony uses ecosystem and human pressure component layers that represent different biological elements (like fish species and habitats) and human activities (such as shipping and fishing). Each layer is mapped on a 250×250 meter grid and represents a specific aspect of the marine environment. The detailed descriptions of these layers (summary, lineage, recommendations, etc.) come directly from the report {' '}
                    <a 
                href="https://www.havochvatten.se/download/18.67e0eb431695d86393371d86/1708680041655/bilaga-1-symphony-metadata.zip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline decoration-2 no-underline transition-colors duration-200"
              >Symphony Metadata</a>.
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowAboutDetails(!showAboutDetails)}
              className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {showAboutDetails ? 'Show less' : 'Learn more about Symphony'}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showAboutDetails ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
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