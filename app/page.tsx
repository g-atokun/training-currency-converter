'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import ErrorMessage from '@/components/ErrorMessage';
import ConverterForm from '@/components/ConverterForm';
import ConversionHistory from '@/components/ConversionHistory';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { useConverter } from '@/hooks/useConverter';

export default function Home() {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Fetch exchange rates
  const { exchangeRates, loading, error, refresh } = useExchangeRates();

  // Conversion logic
  const {
    amount,
    fromCurrency,
    toCurrency,
    result,
    validationError,
    history,
    setAmount,
    setFromCurrency,
    setToCurrency,
    handleSwap,
    loadFromHistory,
    clearConversionHistory,
  } = useConverter(exchangeRates);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Currency Converter"
          subtitle="Convert currencies with real-time exchange rates"
        />

        {/* Main Converter Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <ErrorMessage message={error} />

          <ConverterForm
              amount={amount}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              result={result}
              validationError={validationError}
              exchangeRates={exchangeRates}
              onAmountChange={setAmount}
              onFromCurrencyChange={setFromCurrency}
              onToCurrencyChange={setToCurrency}
              onSwap={handleSwap}
              onRefresh={refresh}
              loadingRates={loading}
            />
        </div>

        {/* History Section */}
        <ConversionHistory
          history={history}
          showHistory={showHistory}
          onToggle={() => setShowHistory(!showHistory)}
          onClear={clearConversionHistory}
          onLoadConversion={(conversion) => {
            loadFromHistory(conversion);
            setShowHistory(false);
          }}
        />

        <PageFooter lastUpdated={exchangeRates?.timestamp} />
      </div>
    </main>
  );
}
