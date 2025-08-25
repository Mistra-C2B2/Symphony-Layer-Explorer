import type { AppData, SymphonyLayer, P02AnalysisData, Dataset } from '../types';

class DataService {
  private cache: AppData | null = null;
  private loading = false;

  async loadData(): Promise<AppData> {
    if (this.cache) {
      return this.cache;
    }

    if (this.loading) {
      await new Promise(resolve => {
        const checkCache = () => {
          if (this.cache || !this.loading) {
            resolve(void 0);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
      return this.cache!;
    }

    this.loading = true;

    try {
      const baseUrl = import.meta.env.BASE_URL;
      const [symphonyResponse, p02Response, catalogueResponse] = await Promise.all([
        fetch(`${baseUrl}data/symphony_layers.json`),
        fetch(`${baseUrl}data/p02_analysis.json`),
        fetch(`${baseUrl}data/catalogue.json`)
      ]);

      if (!symphonyResponse.ok || !p02Response.ok || !catalogueResponse.ok) {
        throw new Error('Failed to fetch data files');
      }

      const [symphonyLayers, p02Analysis, catalogue]: [
        SymphonyLayer[],
        P02AnalysisData,
        Dataset[]
      ] = await Promise.all([
        symphonyResponse.json(),
        p02Response.json(),
        catalogueResponse.json()
      ]);

      this.cache = {
        symphonyLayers,
        p02Analysis,
        catalogue
      };

      return this.cache;
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load application data');
    } finally {
      this.loading = false;
    }
  }

  getSymphonyLayers(): SymphonyLayer[] | null {
    return this.cache?.symphonyLayers || null;
  }

  getP02Analysis(): P02AnalysisData | null {
    return this.cache?.p02Analysis || null;
  }

  getCatalogue(): Dataset[] | null {
    return this.cache?.catalogue || null;
  }

  getLayerByName(name: string): SymphonyLayer | undefined {
    return this.cache?.symphonyLayers.find(layer => layer.name === name);
  }

  getDatasetsByP02Parameter(parameterLabel: string): Dataset[] {
    if (!this.cache?.catalogue) return [];
    
    return this.cache.catalogue.filter(dataset =>
      dataset.p02_parameters.some(param => 
        param.toLowerCase() === parameterLabel.toLowerCase()
      )
    );
  }

  getUniqueThemes(): string[] {
    if (!this.cache?.symphonyLayers) return [];
    
    const themes = new Set(this.cache.symphonyLayers.map(layer => layer.symphony_theme));
    return Array.from(themes).sort();
  }

  getImprovementPotentialValues(): string[] {
    return ['small', 'medium', 'large'];
  }

  getDifficultyValues(): string[] {
    return ['low', 'medium', 'high'];
  }

  getRelatedDatasetsCount(layer: SymphonyLayer): number {
    if (!this.cache?.catalogue || !layer.p02_parameters?.length) return 0;
    
    const layerP02Labels = layer.p02_parameters.map(param => param.label.toLowerCase());
    
    return this.cache.catalogue.filter(dataset =>
      dataset.p02_parameters.some(paramLabel => 
        layerP02Labels.includes(paramLabel.toLowerCase())
      )
    ).length;
  }
}

export const dataService = new DataService();