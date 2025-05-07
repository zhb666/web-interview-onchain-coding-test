export interface Currency {
  symbol: string;
  name: string;
  colorful_image_url: string;
}

export interface WalletBalance {
  currency: string;
  amount: string;
}

export interface Rate {
  from_currency: string;
  to_currency: string;
  rate: string;
}

export interface Asset {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  usdRate: number;
  usdValue: number;
  unit: string;
}

export interface WalletState {
  loading: boolean;
  error: string | null;
  assets: Asset[];
  totalUsd: number;
}

export enum ErrorType {
  DATA_LOAD_ERROR = 'DATA_LOAD_ERROR',
  INVALID_CURRENCY = 'INVALID_CURRENCY',
  RATE_NOT_FOUND = 'RATE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface WalletError {
  type: ErrorType;
  message: string;
  details?: unknown;
} 
