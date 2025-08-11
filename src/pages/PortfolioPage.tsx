import React, { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'
import { useSwapKit } from '../providers/SwapKitProvider'
import { useTokens } from '../hooks/useTokens'
import type { AssetValue } from '@swapkit/sdk'

interface WalletBalance {
  chain: string
  address: string
  balance: AssetValue[]
  totalValue: number
  isLoading: boolean
  error?: string
}

const PortfolioPage: React.FC = () => {
  const { connectedWallets, updateWalletBalance } = useWalletStore()
  const { swapKit } = useSwapKit()
  const { loadTokenPrices, getTokenLogo } = useTokens()
  
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)

  const loadWalletBalances = async () => {
    if (!swapKit || connectedWallets.length === 0) return

    setIsRefreshing(true)
    const balances: WalletBalance[] = []

    for (const wallet of connectedWallets) {
      const walletBalance: WalletBalance = {
        chain: wallet.chain,
        address: wallet.address,
        balance: [],
        totalValue: 0,
        isLoading: true,
      }
      
      balances.push(walletBalance)
      setWalletBalances([...balances])

      try {
        // Get balance from SwapKit
        const balance = await swapKit.getBalance(wallet.chain, true) // Force refresh
        
        // Update wallet balance in store
        updateWalletBalance(wallet.chain, balance)
        
        // Get token prices
        const tokenIdentifiers = balance.map(asset => asset.toString())
        const prices = await loadTokenPrices(tokenIdentifiers)
        
        // Calculate total value
        let totalValue = 0
        balance.forEach(asset => {
          const price = prices[asset.toString()] || 0
          totalValue += asset.getValue('number') * price
        })

        // Update wallet balance
        const updatedBalance = balances.find(b => b.chain === wallet.chain && b.address === wallet.address)
        if (updatedBalance) {
          updatedBalance.balance = balance
          updatedBalance.totalValue = totalValue
          updatedBalance.isLoading = false
        }
        
        setWalletBalances([...balances])
        
      } catch (error) {
        const updatedBalance = balances.find(b => b.chain === wallet.chain && b.address === wallet.address)
        if (updatedBalance) {
          updatedBalance.isLoading = false
          updatedBalance.error = error instanceof Error ? error.message : 'Failed to load balance'
        }
        setWalletBalances([...balances])
      }
    }

    // Calculate total portfolio value
    const total = balances.reduce((sum, wallet) => sum + wallet.totalValue, 0)
    setTotalPortfolioValue(total)
    
    setIsRefreshing(false)
  }

  useEffect(() => {
    loadWalletBalances()
  }, [connectedWallets, swapKit])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatValue = (value: number) => {
    if (value === 0) return '$0.00'
    if (value < 0.01) return '<$0.01'
    if (value < 1000) return `$${value.toFixed(2)}`
    if (value < 1000000) return `$${(value / 1000).toFixed(1)}K`
    return `$${(value / 1000000).toFixed(1)}M`
  }

  if (connectedWallets.length === 0) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Wallets Connected</h2>
        <p className="text-gray-400 mb-6">Connect your wallets to view your portfolio</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h1 className="card-title">Portfolio</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                title={showBalances ? 'Hide balances' : 'Show balances'}
              >
                {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={loadWalletBalances}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                title="Refresh balances"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-content">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {showBalances ? formatValue(totalPortfolioValue) : '••••••'}
            </div>
            <div className="text-gray-400">Total Portfolio Value</div>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="space-y-4">
        {walletBalances.map((wallet) => (
          <div key={`${wallet.chain}-${wallet.address}`} className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {wallet.chain.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{wallet.chain}</h3>
                    <p className="text-sm text-gray-400">{formatAddress(wallet.address)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {showBalances ? formatValue(wallet.totalValue) : '••••••'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {wallet.balance.length} token{wallet.balance.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-content">
              {wallet.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : wallet.error ? (
                <div className="text-center py-8">
                  <p className="text-red-400">{wallet.error}</p>
                </div>
              ) : wallet.balance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tokens found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wallet.balance
                    .filter(asset => asset.getValue('number') > 0)
                    .sort((a, b) => b.getValue('number') - a.getValue('number'))
                    .slice(0, 10) // Show top 10 tokens
                    .map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getTokenLogo(asset.toString())}
                            alt={asset.symbol}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/32/374151/9CA3AF?text=${asset.symbol.charAt(0)}`
                            }}
                          />
                          <div>
                            <div className="font-medium text-white">{asset.symbol}</div>
                            <div className="text-sm text-gray-400">{asset.chain}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {showBalances ? asset.toSignificant(6) : '••••••'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {showBalances ? `≈ ${formatValue(asset.getValue('number') * 0)}` : '••••••'}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {wallet.balance.filter(asset => asset.getValue('number') > 0).length > 10 && (
                    <div className="text-center py-2">
                      <span className="text-sm text-gray-400">
                        +{wallet.balance.filter(asset => asset.getValue('number') > 0).length - 10} more tokens
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">24h Change</div>
                <div className="text-lg font-semibold text-green-400">+0.00%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Wallets</div>
                <div className="text-lg font-semibold text-white">{connectedWallets.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Tokens</div>
                <div className="text-lg font-semibold text-white">
                  {walletBalances.reduce((sum, wallet) => sum + wallet.balance.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage