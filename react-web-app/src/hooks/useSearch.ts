import { useState, useMemo } from 'react';
import type { SymphonyLayer, SearchFilters, SortOption } from '../types';

interface UseSearchReturn {
  searchFilters: SearchFilters;
  sortOption: SortOption;
  filteredLayers: SymphonyLayer[];
  updateSearchText: (text: string) => void;
  updateThemes: (themes: string[]) => void;
  updateImprovementPotential: (potential: string[]) => void;
  updateDifficulty: (difficulty: string[]) => void;
  updateSatelliteOnly: (satelliteOnly: boolean) => void;
  updateDigitalEarthSwedenOnly: (digitalEarthSwedenOnly: boolean) => void;
  updateSortOption: (option: SortOption) => void;
  clearFilters: () => void;
}

const initialFilters: SearchFilters = {
  searchText: '',
  themes: [],
  improvementPotential: [],
  difficulty: [],
  satelliteOnly: false,
  digitalEarthSwedenOnly: false
};

export const useSearch = (layers: SymphonyLayer[] | null): UseSearchReturn => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>('name');

  const filteredLayers = useMemo(() => {
    if (!layers) return [];

    let filtered = layers.filter(layer => {
      // Text search
      if (searchFilters.searchText) {
        const searchTerm = searchFilters.searchText.toLowerCase();
        if (!layer.name.toLowerCase().includes(searchTerm) &&
            !layer.symphony_theme.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Theme filter
      if (searchFilters.themes.length > 0) {
        if (!searchFilters.themes.includes(layer.symphony_theme)) {
          return false;
        }
      }

      // Improvement potential filter
      if (searchFilters.improvementPotential.length > 0) {
        if (!searchFilters.improvementPotential.includes(layer.improvement_potential)) {
          return false;
        }
      }

      // Difficulty filter
      if (searchFilters.difficulty.length > 0) {
        if (!searchFilters.difficulty.includes(layer.difficulty)) {
          return false;
        }
      }

      // Satellite filter
      if (searchFilters.satelliteOnly && !layer.satellite) {
        return false;
      }

      // Digital Earth Sweden filter
      if (searchFilters.digitalEarthSwedenOnly && !layer.digital_earth_sweden) {
        return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'availability':
          return (b.data_availability_index || 0) - (a.data_availability_index || 0);
        case 'theme':
          return a.symphony_theme.localeCompare(b.symphony_theme);
        case 'parameters':
          return b.p02_parameters.length - a.p02_parameters.length;
        case 'improvement':
          const improvementOrder = { large: 3, medium: 2, small: 1 };
          return improvementOrder[b.improvement_potential] - improvementOrder[a.improvement_potential];
        case 'difficulty':
          const difficultyOrder = { high: 3, medium: 2, low: 1 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [layers, searchFilters, sortOption]);

  const updateSearchText = (text: string) => {
    setSearchFilters(prev => ({ ...prev, searchText: text }));
  };

  const updateThemes = (themes: string[]) => {
    setSearchFilters(prev => ({ ...prev, themes }));
  };

  const updateImprovementPotential = (potential: string[]) => {
    setSearchFilters(prev => ({ ...prev, improvementPotential: potential }));
  };

  const updateDifficulty = (difficulty: string[]) => {
    setSearchFilters(prev => ({ ...prev, difficulty }));
  };

  const updateSatelliteOnly = (satelliteOnly: boolean) => {
    setSearchFilters(prev => ({ ...prev, satelliteOnly }));
  };

  const updateDigitalEarthSwedenOnly = (digitalEarthSwedenOnly: boolean) => {
    setSearchFilters(prev => ({ ...prev, digitalEarthSwedenOnly }));
  };

  const updateSortOption = (option: SortOption) => {
    setSortOption(option);
  };

  const clearFilters = () => {
    setSearchFilters(initialFilters);
    setSortOption('name');
  };

  return {
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
  };
};