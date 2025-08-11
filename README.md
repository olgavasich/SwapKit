# CrossChain DEX

A full-featured cross-chain decentralized exchange built with React, Vite, and SwapKit SDK. This application provides seamless token swaps across 20+ blockchain networks with support for multiple wallet types.

## Features

### 🔄 Cross-Chain Swaps
- Support for 20+ blockchain networks
- Real-time quotes from multiple DEX aggregators
- Optimal route selection for best prices
- Cross-chain swaps via THORChain and Chainflip

### 💼 Multi-Wallet Support
- **Browser Wallets**: MetaMask, Coinbase Wallet, WalletConnect
- **Cosmos Wallets**: Keplr, Cosmostation
- **Hardware Wallets**: Ledger, Trezor
- **Software Wallets**: Keystore (mnemonic phrase)

### 🌐 Supported Chains
- **EVM**: Ethereum, BSC, Avalanche, Polygon, Arbitrum, Optimism, Base
- **UTXO**: Bitcoin, Bitcoin Cash, Litecoin, Dogecoin, Dash, Zcash
- **Cosmos**: Cosmos Hub, THORChain, Maya, Kujira
- **Others**: Solana, Ripple (XRP), Polkadot, Chainflip, Radix

### 📊 Portfolio Management
- Real-time balance tracking across all connected wallets
- Token price information and portfolio valuation
- Transaction history and status tracking
- Privacy controls for balance visibility

### 🔧 Advanced Features
- Customizable slippage tolerance
- Gas fee estimation and optimization
- Transaction signing and approval management
- Real-time quote updates
- Responsive design for mobile and desktop

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crosschain-dex
```

2. Install dependencies:
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `VITE_SWAPKIT_API_KEY`: Get from [api.swapkit.dev](https://api.swapkit.dev)
- `VITE_WALLETCONNECT_PROJECT_ID`: Get from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- `VITE_BLOCKCHAIR_API_KEY`: Get from [blockchair.com/api](https://blockchair.com/api)

4. Start the development server:
```bash
# Using bun
bun dev

# Or using npm
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

### Build the application:
```bash
# Using bun
bun run build

# Or using npm
npm run build
```

### Preview the production build:
```bash
# Using bun
bun run preview

# Or using npm
npm run preview
```

## Deployment to Cloudflare Pages

This application is optimized for deployment on Cloudflare Pages:

1. **Connect your repository** to Cloudflare Pages
2. **Set build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `18` or higher

3. **Configure environment variables** in Cloudflare Pages dashboard:
   - Add all variables from `.env.example`
   - Set production API keys and RPC URLs

4. **Deploy**: Cloudflare Pages will automatically build and deploy your application

### Build Configuration

The application includes optimized Vite configuration for Cloudflare Pages:
- Node.js polyfills for browser compatibility
- WebAssembly support for cryptographic operations
- Optimized bundle splitting and tree shaking
- Modern ES2020 target for better performance

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── WalletButton.tsx # Wallet connection button
│   ├── WalletModal.tsx # Wallet connection modal
│   └── TokenSelector.tsx # Token selection component
├── hooks/              # Custom React hooks
│   ├── useWalletConnection.ts # Wallet connection logic
│   ├── useTokens.ts    # Token data management
│   └── useSwap.ts      # Swap functionality
├── pages/              # Application pages
│   ├── SwapPage.tsx    # Main swap interface
│   ├── PortfolioPage.tsx # Portfolio overview
│   └── TransactionsPage.tsx # Transaction history
├── providers/          # React context providers
│   └── SwapKitProvider.tsx # SwapKit SDK provider
├── stores/             # Zustand state management
│   ├── walletStore.ts  # Wallet state
│   ├── swapStore.ts    # Swap state
│   └── tokenStore.ts   # Token data state
└── utils/              # Utility functions
    ├── constants.ts    # Application constants
    └── formatters.ts   # Data formatting utilities
```

## Key Technologies

- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool with HMR and optimized bundling
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **SwapKit SDK**: Cross-chain DeFi functionality
- **React Router**: Client-side routing
- **React Hot Toast**: Toast notifications

## Configuration

### API Keys

The application requires several API keys for full functionality:

1. **SwapKit API Key** (recommended):
   - Provides enhanced swap routes and higher rate limits
   - Get from [api.swapkit.dev](https://api.swapkit.dev)

2. **WalletConnect Project ID** (required for WalletConnect):
   - Enables WalletConnect v2 support
   - Get from [cloud.walletconnect.com](https://cloud.walletconnect.com)

3. **Blockchair API Key** (recommended for UTXO chains):
   - Enables full Bitcoin, Litecoin, Dogecoin functionality
   - Get from [blockchair.com/api](https://blockchair.com/api)

### Custom RPC URLs

You can configure custom RPC URLs for better performance:

```env
VITE_ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
VITE_AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
```

## Usage Guide

### Connecting Wallets

1. Click "Connect Wallet" in the top right
2. Select your preferred wallet type:
   - **Browser Wallets**: For MetaMask, Coinbase Wallet, etc.
   - **Keystore**: For mnemonic phrase import
   - **Hardware**: For Ledger/Trezor devices
3. Choose which chains to connect
4. Follow the wallet-specific connection flow

### Performing Swaps

1. **Select tokens**: Choose source and destination tokens
2. **Enter amount**: Specify how much to swap
3. **Review quotes**: Compare routes from different providers
4. **Adjust settings**: Set slippage tolerance if needed
5. **Execute swap**: Approve tokens (if needed) and confirm transaction

### Managing Portfolio

1. **View balances**: See all tokens across connected wallets
2. **Track values**: Monitor portfolio value in USD
3. **Refresh data**: Update balances and prices
4. **Privacy controls**: Hide/show balance amounts

## Troubleshooting

### Common Issues

1. **Wallet connection fails**:
   - Ensure wallet extension is installed and unlocked
   - Check that you're on the correct network
   - Try refreshing the page

2. **No swap routes found**:
   - Verify both tokens are supported
   - Check if wallets are connected for both chains
   - Try a different token pair or amount

3. **Transaction fails**:
   - Ensure sufficient balance for amount + fees
   - Check if token approval is needed
   - Verify slippage tolerance isn't too low

4. **Slow loading**:
   - Check your internet connection
   - Try using custom RPC URLs
   - Clear browser cache

### Getting Help

- Check the [SwapKit Documentation](https://docs.swapkit.dev)
- Join the [SwapKit Discord](https://discord.gg/swapkit)
- Report issues on [GitHub](https://github.com/swapkit/swapkit)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Built with [SwapKit SDK](https://github.com/swapkit/swapkit)
- Powered by [THORChain](https://thorchain.org) and [Chainflip](https://chainflip.io)
- UI components inspired by modern DeFi applications
- Icons from [Lucide React](https://lucide.dev)

---

**Note**: This is a demonstration application. Always verify transactions and use appropriate security measures when handling real funds.