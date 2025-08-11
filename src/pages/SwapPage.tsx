import React, { useEffect, useState } from 'react'
import { ArrowUpDown, Settings, Info, Zap, Clock, DollarSign } from 'lucide-react'
import { Chain, AssetValue } from '@swapkit/sdk'
import { useSwapStore } from '../stores/swapStore'
import { useWalletStore } from '../stores/walletStore'
import { useSwap } from '../hooks/useSwap'
import { useTokens } from '../hooks/useTokens'
import TokenSelector from '../components/TokenSelector'
import toast from 'react-hot-toast'

const SwapPage: React.FC = () => {
  const {
    sellAsset,
    buyAsset,
    sellAmount,
    sellChain,
    buyChain,
    slippage,
    quotes,
    selectedQuote,
    isLoadingQuotes,
    quoteError,
    isSwapping,
    swapTxHash,
    swapError,
    setSellAsset,
    setBuyAsset,
    setSellAmount,
    setSellChain,
    setBuyChain,
    setSlippage,
    setSelectedQuote,
    swapAssets,
    resetSwap,
  } = useSwapStore()

  const { connectedWallets } = useWalletStore()
  const { getQuotes, executeSwap } = useSwap()
  const { getTokenByIdentifier } = useTokens()

  const [showSettings, setShowSettings] = useState(false)
  const [customSlippage, setCustomSlippage] = useState(slippage.toString())

  // Auto-fetch quotes when parameters change
  useEffect(() => {
    if (sellAsset && buyAsset && sellAmount && sellChain && buyChain) {
      const timeoutId = setTimeout(() => {
        getQuotes()
      }, 500) // Debounce

      return () => clearTimeout(timeoutId)
    }
  }, [sellAsset, buyAsset, sellAmount, sellChain, buyChain, getQuotes])

  const sellTokenData = sellAsset ? getTokenByIdentifier(sellAsset) : null
  const buyTokenData = buyAsset ? getTokenByIdentifier(buyAsset) : null

  const sourceWallet = sellChain ? connectedWallets.find(w => w.chain === sellChain) : null
  const destWallet = buyChain ? connectedWallets.find(w => w.chain === buyChain) : null

  const canSwap = sellAsset && buyAsset && sellAmount && selectedQuote && sourceWallet && destWallet

  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      setSlippage(numValue)
    }
    setCustomSlippage(value)
  }

  const formatAmount = (amount: string, decimals: number = 18) => {
    try {
      const assetValue = AssetValue.from({
        asset: 'ETH.ETH', // Dummy asset for formatting
        value: amount,
        fromBaseDecimal: true,
      })
      return assetValue.toSignificant(6)
    } catch {
      return amount
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h1 className="card-title">Swap</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card-content space-y-4">
          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-700 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slippage Tolerance
                </label>
                <div className="flex space-x-2">
                  {[0.5, 1, 3].map((value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSlippage(value)
                        setCustomSlippage(value.toString())
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        slippage === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={customSlippage}
                      onChange={(e) => handleSlippageChange(e.target.value)}
                      className="w-16 px-2 py-1 text-sm bg-gray-600 border border-gray-500 rounded text-white"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                    <span className="ml-1 text-sm text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">From</label>
              {sourceWallet && (
                <div className="text-sm text-gray-400">
                  Balance: {sourceWallet.balance?.length || 0} tokens
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-700 rounded-lg space-y-3">
              <TokenSelector
                selectedToken={sellAsset}
                selectedChain={sellChain}
                onTokenSelect={(token) => {
                  setSellAsset(token.identifier)
                  setSellChain(token.chain)
                }}
                onChainSelect={setSellChain}
                placeholder="Select token to sell"
              />
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapAssets}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">To</label>
              {destWallet && (
                <div className="text-sm text-gray-400">
                  Balance: {destWallet.balance?.length || 0} tokens
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-700 rounded-lg space-y-3">
              <TokenSelector
                selectedToken={buyAsset}
                selectedChain={buyChain}
                onTokenSelect={(token) => {
                  setBuyAsset(token.identifier)
                  setBuyChain(token.chain)
                }}
                onChainSelect={setBuyChain}
                placeholder="Select token to buy"
              />
              <div className="text-2xl text-white">
                {selectedQuote ? formatAmount(selectedQuote.expectedBuyAmount) : '0.0'}
              </div>
            </div>
          </div>

          {/* Quote Information */}
          {isLoadingQuotes && (
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                <span className="text-gray-300">Getting best price...</span>
              </div>
            </div>
          )}

          {quoteError && (
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{quoteError}</span>
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300">
                {quotes.length} route{quotes.length !== 1 ? 's' : ''} found
              </div>
              
              <div className="space-y-2">
                {quotes.slice(0, 3).map((quote, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuote(quote)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      selectedQuote === quote
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {quote.providers.map((provider, i) => (
                            <span key={i} className="text-xs bg-gray-600 px-2 py-1 rounded">
                              {provider}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {formatAmount(quote.expectedBuyAmount)} {buyTokenData?.symbol}
                        </div>
                        {quote.estimatedTime && (
                          <div className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            ~{formatTime(quote.estimatedTime.total)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={() => selectedQuote && executeSwap(selectedQuote)}
            disabled={!canSwap || isSwapping}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwapping ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Swapping...</span>
              </div>
            ) : !sourceWallet || !destWallet ? (
              'Connect Wallets'
            ) : !sellAsset || !buyAsset ? (
              'Select Tokens'
            ) : !sellAmount ? (
              'Enter Amount'
            ) : !selectedQuote ? (
              'Get Quote'
            ) : (
              'Swap'
            )}
          </button>

          {/* Transaction Result */}
          {swapTxHash && (
            <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-green-400 font-medium">Swap Successful!</div>
                  <div className="text-sm text-gray-300">
                    TX: {swapTxHash.slice(0, 10)}...{swapTxHash.slice(-8)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {swapError && (
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-red-400" />
                <div>
                  <div className="text-red-400 font-medium">Swap Failed</div>
                  <div className="text-sm text-gray-300">{swapError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(swapTxHash || swapError) && (
            <button
              onClick={resetSwap}
              className="w-full btn-outline"
            >
              New Swap
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SwapPage