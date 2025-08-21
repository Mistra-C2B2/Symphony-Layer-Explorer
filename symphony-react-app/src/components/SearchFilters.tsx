import React from 'react';
import type { SearchFilters, SortOption } from '../types';

// Configuration constants
const IMPROVEMENT_OPTIONS = [
  { value: 'small', label: 'Small', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'large', label: 'Large', color: 'text-red-600' }
] as const;

const DIFFICULTY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' }
] as const;

const SORT_OPTIONS = [
  { value: 'name' as const, label: 'Name' },
  { value: 'availability' as const, label: 'Availability' },
  { value: 'theme' as const, label: 'Theme' },
  { value: 'parameters' as const, label: 'Parameter Count' },
  { value: 'improvement' as const, label: 'Improvement Potential' },
  { value: 'difficulty' as const, label: 'Difficulty' }
];

// Types for reusable components
interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface CheckboxGroupProps {
  title: string;
  options: readonly FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxHeight?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  sortOption: SortOption;
  availableThemes: string[];
  onSearchTextChange: (text: string) => void;
  onThemesChange: (themes: string[]) => void;
  onImprovementPotentialChange: (potential: string[]) => void;
  onDifficultyChange: (difficulty: string[]) => void;
  onSatelliteOnlyChange: (satelliteOnly: boolean) => void;
  onSortOptionChange: (option: SortOption) => void;
  onClearFilters: () => void;
}

// Custom hook for array filter logic
const useArrayFilter = (values: string[], onChange: (values: string[]) => void) => {
  return (value: string, checked: boolean) => {
    const newValues = checked 
      ? [...values, value]
      : values.filter(v => v !== value);
    onChange(newValues);
  };
};

// Reusable FilterSection component
const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-semibold text-neutral-700 tracking-wide uppercase">
      {title}
    </h4>
    {children}
  </div>
);

// Reusable CheckboxGroup component
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  title, 
  options, 
  selectedValues, 
  onChange, 
  maxHeight = "max-h-32" 
}) => {
  const handleChange = useArrayFilter(selectedValues, onChange);
  
  return (
    <FilterSection title={title}>
      <div className={`space-y-2 ${maxHeight} overflow-y-auto pr-2 scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-300`}>
        {options.map(option => (
          <label 
            key={option.value} 
            className="flex items-center group cursor-pointer hover:bg-neutral-50 rounded-md p-2 -mx-2 transition-colors duration-150"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded transition-colors duration-150 focus:ring-2 focus:ring-offset-1"
            />
            <span className={`ml-3 text-sm font-semibold transition-colors duration-150 group-hover:text-neutral-800 ${
              option.color || 'text-neutral-600'
            } ${selectedValues.includes(option.value) ? 'text-neutral-800' : ''}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  sortOption,
  availableThemes,
  onSearchTextChange,
  onThemesChange,
  onImprovementPotentialChange,
  onDifficultyChange,
  onSatelliteOnlyChange,
  onSortOptionChange,
  onClearFilters
}) => {
  // Convert themes to FilterOption format
  const themeOptions: FilterOption[] = availableThemes.map(theme => ({
    value: theme,
    label: theme
  }));

  return (
    <div className="bg-white shadow-card border border-neutral-200 rounded-xl p-8 mb-8 animate-fade-in">
      {/* Search and Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Enhanced Search Input */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-semibold text-neutral-700 mb-3 tracking-wide uppercase">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search layers and themes..."
              value={filters.searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              className="w-full px-4 py-3 text-neutral-800 placeholder-neutral-400 border border-neutral-300 rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-400"
              aria-describedby="search-help"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p id="search-help" className="mt-1 text-xs text-neutral-500">Search across layer names, themes, and descriptions</p>
        </div>

        {/* Enhanced Sort Dropdown */}
        <div>
          <label htmlFor="sort" className="block text-sm font-semibold text-neutral-700 mb-3 tracking-wide uppercase">
            Sort by
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            className="w-full px-4 py-3 text-neutral-800 border border-neutral-300 rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-400 bg-white"
            data-testid="sort-select"
            aria-label="Sort layers by selected criteria"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Enhanced Satellite Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 hover:bg-neutral-100 transition-colors duration-150">
            <label htmlFor="satellite-only" className="flex items-center cursor-pointer">
              <input
                id="satellite-only"
                type="checkbox"
                checked={filters.satelliteOnly}
                onChange={(e) => onSatelliteOnlyChange(e.target.checked)}
                className="h-5 w-5 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded transition-colors duration-150 focus:ring-2 focus:ring-offset-1"
                aria-describedby="satellite-help"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-neutral-800">Satellite Only</span>
                <p id="satellite-help" className="text-xs text-neutral-500 mt-1">Show only satellite-sensed data</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Sections */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Themes Filter */}
          <CheckboxGroup
            title="Themes"
            options={themeOptions}
            selectedValues={filters.themes}
            onChange={onThemesChange}
            maxHeight="max-h-40"
          />

          {/* Improvement Potential Filter */}
          <CheckboxGroup
            title="Improvement Potential"
            options={IMPROVEMENT_OPTIONS}
            selectedValues={filters.improvementPotential}
            onChange={onImprovementPotentialChange}
          />

          {/* Difficulty Filter */}
          <CheckboxGroup
            title="Difficulty"
            options={DIFFICULTY_OPTIONS}
            selectedValues={filters.difficulty}
            onChange={onDifficultyChange}
          />
        </div>
      </div>

      {/* Enhanced Clear Filters Button */}
      <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end">
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 hover:text-primary-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-soft hover:shadow-card"
          aria-label="Clear all active filters"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;