# Crypto.com Web 

Crypto.com Web 前端岗位面试作业，目标是实现一个加密货币钱包资产看板，展示用户持有的主流加密货币（BTC、ETH、CRO）的余额及其美元价值

---

## 设计与开发思路

### 1. 项目目标
实现一个简洁、健壮、可扩展的加密货币钱包资产展示前端，支持主流币种，数据来源于本地 JSON 文件，注重类型安全、可维护性和良好用户体验。

### 2. 技术架构
- 前端框架：React 18
- 语言：TypeScript
- 构建工具：Vite
- 状态管理：React Hooks
- 样式方案：内联 CSS-in-JS
- 数据来源：本地 JSON 文件模拟后端接口

#### 目录结构
```
src/
├── components/          # 主要UI组件
│   └── WalletDashboard.tsx
├── hooks/               # 自定义Hooks
│   └── useWallet.ts
├── types/               # TypeScript类型定义
│   └── wallet.ts
├── utils/               # 工具函数
│   └── walletUtils.ts
└── json/                # 模拟数据
    ├── wallet-balance.json
    ├── currencies.json
    └── live-rates.json
```

### 3. 设计原则与实现细节
- **类型安全**：所有数据结构均有严格的 TypeScript 类型定义，避免运行时类型错误。
- **关注点分离**：业务逻辑与 UI 组件分离，便于单元测试和未来扩展。
- **数据处理**：通过自定义 Hook（`useWallet`）统一处理数据加载、转换和状态管理。
- **币种过滤**：只展示 BTC、ETH、CRO，未配置币种自动忽略，保证前端健壮性。
- **汇率处理**：优先使用实时汇率，若无则降级为默认汇率，保证资产价值始终可用。
- **错误处理**：对数据异常、格式错误等情况做降级处理，不影响主流程展示。
- **UI/UX**：资产卡片、总资产、加载与空状态均有独立组件，结构清晰，交互动画与响应式布局，提升用户体验。
- **可扩展性**：新增币种仅需在 `SUPPORTED_CURRENCIES` 中配置，无需大幅修改代码。

### 4. 关键代码片段说明
- 类型定义（`types/wallet.ts`）：定义资产、汇率、钱包等核心类型。
- 工具函数（`utils/walletUtils.ts`）：币种过滤、汇率获取、资产转换等核心逻辑。
- 数据处理 Hook（`hooks/useWallet.ts`）：负责数据加载、过滤、转换和状态管理。
- UI 组件（`components/WalletDashboard.tsx`）：资产卡片、总资产、加载状态、调试信息等均为独立组件，便于维护和复用。

### 5. 未来可扩展方向
- 支持更多币种和法币单位
- 接入真实后端 API
- 增加资产走势图、历史记录等高级功能
- 国际化与多主题支持
- 单元测试与端到端测试覆盖

### Demo 演示

![Wallet Dashboard Demo](./src/assets/WechatIMG1131.jpg)

---
