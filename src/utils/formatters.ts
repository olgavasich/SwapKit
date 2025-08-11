export const formatAddress = (address: string, length: number = 4): string => {
  if (!address) return ''
  if (address.length <= length * 2 + 2) return address
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const formatAmount = (amount: string | number, decimals: number = 6): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '0'
  
  if (num === 0) return '0'
  if (num < 0.000001) return '<0.000001'
  if (num < 1) return num.toFixed(decimals)
  if (num < 1000) return num.toFixed(Math.min(decimals, 2))
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

export const formatUSD = (amount: number): string => {
  if (amount === 0) return '$0.00'
  if (amount < 0.01) return '<$0.01'
  if (amount < 1000) return `$${amount.toFixed(2)}`
  if (amount < 1000000) return `$${(amount / 1000).toFixed(1)}K`
  if (amount < 1000000000) return `$${(amount / 1000000).toFixed(1)}M`
  return `$${(amount / 1000000000).toFixed(1)}B`
}

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`
}

export const formatTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  if (seconds > 0) return `${seconds}s ago`
  return 'Just now'
}

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

export const formatHash = (hash: string, length: number = 6): string => {
  if (!hash) return ''
  if (hash.length <= length * 2) return hash
  return `${hash.slice(0, length)}...${hash.slice(-length)}`
}

export const formatTokenSymbol = (symbol: string): string => {
  if (!symbol) return ''
  return symbol.toUpperCase()
}

export const formatChainName = (chain: string): string => {
  if (!chain) return ''
  
  const chainNames: Record<string, string> = {
    'ETH': 'Ethereum',
    'BTC': 'Bitcoin',
    'BSC': 'BSC',
    'AVAX': 'Avalanche',
    'MATIC': 'Polygon',
    'ARB': 'Arbitrum',
    'OP': 'Optimism',
    'BASE': 'Base',
    'THOR': 'THORChain',
    'GAIA': 'Cosmos',
    'SOL': 'Solana',
    'XRP': 'Ripple',
    'LTC': 'Litecoin',
    'DOGE': 'Dogecoin',
    'BCH': 'Bitcoin Cash',
    'DASH': 'Dash',
    'ZEC': 'Zcash',
    'DOT': 'Polkadot',
    'FLIP': 'Chainflip',
    'MAYA': 'Maya',
    'KUJI': 'Kujira',
    'XRD': 'Radix',
  }
  
  return chainNames[chain] || chain
}

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export const formatGasPrice = (gasPrice: string | number, unit: string = 'gwei'): string => {
  const price = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice
  if (isNaN(price)) return '0'
  
  if (unit === 'gwei') {
    return `${price.toFixed(1)} gwei`
  }
  
  return `${price} ${unit}`
}

export const formatSlippage = (slippage: number): string => {
  return `${slippage}%`
}

export const parseAmount = (amount: string): number => {
  const cleaned = amount.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export const isValidAmount = (amount: string): boolean => {
  const parsed = parseAmount(amount)
  return parsed > 0 && !isNaN(parsed)
}

export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}