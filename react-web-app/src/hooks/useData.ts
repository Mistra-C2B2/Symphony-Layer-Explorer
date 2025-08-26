import { useState, useEffect } from 'react';
import type { AppData } from '../types';
import { dataService } from '../services/dataService';

interface UseDataReturn {
  data: AppData | null;
  loading: boolean;
  error: string | null;
}

export const useData = (): UseDataReturn => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const appData = await dataService.loadData();
        setData(appData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};