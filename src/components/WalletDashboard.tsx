import React, { useState, useEffect, useMemo } from 'react';
import walletBalance from '../json/wallet-balance.json';
import currencies from '../json/currencies.json';
import liveRates from '../json/live-rates.json';

// 支持的币种
const SUPPORTED = ['BTC', 'ETH', 'CRO'];

// 定义类型
interface Currency {
  symbol: string;
  name: string;
  colorful_image_url: string;
}

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  usdRate: number;
  usdValue: number;
  unit: string;
}

// 获取币种详细信息
const getCurrencyInfo = (symbol: string): Currency | undefined => {
  return currencies.currencies.find((c: any) => c.symbol === symbol);
};

// 获取币种美元汇率
const getUsdRate = (symbol: string): number => {
  const tier = liveRates.tiers.find((t: any) => t.from_currency === symbol && t.to_currency === 'USD');
  if (!tier || !tier.rates || tier.rates.length === 0) return 0;
  return Number(tier.rates[0].rate);
};

// 资产卡片组件
const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff', 
        borderRadius: 6, 
        padding: 12, 
        marginBottom: 12, 
        boxShadow: '0 1px 3px #eee',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px #eee';
      }}
    >
      <div 
        style={{ 
          width: 32, 
          height: 32, 
          marginRight: 12, 
          background: '#eee', 
          borderRadius: '50%', 
          overflow: 'hidden' 
        }}
      >
        {asset.icon ? <img src={asset.icon} alt={asset.symbol} style={{ width: 32, height: 32 }} /> : null}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' , color: '#333'}}>
        <div style={{ fontWeight: 500 }}>{asset.name}</div>
        
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#666', fontSize: 12 }}>{asset.balance} {asset.unit}</div>
        <div style={{ color: '#666', fontSize: 10 }}>${asset.usdValue.toFixed(2)}</div>
      </div>
    </div>
  );
};

// 总资产组件
const TotalBalance: React.FC<{ totalUsd: number }> = ({ totalUsd }) => {
  return (
    <div 
      style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 24, 
        textAlign: 'center', 
        color: '#333',
        padding: '20px 0',
        borderBottom: '1px solid #eee' 
      }}
    >
      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>总资产</div>
      <div>$ {totalUsd.toFixed(2)} USD</div>
    </div>
  );
};

// 主钱包组件
const WalletDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 使用useMemo缓存计算结果，避免不必要的重新计算
  const { assetList, totalUsd } = useMemo(() => {
    try {
      // 只处理支持的币种
      const assets = walletBalance.wallet
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
      const total = assets.reduce((sum, item) => sum + item.usdValue, 0);
      
      return { assetList: assets, totalUsd: total };
    } catch (err) {
      setError('数据加载失败，请刷新页面重试');
      return { assetList: [], totalUsd: 0 };
    }
  }, []);

  // 模拟API加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 加载中状态
  if (loading) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, background: '#f7f7f7', borderRadius: 8, textAlign: 'center' }}>
        <div style={{ fontSize: 16, marginBottom: 10 ,color: '#333'}}>加载中...</div>
        <div style={{ width: '100%', height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, #1890ff, #4eadff)',
              width: '30%',
              animation: 'loadingAnimation 1.5s infinite',
            }}
          />
        </div>
        <style>
          {`
            @keyframes loadingAnimation {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}
        </style>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, background: '#ffeeee', borderRadius: 8, textAlign: 'center', color: '#ff4d4f' }}>
        <div style={{ fontSize: 18, marginBottom: 10 }}>出错了！</div>
        <div>{error}</div>
        <button 
          style={{ 
            marginTop: 16, 
            padding: '8px 16px', 
            background: '#ff4d4f', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
          onClick={() => window.location.reload()}
        >
          刷新页面
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '100px auto', 
      padding: 24, 
      background: '#f7f7f7', 
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* 调试信息 - 可在生产环境中移除 */}
      {import.meta.env?.DEV && (
        <div style={{ background: '#ffe', color: '#333', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          <div><b>调试信息：</b></div>
          {assetList.map(item => (
            <div key={item.symbol}>
              {item.symbol}: 余额={item.balance}，汇率={item.usdRate}，美元价值={item.usdValue.toFixed(4)}
            </div>
          ))}
          <div><b>总资产：</b> {totalUsd.toFixed(4)} USD</div>
        </div>
      )}
      
      <TotalBalance totalUsd={totalUsd} />
      
      <div>
        {assetList.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default WalletDashboard; 
