import { useState, useEffect, useCallback } from 'react';
import { ExchangeRates } from '@/types';

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/rates');
        const data = await response.json();

        if (!isMounted) return;

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch exchange rates');
        }

        setExchangeRates(data.data);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'Failed to fetch exchange rates. Please try again later.');
        console.error('Error fetching rates:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/rates');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }

      setExchangeRates(data.data);
    } catch (err: any) {
      // Silent fallback — keep existing rates, do not update error state
      console.error('Error refreshing rates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { exchangeRates, loading, error, refresh };
}
