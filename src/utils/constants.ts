import { Chain } from '@swapkit/sdk'

export const SUPPORTED_CHAINS = [
  { chain: Chain.Ethereum, name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { chain: Chain.Bitcoin, name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { chain: Chain.BinanceSmartChain, name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
  { chain: Chain.Avalanche, name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
  { chain: Chain.Polygon, name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
  { chain: Chain.Arbitrum, name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' },
  { chain: Chain.Optimism, name: 'Optimism', symbol: 'OP', color: '#FF0420' },
  { chain: Chain.Base, name: 'Base', symbol: 'ETH', color: '#0052FF' },
  { chain: Chain.THORChain, name: 'THORChain', symbol: 'RUNE', color: '#00CCAA' },
  { chain: Chain.Cosmos, name: 'Cosmos', symbol: 'ATOM', color: '#2E3148' },
  { chain: Chain.Solana, name: 'Solana', symbol: 'SOL', color: '#9945FF' },
  { chain: Chain.Ripple, name: 'Ripple', symbol: 'XRP', color: '#23292F' },
  { chain: Chain.Litecoin, name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
  { chain: Chain.Dogecoin, name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
  { chain: Chain.BitcoinCash, name: 'Bitcoin Cash', symbol: 'BCH', color: '#8DC351' },
  { chain: Chain.Dash, name: 'Dash', symbol: 'DASH', color: '#008CE7' },
  { chain: Chain.Zcash, name: 'Zcash', symbol: 'ZEC', color: '#F4B728' },
  { chain: Chain.Polkadot, name: 'Polkadot', symbol: 'DOT', color: '#E6007A' },
  { chain: Chain.Chainflip, name: 'Chainflip', symbol: 'FLIP', color: '#CF3CCF' },
  { chain: Chain.Maya, name: 'Maya', symbol: 'CACAO', color: '#00D4AA' },
  { chain: Chain.Kujira, name: 'Kujira', symbol: 'KUJI', color: '#E74C3C' },
  { chain: Chain.Radix, name: 'Radix', symbol: 'XRD', color: '#052CC0' },
]

export const EVM_CHAINS = [
  Chain.Ethereum,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Polygon,
  Chain.Arbitrum,
  Chain.Optimism,
  Chain.Base,
]

export const UTXO_CHAINS = [
  Chain.Bitcoin,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Dogecoin,
  Chain.Dash,
  Chain.Zcash,
]

export const COSMOS_CHAINS = [
  Chain.Cosmos,
  Chain.THORChain,
  Chain.Maya,
  Chain.Kujira,
]

export const SUPPORTED_WALLETS = [
  { id: 'metamask', name: 'MetaMask', chains: EVM_CHAINS },
  { id: 'coinbase', name: 'Coinbase Wallet', chains: EVM_CHAINS },
  { id: 'walletconnect', name: 'WalletConnect', chains: EVM_CHAINS },
  { id: 'keplr', name: 'Keplr', chains: COSMOS_CHAINS },
  { id: 'cosmostation', name: 'Cosmostation', chains: COSMOS_CHAINS },
  { id: 'phantom', name: 'Phantom', chains: [Chain.Solana] },
  { id: 'ledger', name: 'Ledger', chains: [...EVM_CHAINS, ...UTXO_CHAINS, ...COSMOS_CHAINS] },
  { id: 'trezor', name: 'Trezor', chains: [...EVM_CHAINS, ...UTXO_CHAINS] },
  { id: 'keystore', name: 'Keystore', chains: SUPPORTED_CHAINS.map(c => c.chain) },
]

export const SWAP_PROVIDERS = [
  'THORCHAIN',
  'CHAINFLIP',
  'UNISWAP_V2',
  'UNISWAP_V3',
  'SUSHISWAP',
  'PANCAKESWAP',
  '1INCH',
  'PARASWAP',
  'ZEROX',
]

export const DEFAULT_SLIPPAGE = 3 // 3%
export const MAX_SLIPPAGE = 50 // 50%
export const MIN_SLIPPAGE = 0.1 // 0.1%

export const REFRESH_INTERVAL = 30000 // 30 seconds
export const QUOTE_REFRESH_INTERVAL = 15000 // 15 seconds
export const BALANCE_REFRESH_INTERVAL = 60000 // 1 minute

export const EXPLORER_URLS: Record<string, string> = {
  [Chain.Ethereum]: 'https://etherscan.io',
  [Chain.Bitcoin]: 'https://blockstream.info',
  [Chain.BinanceSmartChain]: 'https://bscscan.com',
  [Chain.Avalanche]: 'https://snowtrace.io',
  [Chain.Polygon]: 'https://polygonscan.com',
  [Chain.Arbitrum]: 'https://arbiscan.io',
  [Chain.Optimism]: 'https://optimistic.etherscan.io',
  [Chain.Base]: 'https://basescan.org',
  [Chain.THORChain]: 'https://viewblock.io/thorchain',
  [Chain.Cosmos]: 'https://www.mintscan.io/cosmos',
  [Chain.Solana]: 'https://solscan.io',
  [Chain.Ripple]: 'https://xrpscan.com',
  [Chain.Litecoin]: 'https://blockchair.com/litecoin',
  [Chain.Dogecoin]: 'https://blockchair.com/dogecoin',
  [Chain.BitcoinCash]: 'https://blockchair.com/bitcoin-cash',
  [Chain.Dash]: 'https://blockchair.com/dash',
  [Chain.Zcash]: 'https://blockchair.com/zcash',
  [Chain.Polkadot]: 'https://polkadot.subscan.io',
  [Chain.Chainflip]: 'https://scan.chainflip.io',
  [Chain.Maya]: 'https://www.mayascan.org',
  [Chain.Kujira]: 'https://finder.kujira.app',
  [Chain.Radix]: 'https://dashboard.radixdlt.com',
}