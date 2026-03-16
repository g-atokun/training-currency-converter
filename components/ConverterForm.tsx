import AmountInput from './AmountInput';
import CurrencySelect from './CurrencySelect';
import SwapButton from './SwapButton';
import RefreshButton from './RefreshButton';
import ConversionResult from './ConversionResult';
import { ExchangeRates } from '@/types';

interface ConverterFormProps {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  result: number | null;
  validationError: string | null;
  exchangeRates: ExchangeRates | null;
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (value: string) => void;
  onToCurrencyChange: (value: string) => void;
  onSwap: () => void;
  onRefresh: () => void;
  loadingRates?: boolean;
}

export default function ConverterForm({
  amount,
  fromCurrency,
  toCurrency,
  result,
  validationError,
  exchangeRates,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onSwap,
  onRefresh,
  loadingRates = false,
}: ConverterFormProps) {
  const currentRate = exchangeRates && fromCurrency && toCurrency
    ? exchangeRates.rates[toCurrency] / exchangeRates.rates[fromCurrency]
    : null;

  return (
    <div className="space-y-4">
      {/* Single Row: Amount and Currency Selectors */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <AmountInput
            value={amount}
            onChange={onAmountChange}
            error={validationError}
          />

          <CurrencySelect
            value={fromCurrency}
            onChange={onFromCurrencyChange}
          />

          <SwapButton onClick={onSwap} />

          <CurrencySelect
            value={toCurrency}
            onChange={onToCurrencyChange}
          />

          <RefreshButton onClick={onRefresh} loading={loadingRates} />
        </div>
        
        {/* Error message below the row */}
        {validationError && (
          <p className="text-sm text-red-600 px-1">{validationError}</p>
        )}
      </div>

      {/* Result Display */}
      {!validationError && (
        <ConversionResult
          result={result}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          rate={currentRate}
        />
      )}
    </div>
  );
}
