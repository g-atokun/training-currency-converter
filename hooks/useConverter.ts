import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CURRENCIES, validateAmount, convertCurrency } from '@/utils/currency';
import { saveConversion, getConversionHistory, clearConversionHistory as clearStorage } from '@/utils/storage';
import { ConversionResult, ExchangeRates } from '@/types';

export function useConverter(exchangeRates: ExchangeRates | null) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversionResult[]>([]);

  // Initialize from URL parameters
  useEffect(() => {
    const urlAmount = searchParams.get('amount');
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');

    if (urlAmount) {
      setAmount(urlAmount);
    }
    if (urlFrom && CURRENCIES.find(c => c.code === urlFrom)) setFromCurrency(urlFrom);
    if (urlTo && CURRENCIES.find(c => c.code === urlTo)) setToCurrency(urlTo);

    setHistory(getConversionHistory());
  }, [searchParams]);

  // Update URL parameters
  const updateURL = useCallback((amt: string, from: string, to: string) => {
    const params = new URLSearchParams();
    params.set('amount', amt);
    params.set('from', from);
    params.set('to', to);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  // Perform conversion
  const performConversion = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setResult(null);
      return;
    }

    // Only clear error if we actually have rates to convert with
    if (!exchangeRates) {
      return;
    }

    setValidationError(null);

    try {
      const amountNum = parseFloat(amount);
      const fromRate = exchangeRates.rates[fromCurrency];
      const toRate = exchangeRates.rates[toCurrency];

      if (!fromRate || !toRate) {
        return;
      }

      const convertedAmount = convertCurrency(amountNum, fromRate, toRate);
      setResult(convertedAmount);

      const conversion: ConversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: amountNum,
        result: convertedAmount,
        rate: toRate / fromRate,
        timestamp: Date.now(),
      };

      saveConversion(conversion);
      setHistory(getConversionHistory());

      updateURL(amount, fromCurrency, toCurrency);
    } catch (err: any) {
      console.error('Conversion error:', err);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates, updateURL]);

  // Auto-convert on input change
  useEffect(() => {
    // Always validate the amount, even if rates aren't loaded yet
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setResult(null);
      return;
    }

    // Only perform conversion if we have all required data
    if (fromCurrency && toCurrency && exchangeRates) {
      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates, performConversion]);

  const handleFromCurrencyChange = useCallback((currency: string) => {
    if (currency === toCurrency) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(currency);
  }, [fromCurrency, toCurrency]);

  const handleToCurrencyChange = useCallback((currency: string) => {
    if (currency === fromCurrency) {
      setFromCurrency(toCurrency);
    }
    setToCurrency(currency);
  }, [fromCurrency, toCurrency]);

  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const loadFromHistory = useCallback((conversion: ConversionResult) => {
    setAmount(conversion.amount.toString());
    setFromCurrency(conversion.from);
    setToCurrency(conversion.to);
  }, []);

  const clearConversionHistory = useCallback(() => {
    clearStorage();
    setHistory([]);
  }, []);

  return {
    amount,
    fromCurrency,
    toCurrency,
    result,
    validationError,
    history,
    setAmount,
    setFromCurrency: handleFromCurrencyChange,
    setToCurrency: handleToCurrencyChange,
    handleSwap,
    loadFromHistory,
    clearConversionHistory,
  };
}
