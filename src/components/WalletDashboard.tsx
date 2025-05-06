import React from 'react';
import walletBalance from '../json/wallet-balance.json';
import currencies from '../json/currencies.json';
import liveRates from '../json/live-rates.json';

// 只支持 BTC、ETH、CRO
const SUPPORTED = ['BTC', 'ETH', 'CRO'];

// 获取币种详细信息
const getCurrencyInfo = (symbol: string) => {
  return currencies.currencies.find((c: any) => c.symbol === symbol);
};

// 获取币种美元汇率
const getUsdRate = (symbol: string) => {
  const tier = liveRates.tiers.find((t: any) => t.from_currency === symbol && t.to_currency === 'USD');
  if (!tier || !tier.rates || tier.rates.length === 0) return 0;
  // rate 字段就是 1 单位币种的美元价格，不需要除以1000
  return Number(tier.rates[0].rate);
};

const WalletDashboard: React.FC = () => {
  // 只处理 BTC、ETH、CRO
  const assetList = walletBalance.wallet
    .filter((item: any) => SUPPORTED.includes(item.currency))
    .map((item: any) => {
      const symbol = item.currency;
      const balance = Number(item.amount);
      const usdRate = getUsdRate(symbol);
      const usdValue = balance * usdRate;
      const info = getCurrencyInfo(symbol);
      return {
        symbol,
        name: info ? info.name : symbol,
        icon: info ? info.colorful_image_url : '',
        balance,
        usdRate,
        usdValue,
        unit: symbol,
      };
    });

  // 计算总资产
  const totalUsd = assetList.reduce((sum, item) => sum + item.usdValue, 0);

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, background: '#f7f7f7', borderRadius: 8 }}>
      {/* 调试信息 */}
      <div style={{ background: '#ffe', color: '#333', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
        <div><b>调试信息：</b></div>
        {assetList.map(item => (
          <div key={item.symbol}>
            {item.symbol}: 余额={item.balance}，汇率={item.usdRate}，美元价值={item.usdValue.toFixed(4)}
          </div>
        ))}
        <div><b>总资产：</b> {totalUsd.toFixed(4)} USD</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' }}>
        $ {totalUsd.toFixed(2)} USD
      </div>
      <div>
        {assetList.map((item) => (
          <div key={item.symbol} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 6, padding: 12, marginBottom: 12, boxShadow: '0 1px 3px #eee' }}>
            <div style={{ width: 32, height: 32, marginRight: 12, background: '#eee', borderRadius: '50%', overflow: 'hidden' }}>
              {item.icon ? <img src={item.icon} alt={item.symbol} style={{ width: 32, height: 32 }} /> : null}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 500 }}>{item.name}</div>
              <div style={{ color: '#333', fontSize: 12 }}>{item.balance} {item.unit}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 500 }}>$ {item.usdValue.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletDashboard; 
