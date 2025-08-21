import { beforeEach, describe, expect, it, vi } from 'vitest'
import { dataService } from '../dataService'

describe('DataService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the cache for each test
    ;(dataService as any).cache = null
    ;(dataService as any).loading = false
  })

  it('should load data successfully', async () => {
    const mockSymphonyData = [{ name: 'Test Layer', data_availability_index: 50 }]
    const mockP02Data = { TEST: { preferred_label: 'Test Parameter' } }
    const mockCatalogueData = [{ id_dataset: 1, name: 'Test Dataset' }]

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSymphonyData)
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockP02Data)
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCatalogueData)
      } as Response)

    const result = await dataService.loadData()

    expect(result).toEqual({
      symphonyLayers: mockSymphonyData,
      p02Analysis: mockP02Data,
      catalogue: mockCatalogueData
    })

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenCalledWith('/Symphony-Layers-Interactive-Explorer/data/symphony_layers.json')
    expect(fetch).toHaveBeenCalledWith('/Symphony-Layers-Interactive-Explorer/data/p02_analysis.json')
    expect(fetch).toHaveBeenCalledWith('/Symphony-Layers-Interactive-Explorer/data/catalogue.json')
  })

  it('should throw error when fetch fails', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404
    } as Response)

    await expect(dataService.loadData()).rejects.toThrow('Failed to load application data')
  })

  it('should return cached data on subsequent calls', async () => {
    const mockData = {
      symphonyLayers: [],
      p02Analysis: {},
      catalogue: []
    }

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      } as Response)

    // First call should fetch data
    await dataService.loadData()
    expect(fetch).toHaveBeenCalledTimes(3)

    // Second call should use cache
    await dataService.loadData()
    expect(fetch).toHaveBeenCalledTimes(3) // Still 3, not 6
  })

  it('should get layer by name', async () => {
    const mockLayers = [
      { name: 'Layer 1', data_availability_index: 50 },
      { name: 'Layer 2', data_availability_index: 75 }
    ]

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLayers)
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      } as Response)

    await dataService.loadData()

    const layer = dataService.getLayerByName('Layer 1')
    expect(layer?.name).toBe('Layer 1')
    expect(layer?.data_availability_index).toBe(50)

    const nonExistentLayer = dataService.getLayerByName('Non-existent')
    expect(nonExistentLayer).toBeUndefined()
  })
})