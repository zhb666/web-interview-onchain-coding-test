import { useState, useEffect, useMemo } from 'react';
import type { WalletState, Asset, WalletError } from '../types/wallet';
import { ErrorType } from '../types/wallet';
import { validateAndTransformAsset, createWalletError, SUPPORTED_CURRENCIES } from '../utils/walletUtils';
import walletBalance from '../json/wallet-balance.json';
import currencies from '../json/currencies.json';
import liveRates from '../json/live-rates.json';

// 添加默认汇率，用于测试和备用
const DEFAULT_RATES = {
  BTC: 100000, // 比特币默认汇率
  ETH: 300,  // 以太坊默认汇率
  CRO: 0.15,  // CRO 默认汇率
};

const INITIAL_STATE: WalletState = {
  loading: true,
  error: null,
  assets: [],
  totalUsd: 0
};

export function useWallet() {
  const [state, setState] = useState<WalletState>(INITIAL_STATE);

  const getCurrencyInfo = (symbol: string) => {
    return currencies.currencies.find((c: any) => c.symbol === symbol);
  };

  const getUsdRate = (symbol: string): number => {
    try {
      // 尝试从实时汇率中获取
      const tier = liveRates.tiers.find(
        (t: any) => t.from_currency === symbol && t.to_currency === 'USD'
      );
      
      if (tier?.rates?.[0]?.rate) {
        const rate = Number(tier.rates[0].rate);
        if (!isNaN(rate) && rate > 0) {
          return rate;
        }
      }

      // 如果没有找到实时汇率，使用默认汇率
      if (symbol in DEFAULT_RATES) {
        return DEFAULT_RATES[symbol as keyof typeof DEFAULT_RATES];
      }

      return 0;
    } catch (error) {
      return DEFAULT_RATES[symbol as keyof typeof DEFAULT_RATES] || 0;
    }
  };

  const processWalletData = () => {
    try {
      if (!Array.isArray(walletBalance.wallet)) {
        setState({
          ...INITIAL_STATE,
          loading: false
        });
        return;
      }

      // 只处理支持的币种
      const supportedAssets = walletBalance.wallet
        .filter((balance: any) => SUPPORTED_CURRENCIES.includes(balance.currency))
        .map((balance: any) => {
          const amount = typeof balance.amount === 'string' 
            ? balance.amount 
            : String(balance.amount);

          const currencyInfo = getCurrencyInfo(balance.currency);
          const usdRate = getUsdRate(balance.currency);

          return validateAndTransformAsset(
            { ...balance, amount }, 
            currencyInfo, 
            usdRate
          );
        })
        .filter((item): item is Asset => !('type' in item));

      const totalUsd = supportedAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

      setState({
        loading: false,
        error: null,
        assets: supportedAssets,
        totalUsd
      });
    } catch (error) {
      setState({
        loading: false,
        error: null,
        assets: [],
        totalUsd: 0
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      processWalletData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return state;
} 
