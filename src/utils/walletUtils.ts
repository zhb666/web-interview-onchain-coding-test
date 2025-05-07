import { ErrorType } from '../types/wallet';
import type { Currency, WalletBalance, Rate, Asset, WalletError } from '../types/wallet';

export const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'CRO'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
}

export function validateAmount(amount: string): number {
  const num = Number(amount);
  if (isNaN(num) || num < 0) {
    throw new Error('Invalid amount');
  }
  return num;
}

export function calculateUsdValue(balance: number, rate: number): number {
  return balance * rate;
}

export function formatUsdValue(value: number): string {
  return value.toFixed(2);
}

export function createWalletError(type: ErrorType, message: string, details?: unknown): WalletError {
  return {
    type,
    message,
    details
  };
}

export function validateAndTransformAsset(
  balance: WalletBalance,
  currencyInfo: Currency | undefined,
  usdRate: number
): Asset | WalletError {
  try {
    if (!isSupportedCurrency(balance.currency)) {
      return createWalletError(
        ErrorType.INVALID_CURRENCY,
        `Unsupported currency: ${balance.currency}`
      );
    }

    if (!currencyInfo) {
      return createWalletError(
        ErrorType.DATA_LOAD_ERROR,
        `Currency info not found for: ${balance.currency}`
      );
    }

    const balanceAmount = validateAmount(balance.amount);
    const usdValue = calculateUsdValue(balanceAmount, usdRate);

    return {
      symbol: balance.currency,
      name: currencyInfo.name,
      icon: currencyInfo.colorful_image_url,
      balance: balanceAmount,
      usdRate,
      usdValue,
      unit: balance.currency
    };
  } catch (error) {
    return createWalletError(
      ErrorType.DATA_LOAD_ERROR,
      'Failed to process asset data',
      error
    );
  }
} 
