import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSearch } from '../useSearch'
import type { SymphonyLayer } from '../../types'

const mockLayers: SymphonyLayer[] = [
  {
    name: 'Coastal birds',
    symphony_theme: 'Birds',
    improvement_potential: 'large',
    difficulty: 'medium',
    satellite: false,
    data_availability_index: 32.115,
    p02_parameters: [{ code: 'BRDA', label: 'Bird counts' }]
  } as SymphonyLayer,
  {
    name: 'Marine mammals',
    symphony_theme: 'Mammals',
    improvement_potential: 'small',
    difficulty: 'low',
    satellite: true,
    data_availability_index: 75.5,
    p02_parameters: [{ code: 'MMAL', label: 'Marine mammals' }]
  } as SymphonyLayer,
  {
    name: 'Fish populations',
    symphony_theme: 'Fish',
    improvement_potential: 'medium',
    difficulty: 'high',
    satellite: false,
    data_availability_index: 60.2,
    p02_parameters: [{ code: 'FISH', label: 'Fish abundance' }]
  } as SymphonyLayer
]

describe('useSearch', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    expect(result.current.searchFilters.searchText).toBe('')
    expect(result.current.searchFilters.themes).toEqual([])
    expect(result.current.searchFilters.improvementPotential).toEqual([])
    expect(result.current.searchFilters.difficulty).toEqual([])
    expect(result.current.searchFilters.satelliteOnly).toBe(false)
    expect(result.current.sortOption).toBe('name')
  })

  it('should return all layers when no filters applied', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    expect(result.current.filteredLayers).toHaveLength(3)
    expect(result.current.filteredLayers.map(l => l.name)).toEqual([
      'Coastal birds',
      'Fish populations', 
      'Marine mammals'
    ])
  })

  it('should filter by search text', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateSearchText('marine')
    })

    expect(result.current.filteredLayers).toHaveLength(1)
    expect(result.current.filteredLayers[0].name).toBe('Marine mammals')
  })

  it('should filter by theme', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateThemes(['Birds'])
    })

    expect(result.current.filteredLayers).toHaveLength(1)
    expect(result.current.filteredLayers[0].name).toBe('Coastal birds')
  })

  it('should filter by improvement potential', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateImprovementPotential(['large'])
    })

    expect(result.current.filteredLayers).toHaveLength(1)
    expect(result.current.filteredLayers[0].name).toBe('Coastal birds')
  })

  it('should filter by satellite capability', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateSatelliteOnly(true)
    })

    expect(result.current.filteredLayers).toHaveLength(1)
    expect(result.current.filteredLayers[0].name).toBe('Marine mammals')
  })

  it('should sort by availability index', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateSortOption('availability')
    })

    expect(result.current.filteredLayers.map(l => l.name)).toEqual([
      'Marine mammals',
      'Fish populations',
      'Coastal birds'
    ])
  })

  it('should clear all filters', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateSearchText('test')
      result.current.updateThemes(['Birds'])
      result.current.updateSatelliteOnly(true)
    })

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.searchFilters.searchText).toBe('')
    expect(result.current.searchFilters.themes).toEqual([])
    expect(result.current.searchFilters.satelliteOnly).toBe(false)
    expect(result.current.sortOption).toBe('name')
  })

  it('should handle multiple filters simultaneously', () => {
    const { result } = renderHook(() => useSearch(mockLayers))

    act(() => {
      result.current.updateThemes(['Fish', 'Mammals'])
      result.current.updateDifficulty(['low', 'high'])
    })

    expect(result.current.filteredLayers).toHaveLength(2)
    expect(result.current.filteredLayers.map(l => l.name)).toEqual([
      'Fish populations',
      'Marine mammals'
    ])
  })
})