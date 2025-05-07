import React from 'react';
import { useWallet } from '../hooks/useWallet';
import type { Asset } from '../types/wallet';
import { formatUsdValue } from '../utils/walletUtils';

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
        {asset.icon && <img src={asset.icon} alt={asset.symbol} style={{ width: 32, height: 32 }} />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' , color: '#333'}}>
        <div style={{ fontWeight: 500 }}>{asset.name}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#666', fontSize: 12 }}>{asset.balance} {asset.unit}</div>
        <div style={{ color: '#666', fontSize: 10 }}>${formatUsdValue(asset.usdValue)}</div>
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
      <div>$ {formatUsdValue(totalUsd)} USD</div>
    </div>
  );
};

// 加载中组件
const LoadingState: React.FC = () => (
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

// 错误状态组件
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
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

// 主钱包组件
const WalletDashboard: React.FC = () => {
  const { loading, error, assets, totalUsd } = useWallet();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
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
      {/* 调试信息 - 仅在开发环境显示 */}
      {import.meta.env?.DEV && (
        <div style={{ background: '#ffe', color: '#333', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          <div><b>调试信息：</b></div>
          {assets.map(item => (
            <div key={item.symbol}>
              {item.symbol}: 余额={item.balance}，汇率={item.usdRate}，美元价值={formatUsdValue(item.usdValue)}
            </div>
          ))}
          <div><b>总资产：</b> {formatUsdValue(totalUsd)} USD</div>
        </div>
      )}
      
      <TotalBalance totalUsd={totalUsd} />
      
      <div>
        {assets.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default WalletDashboard; 
