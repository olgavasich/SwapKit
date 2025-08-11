import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { Chain } from '@swapkit/sdk'
import { useTokens } from '../hooks/useTokens'
import type { Token } from '../stores/tokenStore'

interface TokenSelectorProps {
  selectedToken: string | null
  selectedChain: Chain | null
  onTokenSelect: (token: Token) => void
  onChainSelect: (chain: Chain) => void
  placeholder?: string
  label?: string
}

const SUPPORTED_CHAINS = [
  { chain: Chain.Ethereum, name: 'Ethereum', symbol: 'ETH' },
  { chain: Chain.Bitcoin, name: 'Bitcoin', symbol: 'BTC' },
  { chain: Chain.BinanceSmartChain, name: 'BSC', symbol: 'BNB' },
  { chain: Chain.Avalanche, name: 'Avalanche', symbol: 'AVAX' },
  { chain: Chain.Polygon, name: 'Polygon', symbol: 'MATIC' },
  { chain: Chain.Arbitrum, name: 'Arbitrum', symbol: 'ARB' },
  { chain: Chain.Optimism, name: 'Optimism', symbol: 'OP' },
  { chain: Chain.THORChain, name: 'THORChain', symbol: 'RUNE' },
  { chain: Chain.Cosmos, name: 'Cosmos', symbol: 'ATOM' },
  { chain: Chain.Solana, name: 'Solana', symbol: 'SOL' },
]

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  selectedChain,
  onTokenSelect,
  onChainSelect,
  placeholder = "Select token",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'chains' | 'tokens'>('chains')
  
  const { tokens, isLoadingTokens, searchTokens, getTokenByIdentifier, getTokenLogo } = useTokens()

  const selectedTokenData = selectedToken ? getTokenByIdentifier(selectedToken) : null
  const chainData = SUPPORTED_CHAINS.find(c => c.chain === selectedChain)

  // Filter tokens based on search and selected chain
  const filteredTokens = searchTokens(searchQuery, selectedChain ? [selectedChain] : undefined)
    .slice(0, 50) // Limit results for performance

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    onChainSelect(token.chain)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleChainSelect = (chain: Chain) => {
    onChainSelect(chain)
    setActiveTab('tokens')
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedTokenData ? (
            <>
              <img
                src={getTokenLogo(selectedTokenData.identifier)}
                alt={selectedTokenData.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/24/374151/9CA3AF?text=${selectedTokenData.symbol.charAt(0)}`
                }}
              />
              <div className="text-left">
                <div className="text-white font-medium">{selectedTokenData.symbol}</div>
                <div className="text-xs text-gray-400">{chainData?.name}</div>
              </div>
            </>
          ) : chainData ? (
            <>
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {chainData.symbol.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-white font-medium">{chainData.name}</div>
                <div className="text-xs text-gray-400">Select token</div>
              </div>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Select Token</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('chains')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'chains'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chains
              </button>
              <button
                onClick={() => setActiveTab('tokens')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'tokens'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tokens
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chains' ? (
                <div className="p-4 space-y-2 overflow-y-auto max-h-96">
                  {SUPPORTED_CHAINS.map(({ chain, name, symbol }) => (
                    <button
                      key={chain}
                      onClick={() => handleChainSelect(chain)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        selectedChain === chain
                          ? 'bg-primary-600/20 border border-primary-500'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-sm text-white font-bold">
                          {symbol.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">{name}</div>
                        <div className="text-xs text-gray-400">{symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Search */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tokens..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Token List */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {isLoadingTokens ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    ) : filteredTokens.length > 0 ? (
                      <div className="space-y-2">
                        {filteredTokens.map((token) => (
                          <button
                            key={token.identifier}
                            onClick={() => handleTokenSelect(token)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                              selectedToken === token.identifier
                                ? 'bg-primary-600/20 border border-primary-500'
                                : 'hover:bg-gray-700'
                            }`}
                          >
                            <img
                              src={getTokenLogo(token.identifier)}
                              alt={token.symbol}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/32/374151/9CA3AF?text=${token.symbol.charAt(0)}`
                              }}
                            />
                            <div className="flex-1 text-left">
                              <div className="text-white font-medium">{token.symbol}</div>
                              <div className="text-xs text-gray-400">{token.name}</div>
                            </div>
                            <div className="text-xs text-gray-400">{token.chain}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        {selectedChain ? 'No tokens found' : 'Select a chain first'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenSelector